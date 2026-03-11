# UniqueID Pro - Advanced Registration System

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-stable-brightgreen)

registration and identity management system that generates unique identification codes and QR codes for candidates. Built with HTML, CSS, and JavaScript, featuring a professional dark-themed interface with multiple tabs, analytics, and data management tools.

![UniqueID Pro Screenshot](screenshot-placeholder.jpg)

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [System Architecture](#system-architecture)
- [File Structure](#file-structure)
- [API Reference](#api-reference)
- [Data Formats](#data-formats)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Core Functionality

- **Unique Code Generation** - 8-character alphanumeric codes (XXXX-XXXX format)
- **QR Code Generation** - Scannable QR codes with embedded candidate data
- **Multi-format Export** - JSON, CSV, and Excel-compatible exports
- **Data Import** - Import existing registrations from JSON files

### User Interface

- **3-Column Layout** - Optimized for desktop use
- **Tab System** - Details, History, Analytics, and Tools tabs
- **Professional Fonts** - Segoe UI / Times New Roman
- **Dark Theme** - Easy on the eyes for extended use
- **Responsive Design** - Fixed desktop layout (non-mobile)

### Advanced Features

- **Real-time Search** - Search by ID, name, email, or unique code
- **Activity Logging** - Track all system actions
- **Analytics Dashboard** - Charts and statistics
- **Category Management** - General, VIP, Staff, Guest, Contractor
- **History View** - Browse past registrations with filters
- **Quick Actions** - Copy codes, download QR codes, print
- **Live Clock** - Real-time timestamp in footer

### Data Management

- **Local Storage** - Persistent data in browser
- **Export Options** - Multiple formats with one click
- **Sample Data** - Generate test data
- **Clear Data** - Reset system when needed
- **Backup Compatible** - Easy to backup JSON files

## 🛠 Technology Stack

- **HTML5** - Structure and semantics
- **CSS3** - Styling with Tailwind CSS
- **JavaScript** - Core functionality (ES6+)
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icons and visual elements
- **QRCode.js** - QR code generation
- **Chart.js** - Analytics and data visualization

### External Dependencies

        html
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

        <!-- QR Code Generator -->
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>

        <!-- Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

---
