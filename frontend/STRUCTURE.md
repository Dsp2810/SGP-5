# Frontend Project Structure

## 📁 Organized Folder Structure

```
frontend/
├── src/
│   ├── assets/              # Static assets (images, icons, etc.)
│   ├── pages/               # Main page components (route-level)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DashboardHome.jsx
│   │   └── index.js         # Export all pages
│   │
│   ├── components/
│   │   ├── features/        # Feature-specific components
│   │   │   ├── PortfolioGenerator.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── JobTracker.jsx
│   │   │   ├── ATSAnalyzer.jsx
│   │   │   ├── MockInterview.jsx
│   │   │   ├── AptitudeTest.jsx
│   │   │   └── index.js     # Export all feature components
│   │   │
│   │   └── common/          # Reusable UI components
│   │       ├── Button.jsx   # (Example - add as needed)
│   │       ├── Card.jsx     # (Example - add as needed)
│   │       └── index.js     # Export all common components
│   │
│   ├── App.jsx              # Main app component with routing
│   ├── App.css
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
```

## 🎯 Folder Guidelines

### `/pages`
- **Purpose**: Main route/page-level components
- **Contains**: Authentication pages, Dashboard, and other top-level pages
- **Usage**: Components that correspond to routes in App.jsx

### `/components/features`
- **Purpose**: Feature-specific components used within pages
- **Contains**: Complex feature modules (Portfolio, Resume, Job Tracker, etc.)
- **Usage**: Components that provide specific functionality

### `/components/common`
- **Purpose**: Reusable UI components shared across the app
- **Contains**: Buttons, Cards, Modals, Form elements, etc.
- **Usage**: Generic components used in multiple places

## 📦 Import Examples

### Using named exports (Recommended):
```javascript
// Import pages
import { Login, Register, Dashboard } from './pages';

// Import features
import { PortfolioGenerator, ResumeBuilder } from './components/features';

// Import common components
import { Button, Card } from './components/common';
```

### Using default exports (Current):
```javascript
import Login from './pages/Login';
import PortfolioGenerator from './components/features/PortfolioGenerator';
```

## 🔄 Migration Complete

All components have been reorganized from a flat structure to a well-organized hierarchy:

**Before:**
```
components/
├── Login.jsx
├── Register.jsx
├── Dashboard.jsx
├── PortfolioGenerator.jsx
└── ... (all mixed together)
```

**After:**
```
pages/              → Authentication & main pages
components/
├── features/       → Feature modules
└── common/         → Reusable components
```

## 🚀 Benefits

✅ **Better Organization**: Clear separation of concerns  
✅ **Scalability**: Easy to add new features or components  
✅ **Maintainability**: Find files quickly and logically  
✅ **Team Collaboration**: Clear structure for team members  
✅ **Import Clarity**: Understand component types from import paths  

## 📝 Notes

- All imports in `App.jsx` have been updated to reflect the new structure
- Index files created for easier batch imports
- Common components folder ready for reusable UI elements
- Follow this structure when adding new components
