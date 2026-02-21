#!/bin/bash
# Surya OCR Setup Script for Linux/Mac
# Run this script to install Python dependencies for OCR functionality

echo "===================================="
echo "  Placify - Surya OCR Setup"
echo "===================================="
echo ""

# Check if Python is installed
echo "Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
    PYTHON_VERSION=$(python3 --version)
    echo "✓ Found: $PYTHON_VERSION"
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
    PYTHON_VERSION=$(python --version)
    echo "✓ Found: $PYTHON_VERSION"
else
    echo "✗ Python not found!"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Check Python version
VERSION_CHECK=$($PYTHON_CMD -c 'import sys; print(sys.version_info >= (3, 8))')
if [ "$VERSION_CHECK" != "True" ]; then
    echo "✗ Python 3.8 or higher is required"
    exit 1
fi

echo ""
echo "Installing Python dependencies..."
echo "This may take a few minutes and will download ~2GB of models on first use."
echo ""

# Change to backend directory
cd "$(dirname "$0")"

# Install requirements
$PYTHON_CMD -m pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "===================================="
    echo "✓ Setup Complete!"
    echo "===================================="
    echo ""
    echo "Next steps:"
    echo "1. Start the backend server: npm run dev"
    echo "2. Upload a resume PDF in the Portfolio Generator"
    echo "3. OCR will automatically extract data from scanned documents"
    echo ""
    echo "Note: First OCR extraction will download models (~2GB)"
    echo "      Subsequent runs will be much faster!"
else
    echo ""
    echo "✗ Installation failed!"
    echo "Please check the error messages above"
    exit 1
fi
