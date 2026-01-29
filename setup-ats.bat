@echo off
echo ====================================
echo ATS Resume Analyzer Setup
echo ====================================
echo.

echo [1/3] Installing Node.js dependencies...
cd backend
call npm install
echo.

echo [2/3] Installing Python dependencies...
cd ..
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

call .venv\Scripts\activate
pip install spacy pdfplumber python-docx
echo.

echo [3/3] Downloading spaCy language model...
python -m spacy download en_core_web_sm
echo.

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo To start the backend server:
echo   cd backend
echo   npm run dev
echo.
echo Then test ATS at: http://localhost:3000/dashboard
echo (Navigate to ATS Analyzer from dashboard)
echo.
pause
