import { useState } from 'react';
import {
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
  Template7,
  Template8,
  Template9,
  Template10
} from '../templates';

function PortfolioGenerator() {
  // Step tracking: 1=AllDataSources, 2=Review, 3=Template, 4=Final
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data sources
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [linkedInFetched, setLinkedInFetched] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(''); // 'linkedin' or 'resume'
  const [validationError, setValidationError] = useState('');
  
  // Portfolio data (merged from all sources)
  const [portfolioData, setPortfolioData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    about: '',
    linkedin: '',
    github: '',
    profilePhoto: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  // Selected template
  const [selectedTemplate, setSelectedTemplate] = useState('template1');

  // STEP 1: LinkedIn Import
  const handleLinkedInImport = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingType('linkedin');
    
    // Simulate API call to fetch LinkedIn data
    setTimeout(() => {
      const mockLinkedInData = {
        name: 'John Doe',
        title: 'Full Stack Developer',
        email: 'john.doe@email.com',
        phone: '+1 234 567 890',
        location: 'San Francisco, CA',
        about: 'Passionate full-stack developer with 5+ years of experience in building scalable web applications. Expertise in React, Node.js, and cloud technologies.',
        linkedin: linkedInUrl,
        github: 'https://github.com/johndoe',
        profilePhoto: '',
        experience: [
          {
            company: 'Tech Corp',
            position: 'Senior Developer',
            duration: '2021 - Present',
            description: 'Led development of enterprise applications serving 100K+ users'
          },
          {
            company: 'StartupXYZ',
            position: 'Full Stack Developer',
            duration: '2019 - 2021',
            description: 'Built and maintained multiple client projects using modern web technologies'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of California',
            year: '2019'
          }
        ],
        skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'Docker', 'TypeScript', 'GraphQL'],
        projects: []
      };
      
      // Merge with existing data
      setPortfolioData(prev => ({
        ...prev,
        ...mockLinkedInData,
        // Preserve manually entered projects if any
        projects: prev.projects.length > 0 ? prev.projects : mockLinkedInData.projects
      }));
      setLinkedInFetched(true);
      setLoading(false);
      setLoadingType('');
    }, 2000);
  };

  // STEP 1: Resume Upload (Optional)
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setLoading(true);
      setLoadingType('resume');
      
      // Simulate API call to parse resume
      setTimeout(() => {
        const mockResumeData = {
          phone: portfolioData.phone || '+1 555-123-4567',
          location: portfolioData.location || 'New York, NY',
          about: portfolioData.about || 'Experienced software engineer specializing in full-stack web development.',
          github: portfolioData.github || 'https://github.com/janesmith',
          skills: [...new Set([...portfolioData.skills, 'JavaScript', 'React', 'Python', 'Django', 'PostgreSQL'])],
          projects: [
            ...portfolioData.projects,
            {
              name: 'E-commerce Platform',
              description: 'Built a full-featured e-commerce platform with payment integration',
              technologies: ['React', 'Node.js', 'MongoDB'],
              link: ''
            }
          ]
        };
        
        // Merge resume data with existing data (don't override LinkedIn data)
        setPortfolioData(prev => ({
          ...prev,
          ...mockResumeData,
          // Keep name, title, email from LinkedIn if already filled
          name: prev.name || mockResumeData.name,
          title: prev.title || mockResumeData.title,
          email: prev.email || mockResumeData.email,
        }));
        setResumeParsed(true);
        setLoading(false);
        setLoadingType('');
      }, 2000);
    }
  };

  // Continue to Review
  const handleContinueToReview = () => {
    if (!portfolioData.name || !portfolioData.title) {
      setValidationError('Please provide at least your name and job title (from LinkedIn, Resume, or manually)');
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setValidationError('');
    setCurrentStep(2); // Move to review
  };

  // STEP 2: Update portfolio data in review
  const handleDataUpdate = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddExperience = () => {
    setPortfolioData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        duration: '',
        description: ''
      }]
    }));
  };

  const handleRemoveExperience = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateExperience = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleAddEducation = () => {
    setPortfolioData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        year: ''
      }]
    }));
  };

  const handleRemoveEducation = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateEducation = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleAddProject = () => {
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        link: ''
      }]
    }));
  };

  const handleRemoveProject = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateProject = (index, field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const handleAddSkill = (skill) => {
    if (skill && !portfolioData.skills.includes(skill)) {
      setPortfolioData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleRemoveSkill = (skill) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // STEP 3: Select template and generate
  const handleGeneratePortfolio = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(4);
    }, 1500);
  };

  // Render steps
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-2">
      {['Import Data', 'Review', 'Template', 'Done'].map((label, index) => (
        <div key={index} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
            currentStep > index + 1 ? 'bg-green-500 text-white' :
            currentStep === index + 1 ? 'bg-blue-600 text-white' :
            'bg-gray-200 text-gray-400'
          }`}>
            {currentStep > index + 1 ? '✓' : index + 1}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep === index + 1 ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {label}
          </span>
          {index < 3 && <div className="w-8 h-0.5 mx-2 bg-gray-300" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Portfolio Generator</h1>
        <p className="text-gray-600">Create and download your professional portfolio website</p>
      </div>

      {renderStepIndicator()}

      {/* STEP 1: All Data Sources in One Page */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Validation Error Message */}
          {validationError && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-md animate-shake">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Required Information Missing</h3>
                  <p className="text-red-700 text-sm">{validationError}</p>
                </div>
                <button
                  onClick={() => setValidationError('')}
                  className="text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* LinkedIn Import Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🔗</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Import from LinkedIn</h2>
                <p className="text-gray-600 text-sm">Fetch your professional data automatically</p>
              </div>
            </div>
            <form onSubmit={handleLinkedInImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile URL *
                </label>
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-username"
                  required
                  disabled={linkedInFetched}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading || linkedInFetched}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {linkedInFetched ? (
                  <span className="flex items-center justify-center gap-2">
                    ✓ LinkedIn Data Imported
                  </span>
                ) : loading && loadingType === 'linkedin' ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Fetching Data...
                  </span>
                ) : (
                  'Fetch LinkedIn Data'
                )}
              </button>
            </form>
          </div>

          {/* Resume Upload Section - OPTIONAL */}
          <div className="bg-white rounded-xl shadow-md p-8 relative">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                OPTIONAL
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">📄</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Upload Resume</h2>
                <p className="text-gray-600 text-sm">Add more details from your resume (optional)</p>
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
              <div className="text-5xl mb-4">📤</div>
              <label className="cursor-pointer">
                <span className="text-lg font-semibold text-gray-700">
                  {resumeFile ? `✓ ${resumeFile.name}` : 'Choose a file or drag it here'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={loading || resumeParsed}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Supports PDF, DOC, DOCX (Max 5MB)
              </p>
              {loading && loadingType === 'resume' && (
                <div className="mt-4">
                  <div className="inline-block w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-gray-600">Parsing your resume...</p>
                </div>
              )}
              {resumeParsed && (
                <div className="mt-4 text-green-600 font-semibold">
                  ✓ Resume data merged successfully!
                </div>
              )}
            </div>
          </div>

          {/* Manual Details Section - OPTIONAL */}
          <div className="bg-white rounded-xl shadow-md p-8 relative">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                OPTIONAL
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">✍️</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Add Additional Details</h2>
                <p className="text-gray-600 text-sm">Fill in any missing information manually</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={portfolioData.name}
                    onChange={(e) => handleDataUpdate('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={portfolioData.title}
                    onChange={(e) => handleDataUpdate('title', e.target.value)}
                    placeholder="Full Stack Developer"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={portfolioData.email}
                    onChange={(e) => handleDataUpdate('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={portfolioData.phone}
                    onChange={(e) => handleDataUpdate('phone', e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={portfolioData.location}
                    onChange={(e) => handleDataUpdate('location', e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    value={portfolioData.github}
                    onChange={(e) => handleDataUpdate('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About / Bio</label>
                <textarea
                  value={portfolioData.about}
                  onChange={(e) => handleDataUpdate('about', e.target.value)}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-700 mb-4">
              💡 <strong>Tip:</strong> You can use LinkedIn alone, or combine it with Resume and Manual details for a complete portfolio
            </p>
            <button
              onClick={handleContinueToReview}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Continue to Review & Edit →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Review & Edit Data */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Review & Edit Your Data</h2>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Add More Data
              </button>
            </div>

            {/* Personal Info */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={portfolioData.name}
                    onChange={(e) => handleDataUpdate('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={portfolioData.title}
                    onChange={(e) => handleDataUpdate('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={portfolioData.email}
                    onChange={(e) => handleDataUpdate('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={portfolioData.phone}
                    onChange={(e) => handleDataUpdate('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={portfolioData.location}
                    onChange={(e) => handleDataUpdate('location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                  <textarea
                    value={portfolioData.about}
                    onChange={(e) => handleDataUpdate('about', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Experience</h3>
                <button
                  onClick={handleAddExperience}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  + Add Experience
                </button>
              </div>
              <div className="space-y-4">
                {portfolioData.experience.map((exp, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-600">Experience {index + 1}</span>
                      <button
                        onClick={() => handleRemoveExperience(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 2020 - Present)"
                        value={exp.duration}
                        onChange={(e) => handleUpdateExperience(index, 'duration', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      />
                      <textarea
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                        rows="2"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      />
                    </div>
                  </div>
                ))}
                {portfolioData.experience.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No experience added yet</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Education</h3>
                <button
                  onClick={handleAddEducation}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  + Add Education
                </button>
              </div>
              <div className="space-y-4">
                {portfolioData.education.map((edu, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-600">Education {index + 1}</span>
                      <button
                        onClick={() => handleRemoveEducation(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => handleUpdateEducation(index, 'year', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
                {portfolioData.education.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No education added yet</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {portfolioData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    handleAddSkill(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Projects */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Projects</h3>
                <button
                  onClick={handleAddProject}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  + Add Project
                </button>
              </div>
              <div className="space-y-4">
                {portfolioData.projects.map((project, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-600">Project {index + 1}</span>
                      <button
                        onClick={() => handleRemoveProject(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={project.name}
                        onChange={(e) => handleUpdateProject(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        placeholder="Description"
                        value={project.description}
                        onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Technologies (comma separated)"
                        value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                        onChange={(e) => handleUpdateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="url"
                        placeholder="Project Link (optional)"
                        value={project.link || ''}
                        onChange={(e) => handleUpdateProject(index, 'link', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
                {portfolioData.projects.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No projects added yet</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Continue to Template Selection
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Template Selection */}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <button
            onClick={() => setCurrentStep(2)}
            className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            ← Back to Edit
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Template</h2>
          <p className="text-gray-600 mb-6">Select from 10 modern portfolio designs with unique color combinations</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Template 1: Ocean Blue */}
            <div
              onClick={() => setSelectedTemplate('template1')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template1'
                  ? 'border-blue-500 ring-4 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    A
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-cyan-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Ocean Blue</h3>
                <p className="text-sm text-gray-600">Professional blue gradient design</p>
              </div>
            </div>

            {/* Template 2: Sunset Orange */}
            <div
              onClick={() => setSelectedTemplate('template2')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template2'
                  ? 'border-orange-500 ring-4 ring-orange-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-orange-600 text-2xl font-bold">
                    B
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-orange-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Sunset Orange</h3>
                <p className="text-sm text-gray-600">Creative warm orange theme</p>
              </div>
            </div>

            {/* Template 3: Forest Green */}
            <div
              onClick={() => setSelectedTemplate('template3')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template3'
                  ? 'border-green-500 ring-4 ring-green-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-green-600 text-2xl font-bold">
                    C
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-emerald-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Forest Green</h3>
                <p className="text-sm text-gray-600">Natural green gradient</p>
              </div>
            </div>

            {/* Template 4: Royal Purple */}
            <div
              onClick={() => setSelectedTemplate('template4')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template4'
                  ? 'border-purple-500 ring-4 ring-purple-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-purple-600 text-2xl font-bold">
                    D
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-purple-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Royal Purple</h3>
                <p className="text-sm text-gray-600">Luxurious purple & pink</p>
              </div>
            </div>

            {/* Template 5: Midnight Dark */}
            <div
              onClick={() => setSelectedTemplate('template5')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template5'
                  ? 'border-indigo-500 ring-4 ring-indigo-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gray-900 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-2xl font-bold">
                    E
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-indigo-400 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Midnight Dark</h3>
                <p className="text-sm text-gray-600">Modern dark mode design</p>
              </div>
            </div>

            {/* Template 6: Teal Aqua */}
            <div
              onClick={() => setSelectedTemplate('template6')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template6'
                  ? 'border-teal-500 ring-4 ring-teal-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-teal-600 text-2xl font-bold">
                    F
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-teal-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Teal Aqua</h3>
                <p className="text-sm text-gray-600">Fresh & modern teal theme</p>
              </div>
            </div>

            {/* Template 7: Rose Pink */}
            <div
              onClick={() => setSelectedTemplate('template7')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template7'
                  ? 'border-rose-500 ring-4 ring-rose-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-rose-600 text-2xl font-bold">
                    G
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-rose-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Rose Pink</h3>
                <p className="text-sm text-gray-600">Elegant & feminine design</p>
              </div>
            </div>

            {/* Template 8: Amber Gold */}
            <div
              onClick={() => setSelectedTemplate('template8')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template8'
                  ? 'border-amber-500 ring-4 ring-amber-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-amber-600 text-2xl font-bold">
                    H
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-amber-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Amber Gold</h3>
                <p className="text-sm text-gray-600">Warm & professional</p>
              </div>
            </div>

            {/* Template 9: Slate Gray */}
            <div
              onClick={() => setSelectedTemplate('template9')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template9'
                  ? 'border-slate-500 ring-4 ring-slate-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-slate-700 to-gray-700 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-slate-700 text-2xl font-bold">
                    I
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-slate-400 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Slate Gray</h3>
                <p className="text-sm text-gray-600">Minimalist & professional</p>
              </div>
            </div>

            {/* Template 10: Indigo Violet */}
            <div
              onClick={() => setSelectedTemplate('template10')}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplate === 'template10'
                  ? 'border-indigo-500 ring-4 ring-indigo-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 h-48 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                    J
                  </div>
                  <div className="h-3 w-24 bg-white rounded mx-auto mb-1"></div>
                  <div className="h-2 w-32 bg-indigo-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">Indigo Violet</h3>
                <p className="text-sm text-gray-600">Creative & tech-savvy</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleGeneratePortfolio}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Portfolio...
              </span>
            ) : (
              '✨ Generate My Portfolio'
            )}
          </button>
        </div>
      )}

      {/* STEP 4: Final Output */}
      {currentStep === 4 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your Portfolio is Ready!
          </h2>
          <p className="text-gray-600 mb-8">
            Your professional portfolio has been generated successfully
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-lg font-semibold text-gray-800 mb-2">Download Your Portfolio</p>
            <p className="text-sm text-gray-600 mb-4">
              Get the complete source code as a ZIP file with HTML, CSS, and assets
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg">
              📥 Download ZIP File
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
            >
              🎨 Change Template
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              ✏️ Edit Content
            </button>
          </div>

          <div className="grid md:grid-cols-1 gap-4">
            <button className="border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              👁️ Preview Portfolio
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>What you'll get:</strong> A complete portfolio website with all your data, 
              ready to host on any platform (GitHub Pages, Netlify, Vercel, etc.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioGenerator;
