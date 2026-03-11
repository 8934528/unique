// Global variables
let candidates = [];
let charts = {};
let activityLog = [];

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    loadExistingData();
    initializeEventListeners();
    initializeCharts();
    startLiveClock();
    updateUI();
});

// Initialize event listeners
function initializeEventListeners() {
    // Registration form
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        registerCandidate();
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });

    // Search on enter
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRegistrations();
        }
    });

    // Real-time search as you type (optional)
    document.getElementById('searchInput').addEventListener('input', debounce(function() {
        if (this.value.length > 2) {
            searchRegistrations();
        }
    }, 300));
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Switch tabs
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('text-cyan-400', 'border-b-2', 'border-cyan-400');
            btn.classList.remove('text-slate-400');
        } else {
            btn.classList.remove('text-cyan-400', 'border-b-2', 'border-cyan-400');
            btn.classList.add('text-slate-400');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.add('hidden');
    });
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');

    // Refresh tab content if needed
    if (tabId === 'history') {
        refreshHistory();
    } else if (tabId === 'analytics') {
        refreshAnalytics();
    }
}

// Generate unique code
function generateUniqueCode(id, firstName, lastName) {
    const combined = id + firstName + lastName + Date.now().toString().slice(-4);
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const positiveHash = Math.abs(hash);
    const base36 = positiveHash.toString(36).toUpperCase();
    let uniqueCode = base36.padStart(8, '0').substring(0, 8);
    // Format as XXXX-XXXX
    return uniqueCode.substring(0, 4) + '-' + uniqueCode.substring(4);
}

// Register new candidate
function registerCandidate() {
    const idNumber = document.getElementById('idNumber').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const category = document.getElementById('category').value;

    if (!idNumber || !firstName || !lastName) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const uniqueCode = generateUniqueCode(idNumber, firstName, lastName);
    const now = new Date();
    
    const candidate = {
        id: idNumber,
        firstName: firstName,
        lastName: lastName,
        email: email || 'Not provided',
        phone: phone || 'Not provided',
        category: category,
        uniqueCode: uniqueCode,
        registrationDate: now.toISOString(),
        registrationDateFormatted: formatDate(now)
    };

    candidates.push(candidate);
    
    // Save data
    saveToStorage();
    logActivity('Registration', `New candidate: ${firstName} ${lastName}`);
    
    // Display
    displayCandidateInfo(candidate);
    generateQRCode(uniqueCode, idNumber, firstName, lastName, email, phone, category);
    
    // Clear form
    document.getElementById('registrationForm').reset();
    
    // Visual feedback
    document.querySelector('.col-span-6').classList.add('glow-effect');
    setTimeout(() => {
        document.querySelector('.col-span-6').classList.remove('glow-effect');
    }, 1000);

    // Update UI
    updateUI();
    showNotification('Registration successful!', 'success');
}

// Display candidate info
function displayCandidateInfo(candidate) {
    document.getElementById('displayId').textContent = candidate.id;
    document.getElementById('displayName').textContent = candidate.firstName;
    document.getElementById('displaySurname').textContent = candidate.lastName;
    document.getElementById('displayCode').textContent = candidate.uniqueCode;
    document.getElementById('displayEmail').textContent = candidate.email;
    document.getElementById('displayPhone').textContent = candidate.phone;
    document.getElementById('displayCategory').textContent = formatCategory(candidate.category);
    document.getElementById('displayDate').textContent = candidate.registrationDateFormatted;
    
    document.getElementById('candidateInfo').classList.remove('hidden');
    document.getElementById('noData').classList.add('hidden');
    
    // Update last generated
    document.getElementById('lastGenerated').innerHTML = `
        <span class="text-cyan-400">${candidate.firstName} ${candidate.lastName}</span><br>
        <span class="text-xs text-slate-500">${candidate.uniqueCode}</span>
    `;
}

// Generate QR code
function generateQRCode(uniqueCode, id, firstName, lastName, email, phone, category) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    
    const qrData = JSON.stringify({
        code: uniqueCode,
        id: id,
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        category: category,
        generated: new Date().toISOString()
    }, null, 2);
    
    QRCode.toCanvas(qrData, { width: 150 }, function(error, canvas) {
        if (error) {
            console.error('QR Error:', error);
            qrContainer.innerHTML = '<p class="text-red-400 text-xs">Error generating QR</p>';
        } else {
            qrContainer.appendChild(canvas);
        }
    });
}

// Download QR code
function downloadQRCode() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        showNotification('No QR code to download', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    logActivity('Download', 'QR code downloaded');
}

// Print QR code
function printQRCode() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>Print QR Code</title></head>
        <body style="text-align: center; padding: 50px;">
            <img src="${canvas.toDataURL()}" style="max-width: 300px;">
            <p style="font-family: Arial; margin-top: 20px;">${document.getElementById('displayCode').textContent}</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Copy to clipboard
function copyToClipboard() {
    const code = document.getElementById('displayCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Code copied to clipboard!', 'success');
    });
}

// Save to storage
function saveToStorage() {
    localStorage.setItem('unique_registrations', JSON.stringify(candidates));
    localStorage.setItem('activity_log', JSON.stringify(activityLog));
}

// Load existing data
function loadExistingData() {
    try {
        const savedData = localStorage.getItem('unique_registrations');
        if (savedData) {
            candidates = JSON.parse(savedData);
        }
        
        const savedLog = localStorage.getItem('activity_log');
        if (savedLog) {
            activityLog = JSON.parse(savedLog);
        }
        
        if (candidates.length > 0) {
            const lastCandidate = candidates[candidates.length - 1];
            displayCandidateInfo(lastCandidate);
            generateQRCode(
                lastCandidate.uniqueCode, 
                lastCandidate.id, 
                lastCandidate.firstName, 
                lastCandidate.lastName,
                lastCandidate.email,
                lastCandidate.phone,
                lastCandidate.category
            );
        }
    } catch (e) {
        console.error('Error loading data:', e);
    }
    updateUI();
}

// Update UI elements
function updateUI() {
    const count = candidates.length;
    document.getElementById('totalCount').textContent = count;
    document.getElementById('footerCount').textContent = count;
    
    // Today's count
    const today = new Date().toDateString();
    const todayCount = candidates.filter(c => 
        new Date(c.registrationDate).toDateString() === today
    ).length;
    document.getElementById('todayCount').textContent = todayCount;
    
    // Category summary
    updateCategorySummary();
    refreshRecentActivity();
    refreshHistory();
}

// Update category summary
function updateCategorySummary() {
    const summary = {};
    candidates.forEach(c => {
        summary[c.category] = (summary[c.category] || 0) + 1;
    });
    
    const container = document.getElementById('categorySummary');
    container.innerHTML = '';
    
    Object.entries(summary).forEach(([cat, count]) => {
        const percentage = ((count / candidates.length) * 100).toFixed(1);
        container.innerHTML += `
            <div class="flex justify-between items-center">
                <span class="text-slate-400">${formatCategory(cat)}:</span>
                <span class="text-cyan-400">${count} (${percentage}%)</span>
            </div>
        `;
    });
    
    if (candidates.length === 0) {
        container.innerHTML = '<p class="text-slate-500">No data</p>';
    }
}

// Format category
function formatCategory(cat) {
    const categories = {
        'general': 'General',
        'vip': 'VIP Member',
        'staff': 'Staff',
        'guest': 'Guest',
        'contractor': 'Contractor'
    };
    return categories[cat] || cat;
}

// Format date
function formatDate(date) {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Log activity
function logActivity(action, details) {
    activityLog.unshift({
        action: action,
        details: details,
        timestamp: new Date().toISOString(),
        formatted: formatDate(new Date())
    });
    
    if (activityLog.length > 50) activityLog.pop();
    localStorage.setItem('activity_log', JSON.stringify(activityLog));
    refreshRecentActivity();
}

// Refresh recent activity
function refreshRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (activityLog.length === 0) {
        container.innerHTML = '<p class="text-slate-400">No recent activity</p>';
        return;
    }
    
    container.innerHTML = activityLog.slice(0, 5).map(log => `
        <div class="text-xs border-l-2 border-cyan-600 pl-2 py-1">
            <span class="text-cyan-400">${log.action}</span>
            <span class="text-slate-400 block">${log.details}</span>
            <span class="text-slate-500 text-2xs">${log.formatted}</span>
        </div>
    `).join('');
}

// Refresh history
function refreshHistory(filter = 'all') {
    const container = document.getElementById('historyList');
    if (candidates.length === 0) {
        container.innerHTML = '<p class="text-slate-400 text-center py-4">No registration history</p>';
        return;
    }
    
    let filtered = [...candidates].reverse();
    const now = new Date();
    
    if (filter === 'today') {
        filtered = filtered.filter(c => 
            new Date(c.registrationDate).toDateString() === now.toDateString()
        );
    } else if (filter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(c => new Date(c.registrationDate) >= weekAgo);
    }
    
    container.innerHTML = filtered.map(c => `
        <div class="history-item bg-slate-700/30 p-2 rounded text-xs cursor-pointer hover:bg-slate-700/50"
             onclick="loadHistoryItem('${c.uniqueCode}')">
            <div class="flex justify-between">
                <span class="font-mono text-cyan-400">${c.uniqueCode}</span>
                <span class="text-slate-500">${new Date(c.registrationDate).toLocaleDateString()}</span>
            </div>
            <div class="text-slate-300 mt-1">
                ${c.firstName} ${c.lastName} | ${formatCategory(c.category)}
            </div>
        </div>
    `).join('');
}

// Filter history
function filterHistory(filter) {
    refreshHistory(filter);
}

// Load history item
function loadHistoryItem(code) {
    const candidate = candidates.find(c => c.uniqueCode === code);
    if (candidate) {
        displayCandidateInfo(candidate);
        generateQRCode(
            candidate.uniqueCode,
            candidate.id,
            candidate.firstName,
            candidate.lastName,
            candidate.email,
            candidate.phone,
            candidate.category
        );
        switchTab('details');
        showNotification('Loaded registration from history', 'info');
    }
}

// Search registrations
function searchRegistrations() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsDiv = document.getElementById('searchResults');
    
    if (!query) {
        resultsDiv.classList.add('hidden');
        return;
    }
    
    const results = candidates.filter(c => 
        c.id.toLowerCase().includes(query) ||
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query) ||
        c.uniqueCode.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query))
    );
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="text-slate-400">No results found</p>';
    } else {
        resultsDiv.innerHTML = results.slice(0, 5).map(c => `
            <div class="p-1 hover:bg-slate-600 cursor-pointer" onclick="loadHistoryItem('${c.uniqueCode}')">
                <span class="text-cyan-400">${c.uniqueCode}</span> - ${c.firstName} ${c.lastName}
            </div>
        `).join('');
    }
    
    resultsDiv.classList.remove('hidden');
}

// Initialize charts
function initializeCharts() {
    const ctx1 = document.getElementById('categoryChart').getContext('2d');
    const ctx2 = document.getElementById('trendChart').getContext('2d');
    
    charts.category = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#0891b2', '#06b6d4', '#0e7490', '#155e75', '#164e63']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
    
    charts.trend = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Registrations',
                data: [],
                borderColor: '#06b6d4',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// Refresh analytics
function refreshAnalytics() {
    // Update category chart
    const categories = {};
    candidates.forEach(c => {
        categories[c.category] = (categories[c.category] || 0) + 1;
    });
    
    charts.category.data.labels = Object.keys(categories).map(formatCategory);
    charts.category.data.datasets[0].data = Object.values(categories);
    charts.category.update();
    
    // Update trend chart (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString();
    }).reverse();
    
    const trendData = last7Days.map(date => {
        return candidates.filter(c => 
            new Date(c.registrationDate).toLocaleDateString() === date
        ).length;
    });
    
    charts.trend.data.labels = last7Days;
    charts.trend.data.datasets[0].data = trendData;
    charts.trend.update();
    
    // Update category stats
    const statsDiv = document.getElementById('categoryStats');
    statsDiv.innerHTML = Object.entries(categories).map(([cat, count]) => `
        <div class="flex justify-between">
            <span>${formatCategory(cat)}</span>
            <span class="text-cyan-400">${count}</span>
        </div>
    `).join('');
}

// Export functions
function exportAllData() {
    exportJSON();
    exportCSV();
    showNotification('All data exported', 'success');
}

function exportJSON() {
    const data = JSON.stringify(candidates, null, 2);
    downloadFile('registrations.json', data, 'application/json');
    logActivity('Export', 'JSON file exported');
}

function exportCSV() {
    if (candidates.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Category', 'Unique Code', 'Registration Date'];
    const rows = candidates.map(c => [
        c.id,
        c.firstName,
        c.lastName,
        c.email,
        c.phone,
        c.category,
        c.uniqueCode,
        c.registrationDate
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    downloadFile('registrations.csv', csv, 'text/csv');
    logActivity('Export', 'CSV file exported');
}

function exportExcel() {
    // Simple Excel-compatible CSV
    exportCSV();
    showNotification('Excel-compatible file exported', 'success');
}

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Import data
function importData() {
    const file = document.getElementById('importFile').files[0];
    if (!file) {
        showNotification('Please select a file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            if (file.name.endsWith('.json')) {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    candidates = imported;
                    saveToStorage();
                    updateUI();
                    showNotification('Data imported successfully', 'success');
                    logActivity('Import', `Imported ${imported.length} records`);
                }
            } else if (file.name.endsWith('.csv')) {
                // Basic CSV import (you might want to enhance this)
                showNotification('CSV import - please use JSON for now', 'info');
            }
        } catch (error) {
            showNotification('Error importing file', 'error');
        }
    };
    reader.readAsText(file);
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        candidates = [];
        activityLog = [];
        localStorage.clear();
        updateUI();
        document.getElementById('candidateInfo').classList.add('hidden');
        document.getElementById('noData').classList.remove('hidden');
        document.getElementById('qrcode').innerHTML = '';
        showNotification('All data cleared', 'warning');
        logActivity('System', 'All data cleared');
    }
}

// Generate sample data
function generateSampleData() {
    const firstNames = ['Sihle', 'Jane', 'Peace', 'Mbeko', 'Lona', 'Ezile', 'Zandile', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Lifenathi', 'Siko', 'Jampase', 'Selane', 'Malini', 'Mave'];
    const categories = ['general', 'vip', 'staff', 'guest', 'contractor'];
    
    for (let i = 0; i < 10; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const id = `ID${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        const phone = `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
        const category = categories[Math.floor(Math.random() * categories.length)];
        const uniqueCode = generateUniqueCode(id, firstName, lastName);
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        candidates.push({
            id,
            firstName,
            lastName,
            email,
            phone,
            category,
            uniqueCode,
            registrationDate: date.toISOString(),
            registrationDateFormatted: formatDate(date)
        });
    }
    
    saveToStorage();
    updateUI();
    showNotification('Sample data generated', 'success');
    logActivity('System', 'Generated sample data');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-sm z-50 ${
        type === 'success' ? 'bg-green-600' :
        type === 'error' ? 'bg-red-600' :
        type === 'warning' ? 'bg-amber-600' :
        'bg-blue-600'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Live clock
function startLiveClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    document.getElementById('liveClock').textContent = now.toLocaleTimeString();
}
