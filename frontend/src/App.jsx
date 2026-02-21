import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import DashboardHome from './pages/DashboardHome'
// Feature Components
import PortfolioGenerator from './components/features/PortfolioGenerator'
import ResumeBuilder from './components/features/ResumeBuilder'
import JobTracker from './components/features/JobTracker'
import ATSAnalyzer from './components/features/ATSAnalyzer'
import MockInterview from './components/features/MockInterview'
import AptitudeTest from './components/features/AptitudeTest'
import PublicPortfolio from './pages/PublicPortfolio'
// Protected Route
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/p/:id" element={<PublicPortfolio />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="portfolio" element={<PortfolioGenerator />} />
          <Route path="resume" element={<ResumeBuilder />} />
          <Route path="jobs" element={<JobTracker />} />
          <Route path="ats" element={<ATSAnalyzer />} />
          <Route path="interview" element={<MockInterview />} />
          <Route path="aptitude" element={<AptitudeTest />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
