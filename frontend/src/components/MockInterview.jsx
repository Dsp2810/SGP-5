import { useState } from 'react';

function MockInterview() {
  const [step, setStep] = useState('setup'); // setup, interview, results
  const [interviewConfig, setInterviewConfig] = useState({
    position: '',
    company: '',
    jobDescription: '',
    resumeFile: null,
    duration: '30'
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const questions = [
    'Tell me about yourself and your background.',
    'Why are you interested in this position?',
    'Describe a challenging project you worked on and how you overcame obstacles.',
    'What are your greatest strengths and how do they apply to this role?',
    'Where do you see yourself in 5 years?',
    'Do you have any questions for us?'
  ];

  const handleStartInterview = (e) => {
    e.preventDefault();
    setStep('interview');
  };

  const handleNextQuestion = () => {
    setAnswers([...answers, { question: questions[currentQuestion], answer: currentAnswer }]);
    setCurrentAnswer('');
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Generate results
      setStep('results');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInterviewConfig({ ...interviewConfig, resumeFile: file });
    }
  };

  const mockResults = {
    overallScore: 82,
    categories: [
      { name: 'Communication', score: 85, feedback: 'Clear and concise responses' },
      { name: 'Technical Knowledge', score: 88, feedback: 'Strong technical understanding' },
      { name: 'Problem Solving', score: 80, feedback: 'Good analytical approach' },
      { name: 'Confidence', score: 78, feedback: 'Maintain steady composure' }
    ],
    strengths: [
      'Clear articulation of ideas',
      'Strong technical vocabulary',
      'Good use of specific examples',
      'Professional demeanor'
    ],
    improvements: [
      'Elaborate more on achievements with metrics',
      'Practice STAR method for behavioral questions',
      'Ask more insightful questions about the role',
      'Reduce filler words (um, like, etc.)'
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Mock Interview</h1>
        <p className="text-gray-600">Practice with AI-based interviews tailored to your profile</p>
      </div>

      {/* Setup Phase */}
      {step === 'setup' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Interview Setup</h2>
          <form onSubmit={handleStartInterview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  value={interviewConfig.position}
                  onChange={(e) => setInterviewConfig({ ...interviewConfig, position: e.target.value })}
                  required
                  placeholder="Software Engineer"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={interviewConfig.company}
                  onChange={(e) => setInterviewConfig({ ...interviewConfig, company: e.target.value })}
                  placeholder="Google"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={interviewConfig.jobDescription}
                onChange={(e) => setInterviewConfig({ ...interviewConfig, jobDescription: e.target.value })}
                rows={6}
                placeholder="Paste the job description to get relevant questions..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  {interviewConfig.resumeFile ? (
                    <p className="text-gray-700 font-medium">{interviewConfig.resumeFile.name}</p>
                  ) : (
                    <p className="text-gray-700">Click to upload resume</p>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Duration
              </label>
              <select
                value={interviewConfig.duration}
                onChange={(e) => setInterviewConfig({ ...interviewConfig, duration: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white py-4 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Start Interview
            </button>
          </form>
        </div>
      )}

      {/* Interview Phase */}
      {step === 'interview' && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gray-700 to-gray-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                AI
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm mb-2">Interviewer</p>
                <p className="text-xl font-semibold text-gray-800">{questions[currentQuestion]}</p>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                rows={8}
                placeholder="Type your answer here or use voice recording..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={!currentAnswer.trim()}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Phase */}
      {step === 'results' && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-8 text-white shadow-xl">
            <div className="text-center">
              <p className="text-gray-200 text-lg mb-2">Interview Performance</p>
              <div className="text-7xl font-bold mb-2">{mockResults.overallScore}</div>
              <p className="text-gray-200 text-lg">out of 100</p>
              <p className="text-gray-300 mt-4">Great job! You're well-prepared for interviews.</p>
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Breakdown</h3>
            <div className="space-y-4">
              {mockResults.categories.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">{category.name}</h4>
                    <span className="text-lg font-bold text-gray-700">{category.score}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-gray-700 to-gray-600 h-2 rounded-full"
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{category.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-green-500">⭐</span>
                Strengths
              </h3>
              <ul className="space-y-3">
                {mockResults.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-orange-500">💡</span>
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {mockResults.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep('setup');
                setCurrentQuestion(0);
                setAnswers([]);
                setCurrentAnswer('');
              }}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all"
            >
              Start New Interview
            </button>
            <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockInterview;
