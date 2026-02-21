# Surya OCR Integration for Resume Parsing

This document explains how to set up and use Surya OCR for extracting information from resumes in the Placify application.

## What is Surya OCR?

Surya is a powerful OCR (Optical Character Recognition) tool that excels at extracting text from:
- Scanned PDF documents
- Image-based resumes (JPG, PNG)
- Complex layouts and multi-column documents
- Documents with mixed fonts and styles

## Features

- **Automatic OCR Detection**: PDFs are automatically processed with Surya OCR for better text extraction
- **Intelligent Parsing**: Extracts structured data including:
  - Personal information (name, email, phone, location)
  - Social links (LinkedIn, GitHub, portfolio)
  - Work experience
  - Education details
  - Skills and projects
  - Certifications and achievements
- **Fallback System**: If OCR fails, the system falls back to traditional text extraction methods

## Installation

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install:
- `surya-ocr` - The main OCR library
- `pillow` - Image processing
- `pdf2image` - PDF to image conversion
- `pypdfium2` - PDF rendering
- `sentence-transformers` - For ATS scoring
- `torch` - Deep learning framework

### 2. System Requirements

- **Python**: 3.8 or higher
- **RAM**: Minimum 4GB (8GB recommended for larger documents)
- **Storage**: ~2GB for model files (downloaded on first use)

### 3. Test the Installation

```bash
# Test the OCR script directly
python src/services/resumeOCR.py path/to/your/resume.pdf
```

Expected output:
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    ...
  },
  "message": "Resume processed successfully"
}
```

## How It Works

### Process Flow

1. **Upload**: User uploads resume (PDF/DOCX) via Portfolio Generator
2. **Detection**: Backend detects if file is a PDF
3. **OCR Processing**: 
   - Saves file temporarily  
   - Calls `resumeOCR.py` Python script
   - Surya OCR extracts text from PDF pages
   - Script parses text into structured data
4. **Data Extraction**: Structured data is returned to frontend
5. **Portfolio Generation**: User reviews and edits data, then generates portfolio

### Extraction Methods (in order of priority)

1. **Surya OCR** (for PDFs) - Best for scanned documents
2. **Hugging Face AI** (for text-based documents) - Intelligent extraction
3. **Regex Fallback** - Basic pattern matching

## API Usage

### Parse Resume with OCR

**Endpoint**: `POST /api/portfolio/parse-resume`

**Headers**:
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Body**:
```
resume: <file> (PDF or DOCX, max 10MB)
```

**Response**:
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "title": "Full Stack Developer",
    "about": "Passionate developer with 5 years of experience...",
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "skills": ["JavaScript", "React", "Node.js", "Python"],
    "experience": [
      {
        "position": "Senior Developer",
        "company": "Tech Corp",
        "duration": "2020-Present"
      }
    ],
    "education": [
      {
        "degree": "B.Tech Computer Science",
        "institution": "University Name",
        "year": "2019"
      }
    ],
    "projects": [],
    "certifications": [],
    "achievements": []
  }
}
```

## Troubleshooting

### Common Issues

#### 1. OCR Taking Too Long
- **Solution**: OCR has a 60-second timeout. Large PDFs may timeout and fallback to text extraction
- **Recommendation**: Use PDFs under 5 pages for optimal performance

#### 2. Python Script Not Found
```
Error: Surya OCR Error: python: command not found
```
- **Solution**: Ensure Python 3.8+ is installed and added to PATH
- **Windows**: Use `python` or `py` command
- **Mac/Linux**: Use `python3` command

#### 3. Model Download Issues
- **Issue**: First run downloads ~2GB of model files
- **Solution**: Ensure stable internet connection on first use
- **Models are cached**: Subsequent runs are faster

#### 4. Memory Issues
```
Error: CUDA out of memory / RAM exceeded
```
- **Solution**: Reduce PDF size or use fewer pages
- **Alternative**: OCR will automatically fallback to text extraction

### Debug Mode

Enable debug logging in the backend:

```javascript
// In portfolio.controller.js
console.log('OCR Input:', tempFilePath);
console.log('OCR Output:', portfolioData);
```

## Performance Tips

1. **Optimize PDF Size**: Keep PDFs under 5MB for faster processing
2. **Use High-Quality Scans**: Better image quality = better OCR results
3. **Prefer Text PDFs**: If resume is already text-based, DOCX format is faster
4. **First Run**: Allow extra time for model downloads (~2-3 minutes)

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── resumeOCR.py          # Surya OCR script
│   │   └── atsScorer.py          # ATS scoring (existing)
│   ├── controllers/
│   │   └── portfolio.controller.js  # Updated with OCR integration
│   └── ...
├── temp/                          # Temporary file storage (gitignored)
├── requirements.txt               # Updated with OCR dependencies
└── SURYA_OCR_SETUP.md            # This file
```

## Future Enhancements

- [ ] Support for image uploads (JPG, PNG) directly
- [ ] Multi-language OCR support
- [ ] Layout detection and preservation
- [ ] Batch resume processing
- [ ] OCR quality scoring

## Credits

- **Surya OCR**: https://github.com/VikParuchuri/surya
- **Sentence Transformers**: https://www.sbert.net/

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review console logs for error details
3. Test the OCR script independently
4. Ensure all dependencies are installed correctly

---

**Last Updated**: February 21, 2026
