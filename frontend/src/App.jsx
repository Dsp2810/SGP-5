import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'
import DashboardHome from './components/DashboardHome'
import PortfolioGenerator from './components/PortfolioGenerator'
import ResumeBuilder from './components/ResumeBuilder'
import JobTracker from './components/JobTracker'
import ATSAnalyzer from './components/ATSAnalyzer'
import MockInterview from './components/MockInterview'
import AptitudeTest from './components/AptitudeTest'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
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
