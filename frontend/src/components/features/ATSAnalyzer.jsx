import { useState } from 'react';

function ATSAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    setAnalyzing(true);

    // Simulate ATS analysis
    setTimeout(() => {
      setResults({
        overallScore: 85,
        sections: [
          { name: 'Keywords Match', score: 90, status: 'excellent' },
          { name: 'Format & Structure', score: 88, status: 'excellent' },
          { name: 'Skills Alignment', score: 82, status: 'good' },
          { name: 'Experience Relevance', score: 85, status: 'excellent' },
          { name: 'Education Match', score: 78, status: 'good' },
          { name: 'Readability', score: 92, status: 'excellent' }
        ],
        matchedKeywords: [
          'React', 'Node.js', 'JavaScript', 'TypeScript', 'AWS', 'MongoDB',
          'Docker', 'CI/CD', 'Agile', 'REST API'
        ],
        missingKeywords: [
          'Kubernetes', 'GraphQL', 'Microservices', 'Redis', 'PostgreSQL'
        ],
        suggestions: [
          'Add more relevant keywords from the job description',
          'Include quantifiable achievements with metrics',
          'Optimize section headings for ATS compatibility',
          'Add missing technical skills mentioned in job posting',
          'Use standard section titles (Experience, Education, Skills)'
        ],
        strengths: [
          'Strong technical skills alignment',
          'Clear and well-structured format',
          'Good use of action verbs',
          'Relevant experience highlighted'
        ]
      });
      setAnalyzing(false);
    }, 2500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status) => {
    const config = {
      excellent: 'bg-green-100 text-green-700',
      good: 'bg-blue-100 text-blue-700',
      average: 'bg-yellow-100 text-yellow-700',
      poor: 'bg-red-100 text-red-700'
    };
    return config[status] || config.average;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ATS Resume Analyzer</h1>
        <p className="text-gray-600">Analyze your resume with ATS scoring for better results</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (PDF, DOCX)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
                required
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                {resumeFile ? (
                  <p className="text-gray-700 font-medium">{resumeFile.name}</p>
                ) : (
                  <>
                    <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description (Optional - for better matching)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              placeholder="Paste the job description here to get better keyword matching and relevance scoring..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing || !resumeFile}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Resume...
              </span>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-8 text-white shadow-xl">
            <div className="text-center">
              <p className="text-gray-200 text-lg mb-2">ATS Score</p>
              <div className="text-7xl font-bold mb-2">{results.overallScore}</div>
              <p className="text-gray-200">out of 100</p>
              <div className="mt-4 max-w-md mx-auto bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-1000"
                  style={{ width: `${results.overallScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Section Scores */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.sections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{section.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(section.status)}`}>
                      {section.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${section.score >= 80 ? 'bg-green-500' : section.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                    <span className={`text-lg font-bold ${getScoreColor(section.score)}`}>
                      {section.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.matchedKeywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-red-500">✗</span>
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.missingKeywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                💡 Suggestions
              </h3>
              <ul className="space-y-3">
                {results.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                ⭐ Strengths
              </h3>
              <ul className="space-y-3">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all">
              Download Report
            </button>
            <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              Optimize Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ATSAnalyzer;
