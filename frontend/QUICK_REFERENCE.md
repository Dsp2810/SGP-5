# 📚 Quick Reference Guide

## Current Project Structure

```
src/
├── pages/                          ← 🔵 ROUTE PAGES (5 files)
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── Dashboard.jsx
│   └── DashboardHome.jsx
│
├── components/
│   ├── features/                   ← 🟢 FEATURE MODULES (6 files)
│   │   ├── PortfolioGenerator.jsx
│   │   ├── ResumeBuilder.jsx
│   │   ├── JobTracker.jsx
│   │   ├── ATSAnalyzer.jsx
│   │   ├── MockInterview.jsx
│   │   └── AptitudeTest.jsx
│   │
│   └── common/                     ← 🟡 REUSABLE COMPONENTS (empty - ready for use)
│       └── (Add buttons, cards, modals, etc.)
│
└── assets/                         ← 🟣 STATIC FILES
    └── (images, icons, fonts, etc.)
```

## 🎯 When to Add Where?

### ➡️ Add to `/pages` if:
- ✅ It's a route/page (has its own URL)
- ✅ It's a main section (Auth, Dashboard, Settings, Profile)
- ✅ It's used directly in App.jsx routing

**Example:**
```javascript
// src/pages/Profile.jsx
function Profile() {
  return <div>User Profile Page</div>
}
```

### ➡️ Add to `/components/features` if:
- ✅ It's a specific feature/tool
- ✅ It has complex logic and UI
- ✅ It's used inside Dashboard or other pages
- ✅ It's a self-contained module

**Example:**
```javascript
// src/components/features/SalaryCalculator.jsx
function SalaryCalculator() {
  return <div>Salary Calculator Tool</div>
}
```

### ➡️ Add to `/components/common` if:
- ✅ It's reusable across multiple pages
- ✅ It's a UI element (Button, Card, Modal, Input)
- ✅ It has no specific business logic
- ✅ Multiple features use it

**Example:**
```javascript
// src/components/common/Button.jsx
function Button({ children, onClick, variant }) {
  return <button onClick={onClick}>{children}</button>
}
```

## 📦 Import Cheat Sheet

```javascript
// ===== CURRENT WAY (Default Imports) =====
import Login from './pages/Login'
import PortfolioGenerator from './components/features/PortfolioGenerator'

// ===== CLEANER WAY (Using index.js barrel files) =====
import { Login, Register, Dashboard } from './pages'
import { PortfolioGenerator, ResumeBuilder } from './components/features'
import { Button, Card } from './components/common'
```

## 🔧 File Naming Conventions

| Type | Naming | Example |
|------|--------|---------|
| Pages | PascalCase | `Login.jsx`, `Dashboard.jsx` |
| Features | PascalCase | `PortfolioGenerator.jsx` |
| Common Components | PascalCase | `Button.jsx`, `Modal.jsx` |
| Utilities | camelCase | `formatDate.js`, `apiHelper.js` |
| Styles | same as component | `Button.module.css` |

## 🚀 Quick Commands

```bash
# View pages structure
ls src/pages

# View features structure  
ls src/components/features

# View common components
ls src/components/common

# Create new page
touch src/pages/NewPage.jsx

# Create new feature
touch src/components/features/NewFeature.jsx

# Create new common component
touch src/components/common/Button.jsx
```

## ✅ Checklist for New Components

When adding a new component:

- [ ] Decide: Is it a page, feature, or common component?
- [ ] Create file in appropriate folder
- [ ] Add export to index.js (for cleaner imports)
- [ ] Import in App.jsx if it's a page/route
- [ ] Test the import path works

## 🎨 Suggested Common Components to Add

Create these in `/components/common` as needed:

```
common/
├── Button.jsx          → Reusable button
├── Card.jsx            → Content card wrapper
├── Input.jsx           → Form input field
├── Modal.jsx           → Popup modal
├── Loader.jsx          → Loading spinner
├── Alert.jsx           → Alert/notification
├── Badge.jsx           → Status badge
└── Navbar.jsx          → Navigation bar (if shared)
```

## 📁 Full File Locations

| Component | Location |
|-----------|----------|
| Login | `src/pages/Login.jsx` |
| Register | `src/pages/Register.jsx` |
| ForgotPassword | `src/pages/ForgotPassword.jsx` |
| Dashboard | `src/pages/Dashboard.jsx` |
| DashboardHome | `src/pages/DashboardHome.jsx` |
| PortfolioGenerator | `src/components/features/PortfolioGenerator.jsx` |
| ResumeBuilder | `src/components/features/ResumeBuilder.jsx` |
| JobTracker | `src/components/features/JobTracker.jsx` |
| ATSAnalyzer | `src/components/features/ATSAnalyzer.jsx` |
| MockInterview | `src/components/features/MockInterview.jsx` |
| AptitudeTest | `src/components/features/AptitudeTest.jsx` |

---

**Last Updated:** Dec 31, 2025  
**Status:** ✅ All components organized and working  
**App.jsx:** ✅ Updated with new import paths  
