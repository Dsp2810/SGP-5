import { useState } from 'react';

function PortfolioGenerator() {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPortfolio({
        name: 'John Doe',
        title: 'Full Stack Developer',
        email: 'john.doe@email.com',
        phone: '+1 234 567 890',
        location: 'San Francisco, CA',
        summary: 'Passionate full-stack developer with 5+ years of experience in building scalable web applications. Expertise in React, Node.js, and cloud technologies.',
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
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built a full-featured e-commerce platform with payment integration',
            technologies: ['React', 'Node.js', 'MongoDB']
          },
          {
            name: 'Task Management App',
            description: 'Real-time collaborative task management application',
            technologies: ['React', 'Firebase', 'Material-UI']
          }
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Portfolio Generator</h1>
        <p className="text-gray-600">Generate your professional portfolio from LinkedIn profile</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              id="linkedInUrl"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/your-profile"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating Portfolio...' : 'Generate Portfolio'}
          </button>
        </form>
      </div>

      {/* Portfolio Preview */}
      {portfolio && (
        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          {/* Header */}
          <div className="text-center border-b border-gray-200 pb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {portfolio.name.charAt(0)}
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{portfolio.name}</h2>
            <p className="text-xl text-gray-600 mt-2">{portfolio.title}</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <span>📧 {portfolio.email}</span>
              <span>📱 {portfolio.phone}</span>
              <span>📍 {portfolio.location}</span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">{portfolio.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Experience</h3>
            <div className="space-y-4">
              {portfolio.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-gray-400 pl-4">
                  <h4 className="text-lg font-semibold text-gray-800">{exp.position}</h4>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Education</h3>
            {portfolio.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-gray-400 pl-4">
                <h4 className="text-lg font-semibold text-gray-800">{edu.degree}</h4>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, index) => (
                <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Projects</h3>
            <div className="space-y-4">
              {portfolio.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h4>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white text-gray-600 rounded-md text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200">
              Download PDF
            </button>
            <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200">
              Share Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioGenerator;
