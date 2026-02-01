import { useState } from 'react';

function ATSAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload a resume and enter job description');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResults(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to use this feature');
      }

      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('http://localhost:5000/api/ats/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      setResults(data.data);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">ATS Resume Analyzer</h1>
        <p className="text-gray-600 mt-2">Upload your resume and job description to get ATS score</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Upload Form */}
      {!results && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                  required
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {resumeFile ? (
                    <div className="text-gray-700">
                      <svg className="w-10 h-10 mx-auto mb-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="font-medium">{resumeFile.name}</p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="font-medium">Click to upload resume</p>
                      <p className="text-sm mt-1">PDF, DOC, or DOCX</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                required
                placeholder="Paste the complete job description here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-black transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Score Display */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 text-white shadow-xl text-center">
            <p className="text-gray-300 text-lg mb-2">ATS Match Score</p>
            <div className="text-6xl font-bold mb-3">{results.score ? Math.round(results.score) : 0}%</div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              results.score >= 80 ? 'bg-green-500' : 
              results.score >= 60 ? 'bg-yellow-500' : 
              results.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}>
              {results.status || 'No Status'}
            </div>
            <p className="text-gray-300 mt-4">{results.message}</p>
          </div>

          {/* Similarity Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Semantic Similarity Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Similarity Score:</span>
                <span className="font-bold text-gray-800">{results.similarity || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-full rounded-full ${
                    results.score >= 80 ? 'bg-green-500' : 
                    results.score >= 60 ? 'bg-yellow-500' : 
                    results.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${results.score || 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-4">
                This score is calculated using advanced AI semantic similarity analysis with Sentence Transformers.
              </p>
            </div>
          </div>

          {/* New Analysis Button */}
          <button
            onClick={() => {
              setResults(null);
              setResumeFile(null);
              setJobDescription('');
            }}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
          >
            Analyze Another Resume
          </button>
        </div>
      )}
    </div>
  );
}

export default ATSAnalyzer;
