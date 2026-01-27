exports.searchJobs = async (req, res) => {
  try {
    const { query = 'python developer', location = 'India' } = req.query;
    
    const url = `https://www.searchapi.io/api/v1/search?engine=google_jobs&q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&api_key=${process.env.SEARCHAPI_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        message: 'Failed to fetch jobs',
        error: data 
      });
    }
    
    res.json({
      success: true,
      jobs: data.jobs || [],
      search_parameters: data.search_parameters
    });
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
