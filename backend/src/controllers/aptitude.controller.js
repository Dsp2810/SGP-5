const { spawn } = require('child_process');
const path = require('path');

const TOPIC_MAP = {
  quantitative: 'Quantitative Aptitude: Number Systems, Percentages, Profit Loss, Time Work, Speed Distance',
  logical: 'Logical Reasoning: Series, Analogies, Pattern Recognition, Blood Relations, Coding Decoding',
  verbal: 'Verbal Ability: Grammar, Vocabulary, Reading Comprehension, Synonyms Antonyms',
  technical: 'Technical MCQ: Data Structures, Algorithms, OOP, DBMS, Operating Systems',
  coding: 'Programming and Coding: Arrays, Strings, Sorting, Searching, Dynamic Programming',
  full: 'Mixed Aptitude: Quantitative, Logical Reasoning, Verbal Ability, Data Interpretation',
};

/**
 * POST /api/aptitude/generate
 * Body: { topic, count }
 */
exports.generateMCQs = async (req, res) => {
  try {
    const { topic = 'quantitative', count = 5 } = req.body;
    const resolvedTopic = TOPIC_MAP[topic] || topic;
    const safeCount = Math.min(Math.max(parseInt(count) || 5, 1), 10);

    const pythonScript = path.join(__dirname, '../services/aptitudeRAG.py');
    const pythonCmd =
      process.env.PYTHON_PATH ||
      'python3';

    let output = '';
    let errorOutput = '';

    const pythonProcess = spawn(pythonCmd, [pythonScript, resolvedTopic, String(safeCount)], {
      env: { ...process.env },
    });

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // 60 second timeout
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      return res.status(504).json({ success: false, error: 'MCQ generation timed out' });
    }, 60000);

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);

      if (code !== 0 || !output.trim()) {
        console.error('Aptitude RAG error:', errorOutput);
        return res.status(500).json({
          success: false,
          error: 'Failed to generate questions',
          details: errorOutput.slice(0, 500),
        });
      }

      try {
        // Extract last JSON object from stdout (ignore model loading logs)
        const jsonMatch = output.match(/\{[\s\S]*\}(?=[^{}]*$)/);
        if (!jsonMatch) throw new Error('No JSON found in output');
        const result = JSON.parse(jsonMatch[0]);

        if (!result.success) {
          return res.status(500).json(result);
        }

        return res.json(result);
      } catch (parseErr) {
        console.error('Parse error:', parseErr.message, '\nOutput:', output.slice(0, 500));
        return res.status(500).json({ success: false, error: 'Failed to parse generated questions' });
      }
    });
  } catch (err) {
    console.error('Aptitude controller error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
