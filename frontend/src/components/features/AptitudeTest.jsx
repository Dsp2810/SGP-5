import { useState } from 'react';

function AptitudeTest() {
  const [selectedTest, setSelectedTest] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [showResults, setShowResults] = useState(false);

  const testCategories = [
    {
      id: 'quantitative',
      name: 'Quantitative Aptitude',
      description: 'Mathematical and numerical reasoning',
      duration: '30 min',
      questions: 20,
      icon: '🔢',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'logical',
      name: 'Logical Reasoning',
      description: 'Pattern recognition and logical thinking',
      duration: '30 min',
      questions: 20,
      icon: '🧩',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'verbal',
      name: 'Verbal Ability',
      description: 'Grammar, vocabulary and comprehension',
      duration: '25 min',
      questions: 20,
      icon: '📝',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'technical',
      name: 'Technical MCQ',
      description: 'Programming and CS fundamentals',
      duration: '40 min',
      questions: 25,
      icon: '💻',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'coding',
      name: 'Coding Assessment',
      description: 'Problem-solving with code',
      duration: '60 min',
      questions: 3,
      icon: '⚡',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'full',
      name: 'Full Assessment',
      description: 'Complete placement test',
      duration: '120 min',
      questions: 60,
      icon: '🎯',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const sampleQuestions = {
    quantitative: [
      {
        id: 1,
        question: 'If a train travels 120 km in 2 hours, what is its average speed?',
        options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
        correct: 1
      },
      {
        id: 2,
        question: 'What is 15% of 200?',
        options: ['25', '30', '35', '40'],
        correct: 1
      }
    ],
    logical: [
      {
        id: 1,
        question: 'Complete the series: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '46'],
        correct: 1
      },
      {
        id: 2,
        question: 'If all roses are flowers and some flowers are red, which is true?',
        options: [
          'All roses are red',
          'Some roses may be red',
          'No roses are red',
          'All flowers are roses'
        ],
        correct: 1
      }
    ],
    verbal: [
      {
        id: 1,
        question: 'Choose the correct spelling:',
        options: ['Accommodation', 'Acommodation', 'Accomodation', 'Acomodation'],
        correct: 0
      },
      {
        id: 2,
        question: 'Synonym of "Abundant":',
        options: ['Scarce', 'Plentiful', 'Limited', 'Rare'],
        correct: 1
      }
    ]
  };

  const pastResults = [
    {
      test: 'Quantitative Aptitude',
      date: '2025-01-20',
      score: 85,
      accuracy: '17/20',
      percentile: 92
    },
    {
      test: 'Logical Reasoning',
      date: '2025-01-15',
      score: 78,
      accuracy: '16/20',
      percentile: 85
    },
    {
      test: 'Verbal Ability',
      date: '2025-01-10',
      score: 92,
      accuracy: '18/20',
      percentile: 96
    }
  ];

  const handleStartTest = (test) => {
    setSelectedTest(test);
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleNext = () => {
    const questions = sampleQuestions[selectedTest.id] || sampleQuestions.quantitative;
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const questions = sampleQuestions[selectedTest.id] || sampleQuestions.quantitative;
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Aptitude Tests</h1>
        <p className="text-gray-600">Test your skills with placement readiness assessments</p>
      </div>

      {!testStarted ? (
        <>
          {/* Test Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testCategories.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => handleStartTest(test)}
              >
                <div className={`bg-gradient-to-r ${test.color} p-6 text-white`}>
                  <div className="text-5xl mb-3">{test.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{test.name}</h3>
                  <p className="text-white text-opacity-90 text-sm">{test.description}</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {test.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {test.questions} Questions
                    </span>
                  </div>
                  <button className="w-full bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-gray-700 group-hover:to-gray-600 text-gray-700 group-hover:text-white py-2.5 rounded-lg font-semibold transition-all duration-300">
                    Start Test
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Past Results */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Test Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Test</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Accuracy</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Percentile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pastResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">{result.test}</td>
                      <td className="px-6 py-4 text-gray-600">{result.date}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {result.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{result.accuracy}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {result.percentile}th
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : showResults ? (
        /* Results Screen */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-8 text-white shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Test Completed! 🎉</h2>
              <div className="text-7xl font-bold mb-2">{calculateScore().percentage}%</div>
              <p className="text-gray-200 text-lg">
                You got {calculateScore().correct} out of {calculateScore().total} correct
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <p className="text-gray-500 text-sm mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-green-600">
                {calculateScore().correct}/{calculateScore().total}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <p className="text-gray-500 text-sm mb-1">Percentile</p>
              <p className="text-3xl font-bold text-blue-600">89th</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <p className="text-gray-500 text-sm mb-1">Time Taken</p>
              <p className="text-3xl font-bold text-purple-600">18:45</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setTestStarted(false)}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all"
            >
              Back to Tests
            </button>
            <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              View Solutions
            </button>
          </div>
        </div>
      ) : (
        /* Test Screen */
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedTest.name}</h2>
                <p className="text-gray-600">
                  Question {currentQuestion + 1} of {(sampleQuestions[selectedTest.id] || sampleQuestions.quantitative).length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Time Remaining</p>
                <p className="text-2xl font-bold text-gray-800">{formatTime(timeLeft)}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-gray-700 to-gray-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / (sampleQuestions[selectedTest.id] || sampleQuestions.quantitative).length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {(sampleQuestions[selectedTest.id] || sampleQuestions.quantitative)[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {(sampleQuestions[selectedTest.id] || sampleQuestions.quantitative)[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswerSelect(
                      (sampleQuestions[selectedTest.id] || sampleQuestions.quantitative)[currentQuestion].id,
                      index
                    )
                  }
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    answers[(sampleQuestions[selectedTest.id] || sampleQuestions.quantitative)[currentQuestion].id] === index
                      ? 'border-gray-700 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-gray-700 mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-gray-800">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => setTestStarted(false)}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Exit Test
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all"
            >
              {currentQuestion < (sampleQuestions[selectedTest.id] || sampleQuestions.quantitative).length - 1
                ? 'Next Question'
                : 'Submit Test'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AptitudeTest;
