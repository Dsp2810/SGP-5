#!/usr/bin/env pwsh
# Surya OCR Setup Script for Windows
# Run this script to install Python dependencies for OCR functionality

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Placify - Surya OCR Setup" -ForegroundColor Cyan  
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.8 or higher from https://www.python.org/" -ForegroundColor Red
    exit 1
}

# Check Python version
$versionMatch = $pythonVersion -match "Python (\d+)\.(\d+)"
if ($versionMatch) {
    $majorVersion = [int]$Matches[1]
    $minorVersion = [int]$Matches[2]
    
    if ($majorVersion -lt 3 -or ($majorVersion -eq 3 -and $minorVersion -lt 8)) {
        Write-Host "✗ Python 3.8 or higher is required" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes and will download ~2GB of models on first use." -ForegroundColor Yellow
Write-Host ""

# Change to backend directory
$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendDir

# Install requirements
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "✓ Setup Complete!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start the backend server: npm run dev" -ForegroundColor White
    Write-Host "2. Upload a resume PDF in the Portfolio Generator" -ForegroundColor White
    Write-Host "3. OCR will automatically extract data from scanned documents" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: First OCR extraction will download models (~2GB)" -ForegroundColor Yellow
    Write-Host "      Subsequent runs will be much faster!" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✗ Installation failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above" -ForegroundColor Red
    exit 1
}
