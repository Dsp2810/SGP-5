import { useState, useEffect } from 'react';
import {
  Template1, Template2, Template3, Template4, Template5,
  Template6, Template7, Template8, Template9, Template10
} from '../templates';

const TEMPLATES_MAP = {
  template1: Template1, template2: Template2, template3: Template3,
  template4: Template4, template5: Template5, template6: Template6,
  template7: Template7, template8: Template8, template9: Template9,
  template10: Template10
};

const TEMPLATE_META = [
  { key: 'template1', name: 'Ocean Blue', desc: 'Professional blue gradient', gradient: 'from-blue-600 to-cyan-600', ring: 'ring-blue-200 border-blue-500', letter: 'A', letterColor: 'text-blue-600' },
  { key: 'template2', name: 'Sunset Orange', desc: 'Creative warm orange', gradient: 'from-orange-500 to-red-500', ring: 'ring-orange-200 border-orange-500', letter: 'B', letterColor: 'text-orange-600' },
  { key: 'template3', name: 'Forest Green', desc: 'Natural green gradient', gradient: 'from-green-600 to-emerald-600', ring: 'ring-green-200 border-green-500', letter: 'C', letterColor: 'text-green-600' },
  { key: 'template4', name: 'Royal Purple', desc: 'Luxurious purple & pink', gradient: 'from-purple-600 to-pink-600', ring: 'ring-purple-200 border-purple-500', letter: 'D', letterColor: 'text-purple-600' },
  { key: 'template5', name: 'Midnight Dark', desc: 'Modern dark mode', gradient: 'from-gray-800 to-gray-900', ring: 'ring-indigo-200 border-indigo-500', letter: 'E', letterColor: 'text-indigo-400' },
  { key: 'template6', name: 'Teal Aqua', desc: 'Fresh teal theme', gradient: 'from-teal-500 to-cyan-500', ring: 'ring-teal-200 border-teal-500', letter: 'F', letterColor: 'text-teal-600' },
  { key: 'template7', name: 'Rose Pink', desc: 'Elegant & stylish', gradient: 'from-rose-500 to-pink-500', ring: 'ring-rose-200 border-rose-500', letter: 'G', letterColor: 'text-rose-600' },
  { key: 'template8', name: 'Amber Gold', desc: 'Warm & professional', gradient: 'from-amber-600 to-yellow-600', ring: 'ring-amber-200 border-amber-500', letter: 'H', letterColor: 'text-amber-600' },
  { key: 'template9', name: 'Slate Gray', desc: 'Minimalist design', gradient: 'from-slate-700 to-gray-700', ring: 'ring-slate-200 border-slate-500', letter: 'I', letterColor: 'text-slate-600' },
  { key: 'template10', name: 'Indigo Violet', desc: 'Creative tech-savvy', gradient: 'from-indigo-600 to-violet-600', ring: 'ring-indigo-200 border-indigo-500', letter: 'J', letterColor: 'text-indigo-600' }
];

const API_BASE = 'http://localhost:5000/api/portfolio';

function PortfolioGenerator() {
  // Views: 'home' | 'create' | 'deployed'
  const [view, setView] = useState('home');
  const [currentStep, setCurrentStep] = useState(1); // 1=Upload, 2=Review, 3=Template

  // Portfolio data
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [portfolioData, setPortfolioData] = useState({
    name: '', title: '', email: '', phone: '', location: '', about: '',
    github: '', linkedin: '', portfolio: '', profilePhoto: '',
    experience: [], education: [], skills: [], projects: [],
    certifications: [], achievements: []
  });
  const [selectedTemplate, setSelectedTemplate] = useState('template1');

  // Deployed portfolio data
  const [deployedPortfolio, setDeployedPortfolio] = useState(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [vercelUrl, setVercelUrl] = useState('');
  const [vercelDeploying, setVercelDeploying] = useState(false);
  const [copied, setCopied] = useState('');

  // My Portfolios
  const [myPortfolios, setMyPortfolios] = useState([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => { fetchMyPortfolios(); }, []);

  const fetchMyPortfolios = async () => {
    setLoadingPortfolios(true);
    try {
      const res = await fetch(`${API_BASE}/my-portfolios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setMyPortfolios(result.portfolios || []);
    } catch (err) {
      console.error('Fetch portfolios error:', err);
    } finally {
      setLoadingPortfolios(false);
    }
  };

  // ────── Resume Upload ──────
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) { setError('Please upload a PDF or DOCX file'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('File size must be less than 10MB'); return; }

    setResumeFile(file);
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await fetch(`${API_BASE}/parse-resume`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setPortfolioData(prev => ({
          ...prev, ...result.data,
          experience: result.data.experience || [],
          education: result.data.education || [],
          skills: result.data.skills || [],
          projects: result.data.projects || [],
          certifications: result.data.certifications || [],
          achievements: result.data.achievements || []
        }));
        setResumeParsed(true);
        setTimeout(() => setCurrentStep(2), 800);
      } else {
        setError(result.message || 'Failed to parse resume');
      }
    } catch (err) {
      setError('Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ────── Data Handlers ──────
  const handleDataUpdate = (field, value) => setPortfolioData(prev => ({ ...prev, [field]: value }));
  const handleArrayAdd = (field, template) => setPortfolioData(prev => ({ ...prev, [field]: [...prev[field], template] }));
  const handleArrayRemove = (field, index) => setPortfolioData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  const handleArrayUpdate = (field, index, key, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? (typeof key === 'string' ? { ...item, [key]: value } : value) : item)
    }));
  };
  const handleAddSkill = (skill) => {
    if (skill && !portfolioData.skills.includes(skill)) {
      setPortfolioData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };
  const handleRemoveSkill = (skill) => setPortfolioData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  // ────── Deploy to MongoDB ──────
  const handleDeploy = async () => {
    if (!portfolioData.name || !portfolioData.title) { setError('Name and Title are required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ portfolioData, template: selectedTemplate })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        const url = result.username
          ? `${window.location.origin}/${result.username}`
          : `${window.location.origin}/p/${result.portfolioId}`;
        setPortfolioLink(url);
        setDeployedPortfolio(result.portfolio);
        setView('deployed');
        setSuccessMsg('Portfolio deployed successfully!');
        fetchMyPortfolios();
      } else {
        setError(result.message || 'Deployment failed');
      }
    } catch (err) {
      setError('Failed to deploy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ────── Deploy to Vercel ──────
  const handleDeployToVercel = async (portfolioId) => {
    setVercelDeploying(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/deploy-vercel/${portfolioId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setVercelUrl(result.vercelUrl);
        setSuccessMsg('Deployed to Vercel! Your portfolio is live.');
        fetchMyPortfolios();
      } else {
        setError(result.message || 'Vercel deployment failed');
      }
    } catch (err) {
      setError('Vercel deployment failed. Please try again.');
    } finally {
      setVercelDeploying(false);
    }
  };

  // ────── Delete Portfolio ──────
  const handleDeletePortfolio = async (portfolioId) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    try {
      const res = await fetch(`${API_BASE}/${portfolioId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSuccessMsg('Portfolio deleted');
        fetchMyPortfolios();
      }
    } catch (err) {
      setError('Failed to delete portfolio');
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleCreateNew = () => {
    setPortfolioData({
      name: '', title: '', email: '', phone: '', location: '', about: '',
      github: '', linkedin: '', portfolio: '', profilePhoto: '',
      experience: [], education: [], skills: [], projects: [],
      certifications: [], achievements: []
    });
    setSelectedTemplate('template1');
    setResumeFile(null);
    setResumeParsed(false);
    setPortfolioLink('');
    setVercelUrl('');
    setDeployedPortfolio(null);
    setCurrentStep(1);
    setView('create');
    setError('');
    setSuccessMsg('');
  };

  // ────── Step Indicator ──────
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {['Upload Resume', 'Review & Edit', 'Select Template'].map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              currentStep > i + 1 ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
              currentStep === i + 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' :
              'bg-gray-100 text-gray-400'
            }`}>
              {currentStep > i + 1 ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${currentStep === i + 1 ? 'text-blue-700' : 'text-gray-400'}`}>{label}</span>
          </div>
          {i < 2 && <div className={`w-12 h-0.5 mx-3 ${currentStep > i + 1 ? 'bg-green-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  // ────── Alert ──────
  const Alert = ({ type, message, onClose }) => {
    if (!message) return null;
    const styles = type === 'error' ? 'bg-red-50 border-red-400 text-red-800' : 'bg-green-50 border-green-400 text-green-800';
    return (
      <div className={`border-l-4 rounded-lg p-4 mb-6 flex items-start justify-between ${styles}`}>
        <div className="flex items-center gap-2">
          <span>{type === 'error' ? '⚠️' : '✅'}</span>
          <span className="font-medium text-sm">{message}</span>
        </div>
        <button onClick={onClose} className="text-lg font-bold opacity-60 hover:opacity-100">×</button>
      </div>
    );
  };

  // ════════════════════════════════════════════
  //  HOME VIEW: My Portfolios + Create New
  // ════════════════════════════════════════════
  if (view === 'home') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Portfolio Generator</h1>
            <p className="text-gray-500 mt-1">Create, manage, and deploy your professional portfolio</p>
          </div>
          <button onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create New Portfolio
          </button>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myPortfolios.length}</p>
                <p className="text-sm text-gray-500">Total Portfolios</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myPortfolios.reduce((s, p) => s + (p.views || 0), 0)}</p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myPortfolios.filter(p => p.vercelDeployment?.url).length}</p>
                <p className="text-sm text-gray-500">Deployed on Vercel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolios List */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Portfolios</h2>
          {loadingPortfolios ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : myPortfolios.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">📂</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No portfolios yet</h3>
              <p className="text-gray-500 mb-6">Create your first portfolio by uploading your resume</p>
              <button onClick={handleCreateNew} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all">
                Create Your First Portfolio
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {myPortfolios.map((p) => {
                const tmpl = TEMPLATE_META.find(t => t.key === p.template) || TEMPLATE_META[0];
                return (
                  <div key={p.portfolioId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="flex flex-col lg:flex-row">
                      <div className={`w-full lg:w-2 bg-gradient-to-b ${tmpl.gradient} shrink-0`} />
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{p.personalInfo?.name || 'Unnamed'}</h3>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                p.vercelDeployment?.url ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {p.vercelDeployment?.url ? '● Live on Vercel' : '● Local Only'}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-1">{p.personalInfo?.title}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                              <span>🎨 {tmpl.name}</span>
                              <span>👁 {p.views || 0} views</span>
                              <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <a href={p.username ? `${window.location.origin}/${p.username}` : `${window.location.origin}/p/${p.portfolioId}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              Visit
                            </a>
                            <button onClick={() => copyToClipboard(p.username ? `${window.location.origin}/${p.username}` : `${window.location.origin}/p/${p.portfolioId}`, p.portfolioId)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all">
                              {copied === p.portfolioId ? '✅ Copied!' : '📋 Copy Link'}
                            </button>
                            {p.vercelDeployment?.url ? (
                              <a href={p.vercelDeployment.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L24 22H0L12 1Z" /></svg>
                                Vercel URL
                              </a>
                            ) : (
                              <button onClick={() => handleDeployToVercel(p.portfolioId)} disabled={vercelDeploying}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all">
                                {vercelDeploying ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L24 22H0L12 1Z" /></svg>
                                )}
                                Deploy to Vercel
                              </button>
                            )}
                            <button onClick={() => handleDeletePortfolio(p.portfolioId)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════
  //  DEPLOYED VIEW
  // ════════════════════════════════════════════
  if (view === 'deployed') {
    return (
      <div className="space-y-6">
        <button onClick={() => setView('home')} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Portfolios
        </button>
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Portfolio is Live!</h2>
          <p className="text-gray-500 mb-8">Your portfolio has been created and is ready to share</p>

          {/* Local Link */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
            <p className="text-sm text-gray-500 mb-3 font-medium">Local Portfolio Link</p>
            <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3">
              <a href={portfolioLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-blue-600 hover:text-blue-700 font-medium text-sm break-all text-left">
                {portfolioLink}
              </a>
              <button onClick={() => copyToClipboard(portfolioLink, 'local')} className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                {copied === 'local' ? '✅' : '📋 Copy'}
              </button>
            </div>
            <a href={portfolioLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Visit Portfolio
            </a>
          </div>

          {/* Vercel Deploy */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-6 max-w-2xl mx-auto text-white">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L24 22H0L12 1Z" /></svg>
              <h3 className="text-lg font-bold">Deploy to Vercel</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">Get a permanent, fast-loading URL for your portfolio</p>
            {vercelUrl ? (
              <div>
                <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-3 mb-4">
                  <a href={vercelUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-green-400 hover:text-green-300 font-medium text-sm break-all text-left">
                    {vercelUrl}
                  </a>
                  <button onClick={() => copyToClipboard(vercelUrl, 'vercel')} className="shrink-0 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100">
                    {copied === 'vercel' ? '✅' : '📋 Copy'}
                  </button>
                </div>
                <a href={vercelUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L24 22H0L12 1Z" /></svg>
                  Visit on Vercel
                </a>
              </div>
            ) : (
              <button onClick={() => handleDeployToVercel(deployedPortfolio?.portfolioId)} disabled={vercelDeploying}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 disabled:opacity-50 transition-all">
                {vercelDeploying ? (
                  <><div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /> Deploying to Vercel...</>
                ) : (
                  <><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L24 22H0L12 1Z" /></svg> Deploy to Vercel</>
                )}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button onClick={() => { setView('create'); setCurrentStep(3); }} className="px-6 py-3 bg-purple-50 text-purple-700 rounded-xl font-semibold hover:bg-purple-100 transition-all">
              🎨 Change Template
            </button>
            <button onClick={() => { setView('create'); setCurrentStep(2); }} className="px-6 py-3 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-all">
              ✏️ Edit Content
            </button>
            <button onClick={() => setView('home')} className="px-6 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              📂 My Portfolios
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════
  //  CREATE VIEW: 3-Step Wizard
  // ════════════════════════════════════════════
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => setView('home')} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Portfolios
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">Create Portfolio</h1>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      <StepIndicator />

      {/* STEP 1: Upload */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Your Resume</h2>
              <p className="text-gray-500 text-sm">We'll auto-extract your details using AI</p>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center hover:border-blue-400 transition-all bg-gray-50/50">
            <label className="cursor-pointer block">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <span className="text-lg font-semibold text-gray-700 block mb-2">
                {resumeFile ? `✅ ${resumeFile.name}` : 'Choose a file or drag it here'}
              </span>
              <span className="text-sm text-gray-400">PDF, DOC, DOCX — Max 10MB</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={loading} className="hidden" />
            </label>
            {loading && (
              <div className="mt-8">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-gray-600 font-medium">Extracting portfolio details with AI...</p>
              </div>
            )}
            {resumeParsed && !loading && (
              <div className="mt-8 inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Resume processed! Redirecting...
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <button onClick={() => setCurrentStep(2)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Skip — I'll fill in manually →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Review & Edit */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {resumeParsed && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Resume Data Extracted!</h3>
                  <p className="text-sm text-gray-600">Review and edit the information below</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Portfolio Details</h2>
              <button onClick={() => setCurrentStep(1)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">← Re-upload Resume</button>
            </div>

            {/* Personal Info */}
            <SectionCard title="Personal Information" icon="👤">
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Full Name" required value={portfolioData.name} onChange={v => handleDataUpdate('name', v)} placeholder="John Doe" />
                <InputField label="Job Title" required value={portfolioData.title} onChange={v => handleDataUpdate('title', v)} placeholder="Full Stack Developer" />
                <InputField label="Email" value={portfolioData.email} onChange={v => handleDataUpdate('email', v)} placeholder="john@example.com" type="email" />
                <InputField label="Phone" value={portfolioData.phone} onChange={v => handleDataUpdate('phone', v)} placeholder="+91 9876543210" />
                <InputField label="Location" value={portfolioData.location} onChange={v => handleDataUpdate('location', v)} placeholder="Mumbai, India" />
                <InputField label="GitHub" value={portfolioData.github} onChange={v => handleDataUpdate('github', v)} placeholder="https://github.com/username" />
                <InputField label="LinkedIn" value={portfolioData.linkedin} onChange={v => handleDataUpdate('linkedin', v)} placeholder="https://linkedin.com/in/username" />
                <InputField label="Website" value={portfolioData.portfolio} onChange={v => handleDataUpdate('portfolio', v)} placeholder="https://yoursite.com" />
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">About / Bio</label>
                  <textarea value={portfolioData.about} onChange={e => handleDataUpdate('about', e.target.value)} rows="4"
                    placeholder="Write a brief about yourself..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                </div>
              </div>
            </SectionCard>

            {/* Experience */}
            <SectionCard title="Experience" icon="💼" onAdd={() => handleArrayAdd('experience', { company: '', position: '', duration: '', description: '' })}>
              {portfolioData.experience.map((exp, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl mb-3 relative group">
                  <button onClick={() => handleArrayRemove('experience', i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input placeholder="Position" value={exp.position} onChange={e => handleArrayUpdate('experience', i, 'position', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <input placeholder="Company" value={exp.company} onChange={e => handleArrayUpdate('experience', i, 'company', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <input placeholder="Duration" value={exp.duration} onChange={e => handleArrayUpdate('experience', i, 'duration', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none md:col-span-2" />
                    <textarea placeholder="Description" value={exp.description} onChange={e => handleArrayUpdate('experience', i, 'description', e.target.value)} rows="2" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none md:col-span-2 resize-none" />
                  </div>
                </div>
              ))}
              {portfolioData.experience.length === 0 && <EmptyState text="No experience added" />}
            </SectionCard>

            {/* Education */}
            <SectionCard title="Education" icon="🎓" onAdd={() => handleArrayAdd('education', { degree: '', institution: '', year: '', cgpa: '' })}>
              {portfolioData.education.map((edu, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl mb-3 relative group">
                  <button onClick={() => handleArrayRemove('education', i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input placeholder="Degree" value={edu.degree} onChange={e => handleArrayUpdate('education', i, 'degree', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none md:col-span-2" />
                    <input placeholder="Institution" value={edu.institution} onChange={e => handleArrayUpdate('education', i, 'institution', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <input placeholder="Year" value={edu.year} onChange={e => handleArrayUpdate('education', i, 'year', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              ))}
              {portfolioData.education.length === 0 && <EmptyState text="No education added" />}
            </SectionCard>

            {/* Skills */}
            <SectionCard title="Skills" icon="⚡">
              <div className="flex flex-wrap gap-2 mb-4">
                {portfolioData.skills.map((skill, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-blue-900">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Add a skill (press Enter)" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(e.target.value.trim()); e.target.value = ''; } }} />
                <button onClick={e => { const input = e.target.closest('div').querySelector('input'); handleAddSkill(input.value.trim()); input.value = ''; }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Add</button>
              </div>
            </SectionCard>

            {/* Projects */}
            <SectionCard title="Projects" icon="🚀" onAdd={() => handleArrayAdd('projects', { name: '', description: '', technologies: [], link: '' })}>
              {portfolioData.projects.map((proj, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl mb-3 relative group">
                  <button onClick={() => handleArrayRemove('projects', i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="space-y-3">
                    <input placeholder="Project Name" value={proj.name} onChange={e => handleArrayUpdate('projects', i, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <textarea placeholder="Description" value={proj.description} onChange={e => handleArrayUpdate('projects', i, 'description', e.target.value)} rows="2" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
                    <input placeholder="Technologies (comma separated)" value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''} onChange={e => handleArrayUpdate('projects', i, 'technologies', e.target.value.split(',').map(t => t.trim()))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <input placeholder="Project Link (optional)" value={proj.link || ''} onChange={e => handleArrayUpdate('projects', i, 'link', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              ))}
              {portfolioData.projects.length === 0 && <EmptyState text="No projects added" />}
            </SectionCard>

            {/* Certifications */}
            <SectionCard title="Certifications" icon="🏅" onAdd={() => handleArrayAdd('certifications', '')}>
              {portfolioData.certifications.map((cert, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input placeholder="e.g., AWS Certified Developer" value={cert} onChange={e => handleArrayUpdate('certifications', i, null, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <button onClick={() => handleArrayRemove('certifications', i)} className="text-red-400 hover:text-red-600 px-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {portfolioData.certifications.length === 0 && <EmptyState text="No certifications added" />}
            </SectionCard>

            {/* Achievements */}
            <SectionCard title="Achievements" icon="🏆" onAdd={() => handleArrayAdd('achievements', '')}>
              {portfolioData.achievements.map((ach, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input placeholder="e.g., Won National Hackathon" value={ach} onChange={e => handleArrayUpdate('achievements', i, null, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <button onClick={() => handleArrayRemove('achievements', i)} className="text-red-400 hover:text-red-600 px-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {portfolioData.achievements.length === 0 && <EmptyState text="No achievements added" />}
            </SectionCard>

            <button onClick={() => {
                if (!portfolioData.name || !portfolioData.title) {
                  setError('Please fill in Name and Title before continuing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                setError('');
                setCurrentStep(3);
              }}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200">
              Continue to Template Selection →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Template Selection */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Template</h2>
                <p className="text-gray-500 text-sm mt-1">10 professionally designed themes</p>
              </div>
              <button onClick={() => setCurrentStep(2)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">← Back to Edit</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {TEMPLATE_META.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.key;
                return (
                  <div key={tmpl.key} onClick={() => setSelectedTemplate(tmpl.key)}
                    className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 group ${
                      isSelected ? `${tmpl.ring} ring-4 shadow-lg scale-[1.03]` : 'border-gray-100 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1'
                    }`}>
                    <div className={`bg-gradient-to-br ${tmpl.gradient} h-32 flex items-end p-3 text-white relative overflow-hidden`}>
                      {/* Mock layout lines */}
                      <div className="absolute inset-0 p-3 flex flex-col items-center justify-center opacity-80">
                        <div className="w-8 h-8 rounded-full bg-white/30 mb-2 ring-2 ring-white/20" />
                        <div className="h-1.5 w-16 bg-white/40 rounded-full mb-1" />
                        <div className="h-1 w-12 bg-white/25 rounded-full mb-2" />
                        <div className="flex gap-1">
                          <div className="h-1 w-4 bg-white/30 rounded-full" />
                          <div className="h-1 w-4 bg-white/30 rounded-full" />
                          <div className="h-1 w-4 bg-white/30 rounded-full" />
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    </div>
                    <div className="p-3 bg-white">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tmpl.gradient}`} />
                        <h3 className="font-bold text-gray-800 text-xs truncate">{tmpl.name}</h3>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">{tmpl.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Live Preview</h3>
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {(() => {
                  const TemplateComp = TEMPLATES_MAP[selectedTemplate] || Template1;
                  return <TemplateComp data={portfolioData} />;
                })()}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button onClick={handleDeploy} disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-green-200">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deploying...
                </span>
              ) : '🚀 Deploy Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────── Sub-Components ────────

function SectionCard({ title, icon, children, onAdd }) {
  return (
    <div className="mb-6 p-6 bg-gray-50/50 border border-gray-100 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        {onAdd && (
          <button onClick={onAdd} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          required && !value ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200'
        }`} />
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="text-gray-400 text-center py-4 text-sm">{text}</p>;
}

export default PortfolioGenerator;
