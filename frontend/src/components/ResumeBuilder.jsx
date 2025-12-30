import { useState } from 'react';

function ResumeBuilder() {
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [resumeData, setResumeData] = useState({
    name: 'John Doe',
    title: 'Full Stack Developer',
    email: 'john.doe@email.com',
    phone: '+1 234 567 890',
    location: 'San Francisco, CA',
    summary: 'Passionate full-stack developer with 5+ years of experience.',
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Developer',
        duration: '2021 - Present',
        description: 'Led development of enterprise applications'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California',
        year: '2019'
      }
    ],
    skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB']
  });

  const templates = [
    { id: 'modern', name: 'Modern', icon: '📄' },
    { id: 'classic', name: 'Classic', icon: '📋' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
    { id: 'minimal', name: 'Minimal', icon: '📝' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Builder</h1>
        <p className="text-gray-600">Build professional resumes using your portfolio data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Template Selection */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setActiveTemplate(template.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    activeTemplate === template.id
                      ? 'border-gray-700 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{template.icon}</div>
                  <div className="text-sm font-semibold text-gray-800">{template.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all">
                Import from Portfolio
              </button>
              <button className="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white py-2.5 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-700 transition-all">
                Download PDF
              </button>
              <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                Save Draft
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resume Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">ATS Score</span>
                <span className="text-green-600 font-bold">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Keywords</span>
                <span className="text-blue-600 font-bold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Sections</span>
                <span className="text-purple-600 font-bold">5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-8 min-h-[800px]">
            {/* Modern Template Preview */}
            {activeTemplate === 'modern' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                {/* Header */}
                <div className="border-b-4 border-gray-700 pb-6">
                  <h2 className="text-4xl font-bold text-gray-900">{resumeData.name}</h2>
                  <p className="text-xl text-gray-600 mt-2">{resumeData.title}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    <span>{resumeData.email}</span>
                    <span>•</span>
                    <span>{resumeData.phone}</span>
                    <span>•</span>
                    <span>{resumeData.location}</span>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Professional Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Experience</h3>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-base font-bold text-gray-900">{exp.position}</h4>
                          <span className="text-sm text-gray-600">{exp.duration}</span>
                        </div>
                        <p className="text-gray-700 font-semibold mb-2">{exp.company}</p>
                        <p className="text-gray-600 text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Education</h3>
                  {resumeData.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-base font-bold text-gray-900">{edu.degree}</h4>
                        <span className="text-sm text-gray-600">{edu.year}</span>
                      </div>
                      <p className="text-gray-700">{edu.institution}</p>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other Templates - Placeholder */}
            {activeTemplate !== 'modern' && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">{templates.find(t => t.id === activeTemplate)?.icon}</div>
                  <p className="text-lg font-semibold">
                    {templates.find(t => t.id === activeTemplate)?.name} Template
                  </p>
                  <p className="text-sm mt-2">Preview coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
