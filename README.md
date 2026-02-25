# Placify 🚀

**Your Complete Career Companion**

Placify is a full-stack MERN application that helps job seekers build professional resumes, generate portfolios, track job applications, prepare for interviews, and ace aptitude tests.

## 🌟 Features

- **📄 Resume Builder**: Create professional resumes with multiple templates (LaTeX & DOCX export)
- **💼 Portfolio Generator**: Auto-generate portfolios by uploading a resume (PDF/DOCX) — text is extracted and parsed using **Groq API (llama-3.3-70b-versatile)** to produce a structured portfolio
- **📊 ATS Analyzer**: Analyze your resume with ATS scoring for better job matching
- **📝 Job Tracker**: Track all your job applications in one organized place
- **🎥 Mock Interview**: Practice with AI-based mock interviews
- **✅ Aptitude Tests**: Test your skills with placement readiness assessments

## 🛠️ Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS 4
- React Router DOM

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Python (ATS Scoring)

### AI/ML
- **Groq API (`llama-3.3-70b-versatile`)** for resume parsing and portfolio data extraction
- Sentence Transformers for ATS scoring
- Hugging Face API integration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- MongoDB

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SGP-5.git
cd SGP-5
```

### 2. Setup Backend
```bash
cd backend
npm install

# Setup Python dependencies for OCR
# Windows:
powershell -ExecutionPolicy Bypass -File setup-ocr.ps1

# Linux/Mac:
chmod +x setup-ocr.sh
./setup-ocr.sh
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

### 4. Environment Variables
Create `.env` file in the `backend` directory:
```env
MONGO_URI=mongodb://localhost:27017/placify
JWT_SECRET=your_secret_key_here
PORT=5000

# Optional: Hugging Face (for AI extraction)
HF_TOKEN=your_huggingface_token_here

# Optional: Cloudinary (for image hosting)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Visit `http://localhost:5173` to access the application.

## 📚 New Feature: Surya OCR

### What is Surya OCR?
Surya OCR is a powerful text extraction tool that can read scanned PDFs and images, making it perfect for extracting information from resumes that aren't digitally native.

### How to Use
1. Navigate to **Portfolio Generator**
2. Upload your resume (PDF, DOCX, or image)
3. Surya OCR automatically extracts structured data
4. Review and edit the extracted information
5. Choose a template and generate your portfolio!

### Features of OCR Integration
- ✅ Extracts from scanned PDFs
- ✅ Supports image resumes (JPG, PNG)
- ✅ Intelligent parsing of personal info, skills, experience
- ✅ Automatic fallback to traditional methods
- ✅ 60-second timeout for large documents

For detailed setup and troubleshooting, see [SURYA_OCR_SETUP.md](backend/SURYA_OCR_SETUP.md)

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset

### Portfolio
- `POST /api/portfolio/parse-resume` - Parse resume with OCR (🆕)
- `POST /api/portfolio/deploy` - Deploy portfolio
- `GET /api/portfolio/user/:userId` - Get user portfolios

### Resume
- `POST /api/resume/generate` - Generate resume (LaTeX/DOCX)
- `GET /api/resume/templates` - Get available templates

### ATS
- `POST /api/ats/analyze` - Analyze resume against job description

### Jobs
- `POST /api/jobs` - Add job application
- `GET /api/jobs` - Get all tracked jobs
- `PUT /api/jobs/:id` - Update job status
- `DELETE /api/jobs/:id` - Delete job

## 🗂️ Project Structure

```
SGP-5/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/      # Feature components
│   │   │   ├── templates/     # Portfolio templates
│   │   │   └── common/        # Reusable components
│   │   ├── pages/             # Route pages
│   │   └── main.jsx
│   └── index.html
│
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Python scripts (OCR, ATS)
│   │   ├── middleware/        # Auth middleware
│   │   └── templates/         # Resume templates
│   ├── generated/             # Generated portfolios
│   ├── requirements.txt       # Python dependencies
│   └── SURYA_OCR_SETUP.md    # OCR setup guide
│
└── README.md
```

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start with nodemon
npm start            # Start normally
node build-resume.js # CLI resume builder
```

### Frontend
```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

## 🐛 Troubleshooting

### OCR Not Working?
1. Ensure Python 3.8+ is installed
2. Run the setup script: `setup-ocr.ps1` (Windows) or `setup-ocr.sh` (Linux/Mac)
3. Check console logs for detailed error messages
4. See [SURYA_OCR_SETUP.md](backend/SURYA_OCR_SETUP.md) for more help

### MongoDB Connection Issues?
- Ensure MongoDB is running
- Check MONGO_URI in `.env`
- Default: `mongodb://localhost:27017/placify`

### Port Already in Use?
- Frontend: Change port in `vite.config.js`
- Backend: Change PORT in `.env`

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- Banti Patel - Full Stack Developer

## 🙏 Acknowledgments

- [Surya OCR](https://github.com/VikParuchuri/surya) for amazing OCR capabilities
- [Sentence Transformers](https://www.sbert.net/) for ATS scoring
- [Hugging Face](https://huggingface.co/) for AI model hosting

---

**Made with ❤️ for job seekers everywhere**
