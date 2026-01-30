# SGP-5: Job Portal & Career Assistant (Placify)

## Architecture Overview

Full-stack MERN application with:
- **Frontend**: React 19 + Vite + Tailwind CSS 4 (port 5173)
- **Backend**: Express.js REST API (port 5000)
- **Database**: MongoDB via Mongoose

```
Frontend (React) → http://localhost:5000/api/* → Backend (Express) → MongoDB
                              ↓
                     JWT Auth (localStorage)
```

## Frontend Structure (`frontend/src/`)

### Routing Pattern
```jsx
// App.jsx - Nested routing under Dashboard
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
  <Route index element={<DashboardHome />} />
  <Route path="resume" element={<ResumeBuilder />} />
  <Route path="portfolio" element={<PortfolioGenerator />} />
  // ... more feature routes
</Route>
```

### Folder Organization
- `pages/` - Route-level components (Login, Register, Dashboard, DashboardHome)
- `components/features/` - Feature modules (ResumeBuilder, ATSAnalyzer, JobTracker, MockInterview, AptitudeTest, PortfolioGenerator)
- `components/common/` - Reusable UI (Button, Card, Modal - add here)
- `components/ProtectedRoute.jsx` - Auth wrapper checking `localStorage.getItem('token')`

### Barrel Exports
```javascript
// Use: import { Login, Register } from './pages'
// Each folder has index.js exporting all components
```

### API Call Pattern
```javascript
// All API calls follow this pattern:
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}` // for protected routes
  },
  body: JSON.stringify(data)
});
const result = await response.json();
```

### State Management Pattern
```javascript
// Feature components use local useState for form data
const [resumeData, setResumeData] = useState({
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
  education: [{ degree: '', institution: '', startDate: '', endDate: '', cgpa: '' }],
  // ... nested arrays with add/remove handlers
});

// Handler pattern for nested state
const handleEducationChange = (index, field, value) => {
  const newEducation = [...resumeData.education];
  newEducation[index][field] = value;
  setResumeData({ ...resumeData, education: newEducation });
};
```

### Tailwind CSS Conventions
- Gray color palette (`gray-50` to `gray-900`) as primary theme
- Gradient backgrounds: `bg-gradient-to-br from-gray-50 to-gray-100`
- Rounded corners: `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- Custom animation: `animate-blob` for background decorative elements
- Form inputs: Include icon with `absolute` positioning inside `relative` wrapper

### Adding a New Feature
1. Create `frontend/src/components/features/NewFeature.jsx`
2. Export from `frontend/src/components/features/index.js`
3. Add route in `App.jsx` under Dashboard: `<Route path="newfeature" element={<NewFeature />} />`
4. Add menu item in `Dashboard.jsx` menuItems array with name, path, and SVG icon

## Backend Structure (`backend/src/`)

### Route Pattern
```javascript
// routes/feature.routes.js
router.post('/action', protect, controllerFunction);
// All routes mounted under /api in routes/index.js
```

### Authentication
- JWT stored in `localStorage`, sent as `Authorization: Bearer <token>`
- `protect` middleware in `middleware/auth.middleware.js`
- Passwords hashed with bcryptjs in User model pre-save hook

### Resume Data Schema
```javascript
{
  personalInfo: { name, email, phone, location, linkedin, github, website },
  education: [{ degree, specialization, institution, endDate, cgpa }],
  experience: [{ position, company, location, startDate, endDate, responsibilities[] }],
  projects: [{ title, link, description, technologies[] }],
  skills: { 'Category': ['skill1', 'skill2'] },
  certifications: [{ name, issuer, date }],
  achievements: ['string']
}
```

### Resume Generation
- DOCX: Uses `docx` library with `ExternalHyperlink` for clickable links
- LaTeX: Template in `templates/resume.template.js` with `\href{}{}` for hyperlinks

## Development Commands

```bash
# Frontend (from frontend/)
npm run dev          # Vite dev server on port 5173

# Backend (from backend/)
npm run dev          # nodemon on port 5000

# CLI Resume Builder
node build-resume.js # Interactive: 1=LaTeX, 2=DOCX
```

## Environment Variables (backend/.env)
```
MONGO_URI=mongodb://...
JWT_SECRET=your_secret
PORT=5000
EMAIL_HOST=smtp...
EMAIL_USER=...
EMAIL_PASS=...
```

## File Naming
- React components: PascalCase (`ResumeBuilder.jsx`)
- Routes/controllers: kebab-case (`auth.routes.js`)
- Models: PascalCase singular (`User.js`)
