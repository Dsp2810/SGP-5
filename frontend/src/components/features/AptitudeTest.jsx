import { useState } from 'react';

// Sub-topics per category
const SUB_TOPICS = {
  quantitative: [
    { id: 'number_system', label: 'Number System' },
    { id: 'percentages', label: 'Percentages' },
    { id: 'profit_loss', label: 'Profit & Loss' },
    { id: 'time_work', label: 'Time & Work' },
    { id: 'speed_distance', label: 'Speed & Distance' },
    { id: 'averages', label: 'Averages' },
    { id: 'ratio_proportion', label: 'Ratio & Proportion' },
    { id: 'simple_compound_interest', label: 'Simple & Compound Interest' },
    { id: 'permutation_combination', label: 'Permutation & Combination' },
    { id: 'data_interpretation', label: 'Data Interpretation' },
  ],
  logical: [
    { id: 'series_completion', label: 'Series Completion' },
    { id: 'analogies', label: 'Analogies' },
    { id: 'blood_relations', label: 'Blood Relations' },
    { id: 'coding_decoding', label: 'Coding-Decoding' },
    { id: 'direction_sense', label: 'Direction Sense' },
    { id: 'syllogisms', label: 'Syllogisms' },
    { id: 'puzzles', label: 'Puzzles & Seating Arrangement' },
    { id: 'statement_conclusions', label: 'Statements & Conclusions' },
  ],
  verbal: [
    { id: 'synonyms_antonyms', label: 'Synonyms & Antonyms' },
    { id: 'grammar', label: 'Grammar & Sentence Correction' },
    { id: 'reading_comprehension', label: 'Reading Comprehension' },
    { id: 'sentence_completion', label: 'Sentence Completion' },
    { id: 'idioms_phrases', label: 'Idioms & Phrases' },
    { id: 'para_jumbles', label: 'Para Jumbles' },
    { id: 'one_word_substitution', label: 'One Word Substitution' },
  ],
  technical: [
    { id: 'data_structures', label: 'Data Structures' },
    { id: 'algorithms', label: 'Algorithms & Complexity' },
    { id: 'oop', label: 'OOP Concepts' },
    { id: 'dbms', label: 'DBMS & SQL' },
    { id: 'os', label: 'Operating Systems' },
    { id: 'networks', label: 'Computer Networks' },
    { id: 'c_cpp', label: 'C / C++ Programming' },
    { id: 'java_python', label: 'Java / Python' },
  ],
  coding: [
    { id: 'arrays_strings', label: 'Arrays & Strings' },
    { id: 'linked_lists', label: 'Linked Lists' },
    { id: 'recursion', label: 'Recursion' },
    { id: 'sorting_searching', label: 'Sorting & Searching' },
    { id: 'dynamic_programming', label: 'Dynamic Programming' },
    { id: 'graphs_trees', label: 'Graphs & Trees' },
  ],
  full: [
    { id: 'quantitative_mix', label: 'Quantitative Aptitude' },
    { id: 'logical_mix', label: 'Logical Reasoning' },
    { id: 'verbal_mix', label: 'Verbal Ability' },
    { id: 'technical_mix', label: 'Technical MCQ' },
    { id: 'coding_mix', label: 'Coding Problems' },
  ],
};

function AptitudeTest() {
  // phase: 'home' | 'configure' | 'loading' | 'test' | 'results'
  const [phase, setPhase] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);   // array of topic ids
  const [mixAll, setMixAll] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [aiError, setAiError] = useState(null);

  const testCategories = [
    { id: 'quantitative', name: 'Quantitative Aptitude', icon: '🔢', color: 'from-blue-500 to-blue-600' },
    { id: 'logical', name: 'Logical Reasoning',  icon: '🧩', color: 'from-purple-500 to-purple-600' },
    { id: 'verbal', name: 'Verbal Ability', icon: '📝', color: 'from-green-500 to-green-600' },
    { id: 'technical', name: 'Technical MCQ',  icon: '💻', color: 'from-orange-500 to-orange-600' },
    { id: 'coding', name: 'Coding Assessment', icon: '⚡', color: 'from-red-500 to-red-600' },
    { id: 'full', name: 'Full Assessment', icon: '🎯', color: 'from-indigo-500 to-indigo-600' },
  ];

  /* ── helpers ─────────────────────────────────────────────── */

  const toggleTopic = (id) => {
    setMixAll(false);
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleMixAll = () => {
    setMixAll((prev) => {
      if (!prev) setSelectedTopics([]);
      return !prev;
    });
  };

  const buildTopicString = () => {
    if (mixAll) return selectedCategory.name;
    if (selectedTopics.length === 0) return selectedCategory.name;
    const labels = (SUB_TOPICS[selectedCategory.id] || [])
      .filter((t) => selectedTopics.includes(t.id))
      .map((t) => t.label);
    return labels.join(', ');
  };

  const canStartTest = mixAll || selectedTopics.length > 0;

  /* ── phase transitions ───────────────────────────────────── */

  const goToConfigure = (cat) => {
    setSelectedCategory(cat);
    setSelectedTopics([]);
    setMixAll(false);
    setQuestionCount(5);
    setPhase('configure');
  };

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  };

  const goHome = () => {
    exitFullscreen();
    setPhase('home');
    setSelectedCategory(null);
    setSelectedTopics([]);
    setMixAll(false);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setAiError(null);
  };

  const generateAndStart = async () => {
    enterFullscreen();
    setPhase('loading');
    setAiError(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);

    try {
      const response = await fetch('http://localhost:5000/api/aptitude/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ topic: buildTopicString(), count: questionCount }),
      });
      const result = await response.json();
      if (result.success && result.questions?.length > 0) {
        setQuestions(result.questions);
        setPhase('test');
      } else {
        setAiError(result.error || 'Could not generate questions. Please try again.');
        setPhase('configure');
      }
    } catch {
      setAiError('Server unavailable. Please make sure the backend is running.');
      setPhase('configure');
    }
  };

  /* ── test actions ────────────────────────────────────────── */

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      exitFullscreen();
      setPhase('results');
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => { if (answers[q.id] === q.correct) correct++; });
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };

  /* ── render ──────────────────────────────────────────────── */

  /* HOME: category cards */
  if (phase === 'home') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Aptitude Tests</h1>
         
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => goToConfigure(cat)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group"
            >
              <div className="text-3xl mb-4">{cat.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{cat.description}</p>
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                Get Started &gt;
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* CONFIGURE: topic chips + question count */
  if (phase === 'configure') {
    const topics = SUB_TOPICS[selectedCategory.id] || [];
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={goHome} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{selectedCategory.name}</h1>
            <p className="text-gray-500 text-sm">Select topics from the aptitude book to include in your test</p>
          </div>
        </div>

        {aiError && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{aiError}</div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Choose Topics</h3>
            <span className="text-xs text-gray-400">{mixAll ? 'All selected' : `${selectedTopics.length} selected`}</span>
          </div>

          {/* Mix All row */}
          <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
            mixAll ? 'border-gray-700 bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}>
            <input
              type="checkbox"
              checked={mixAll}
              onChange={toggleMixAll}
              className="w-4 h-4 accent-gray-800"
            />
            <span className="text-sm font-semibold text-gray-800">🎲 Mix All Topics</span>
            <span className="ml-auto text-xs text-gray-400">Randomly pick from all</span>
          </label>

          <div className="border-t border-gray-100" />

          {/* Individual topics */}
          <div className="space-y-2">
            {topics.map((t) => {
              const active = !mixAll && selectedTopics.includes(t.id);
              return (
                <label
                  key={t.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    mixAll
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : active
                      ? 'border-gray-700 bg-gray-50 cursor-pointer'
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    disabled={mixAll}
                    onChange={() => toggleTopic(t.id)}
                    className="w-4 h-4 accent-gray-800"
                  />
                  <span className={`text-sm font-medium ${mixAll ? 'text-gray-400' : 'text-gray-800'}`}>{t.label}</span>
                </label>
              );
            })}
          </div>

          {/* Summary */}
          {(mixAll || selectedTopics.length > 0) && (
            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              <span className="font-medium">Selected: </span>{buildTopicString()}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Number of Questions</h3>
            <input
              type="number"
              min={1}
              max={30}
              value={questionCount}
              onChange={(e) => {
                const val = Math.min(30, Math.max(1, Number(e.target.value) || 1));
                setQuestionCount(val);
              }}
              className="w-16 text-center text-2xl font-extrabold text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none py-1"
            />
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full h-2 rounded-full accent-gray-800 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 px-0.5">
            <span>1</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
            <span>30</span>
          </div>
          <div className="flex gap-2">
            {[5, 10, 15, 20, 25, 30].map((n) => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                  questionCount === n
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateAndStart}
          disabled={!canStartTest}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            canStartTest
              ? 'bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:from-gray-900 hover:to-gray-700 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          ✨ Generate &amp; Start Test ({questionCount} Questions)
        </button>
      </div>
    );
  }

  /* LOADING */
  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Questions…</h2>
          <p className="text-gray-500 max-w-xs">
            Searching the aptitude book for <span className="font-medium text-gray-700">{buildTopicString()}</span> and crafting {questionCount} unique MCQs
          </p>
        </div>
      </div>
    );
  }

  /* TEST */
  if (phase === 'test') {
    const q = questions[currentQuestion];
    const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedCategory.name}</h2>
              <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <span className="text-sm font-semibold text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-gray-700 to-gray-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-xl shadow-md p-7">
          <p className="text-lg font-semibold text-gray-800 mb-6">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((option, idx) => {
              const selected = answers[q.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(q.id, idx)}
                  className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selected
                      ? 'border-gray-700 bg-gray-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold ${
                    selected ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-gray-800">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-gray-800 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-900 hover:to-gray-700 transition-all"
          >
            {currentQuestion < questions.length - 1 ? 'Next →' : 'Submit Test'}
          </button>
        </div>
      </div>
    );
  }

  /* RESULTS */
  if (phase === 'results') {
    const { correct, total, percentage } = calculateScore();
    const grade = percentage >= 80 ? { label: 'Excellent', color: 'text-green-400' }
                : percentage >= 60 ? { label: 'Good', color: 'text-yellow-400' }
                : { label: 'Needs Practice', color: 'text-red-400' };
    return (
      <div className="space-y-6">
        {/* Score banner */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-xl p-8 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-1">Test Completed! 🎉</h2>
          <p className="text-gray-300 text-sm mb-4">{selectedCategory.name} — {buildTopicString()}</p>
          <div className={`text-7xl font-extrabold mb-2 ${grade.color}`}>{percentage}%</div>
          <p className="text-gray-200 text-lg">{correct} / {total} correct — <span className={grade.color}>{grade.label}</span></p>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Answer Review</h3>
          <div className="space-y-4">
            {questions.map((q, qi) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correct;
              return (
                <div key={q.id} className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <p className="font-semibold text-gray-800 mb-3">
                    <span className="text-gray-500 mr-2">Q{qi + 1}.</span>{q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, idx) => {
                      const isCorrectOpt = idx === q.correct;
                      const isUserOpt = idx === userAns;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                            isCorrectOpt
                              ? 'bg-green-100 text-green-800 font-semibold'
                              : isUserOpt && !isCorrectOpt
                              ? 'bg-red-100 text-red-700 line-through'
                              : 'text-gray-600'
                          }`}
                        >
                          <span className="font-bold w-5">{String.fromCharCode(65 + idx)}.</span>
                          <span>{opt}</span>
                          {isCorrectOpt && <span className="ml-auto text-green-600">✓ Correct</span>}
                          {isUserOpt && !isCorrectOpt && <span className="ml-auto text-red-500">✗ Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={goHome}
            className="flex-1 bg-gradient-to-r from-gray-800 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-900 hover:to-gray-700 transition-all"
          >
            Back to Tests
          </button>
          <button
            onClick={() => { setPhase('configure'); setAnswers({}); setCurrentQuestion(0); setQuestions([]); }}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default AptitudeTest;
