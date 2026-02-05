# 🤖 Hugging Face AI Resume Extraction Setup

## ✅ Quick Setup Guide

### Step 1: Get Your Hugging Face Token (FREE)
1. Go to https://huggingface.co/
2. Sign up or log in
3. Navigate to **Settings → Access Tokens**
4. Click **"New token"**
5. Name it: `Resume Extractor`
6. Select **"Read"** permissions
7. Click **"Generate token"**
8. **Copy the token** (starts with `hf_...`)

### Step 2: Add Token to Environment
Open `backend/.env` and set:
```env
HF_TOKEN=hf_your_actual_token_here
```

### Step 3: Restart Backend
```bash
cd backend
npm run dev
```

## 🚀 How It Works

```
Frontend (Localhost:5173)
   ↓ Upload Resume
Backend (Localhost:5000)
   ↓ Extract Text from PDF/DOCX
Hugging Face Free API
   ↓ Process with Mistral-7B Model
Extract Structured JSON
   ↓ Return Data
Frontend Displays Portfolio
```

## 🎯 Model Being Used
- **mistralai/Mistral-7B-Instruct-v0.2** (Free tier, no cost)
- Extracts: name, email, phone, location, title, experience, education, skills, projects, certifications, achievements, languages

## 🔄 Fallback System
If AI extraction fails (model loading/errors), system automatically uses **enhanced regex extraction** as fallback.

## 💡 Benefits
✅ **Free** - No API costs
✅ **Fast** - Usually responds in 2-5 seconds
✅ **Accurate** - AI understands context and relationships
✅ **Reliable** - Regex fallback ensures data is always extracted

## 🐛 Troubleshooting

### "Model is loading"
First request might trigger model loading (20-30 seconds). Subsequent requests are instant.

### "HF_TOKEN not configured"
Make sure your token is in `.env` and backend is restarted.

### Extraction returns empty
System will automatically use regex fallback - you'll still get data!

## 📝 Testing
Upload any PDF/DOCX resume and watch the console:
- `🤖 Calling Hugging Face API...` - AI extraction started
- `✅ HF API returned...` - AI response received
- `✅ Successfully parsed AI extracted data` - Success!
- `❌ HF API failed, using regex fallback` - Using fallback
