.PHONY: help setup clean serve backup deploy test

# Variables
PORT ?= 8000
BACKUP_DIR = ./backups
TIMESTAMP = $(shell date +%Y%m%d_%H%M%S)

help:
	@echo "Registration System - Makefile Commands"
	@echo "-----------------------------------------------"
	@echo "make setup     - Create necessary directories and initialize data files"
	@echo "make serve     - Start a local web server"
	@echo "make clean     - Clear browser storage data and reset application"
	@echo "make backup    - Create a backup of registration data"
	@echo "make deploy    - Prepare files for deployment"
	@echo "make test      - Run basic tests on the application"
	@echo ""
	@echo "Usage: make [command]"

setup:
	@echo "Setting up Registration System..."
	@mkdir -p $(BACKUP_DIR)
	@touch data.json candidates.csv
	@echo "[]" > data.json
	@echo "ID,First Name,Last Name,Unique Code,Registration Date" > candidates.csv
	@echo "Setup complete. Data files initialized."
	@ls -la data.json candidates.csv

serve:
	@echo "Starting local web server on port $(PORT)..."
	@echo "Open your browser and navigate to: http://localhost:$(PORT)"
	@python3 -m http.server $(PORT) || python -m http.server $(PORT) || echo "Python not found. Please install Python or use another web server."

clean:
	@echo "Cleaning up application data..."
	@rm -f $(BACKUP_DIR)/*.json $(BACKUP_DIR)/*.csv
	@echo "[]" > data.json
	@echo "ID,First Name,Last Name,Unique Code,Registration Date" > candidates.csv
	@echo "Clean complete. Data files reset to initial state."

backup:
	@echo "Creating backup of registration data..."
	@mkdir -p $(BACKUP_DIR)
	@cp data.json $(BACKUP_DIR)/data_$(TIMESTAMP).json
	@cp candidates.csv $(BACKUP_DIR)/candidates_$(TIMESTAMP).csv
	@echo "Backup created in $(BACKUP_DIR)/"
	@ls -la $(BACKUP_DIR)/

deploy:
	@echo "Preparing files for deployment..."
	@mkdir -p dist
	@cp index.html style.css script.js dist/
	@cp data.json candidates.csv dist/ 2>/dev/null || :
	@echo "Deployment files ready in ./dist directory"

test:
	@echo "Running basic tests..."
	@echo "✓ Checking HTML file: $$(if [ -f index.html ]; then echo 'OK'; else echo 'MISSING'; fi)"
	@echo "✓ Checking CSS file: $$(if [ -f style.css ]; then echo 'OK'; else echo 'MISSING'; fi)"
	@echo "✓ Checking JS file: $$(if [ -f script.js ]; then echo 'OK'; else echo 'MISSING'; fi)"
	@echo "✓ Checking JSON file: $$(if [ -f data.json ]; then echo 'OK'; else echo 'MISSING'; fi)"
	@echo "✓ Checking CSV file: $$(if [ -f candidates.csv ]; then echo 'OK'; else echo 'MISSING'; fi)"
	@echo "Basic file structure test complete"
