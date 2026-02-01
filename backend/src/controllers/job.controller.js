exports.searchJobs = async (req, res) => {
  try {
    const { 
      query = 'python developer', 
      location = 'India',
      workMode,
      experienceLevel,
      jobType,
      salaryRange,
      techStack,
      postedDate,
      company,
      degreeRequired,
      applyPlatform,
      roleCategory
    } = req.query;
    
    // Build search query with additional parameters
    let searchQuery = query;
    
    // Add tech stack to search query if provided
    if (techStack) {
      searchQuery += ` ${techStack}`;
    }
    
    // Add role category to search query if provided
    if (roleCategory) {
      searchQuery += ` ${roleCategory}`;
    }

    // Build API URL with base parameters
    let url = `https://www.searchapi.io/api/v1/search?engine=google_jobs&q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}&api_key=${process.env.SEARCHAPI_KEY}`;
    
    // Add optional filters to URL
    if (jobType) {
      url += `&job_type=${encodeURIComponent(jobType)}`;
    }
    
    if (postedDate) {
      // Convert our format to Google Jobs format
      const dateMap = {
        '24h': 'today',
        '3d': '3days',
        '7d': 'week',
        '14d': '2weeks',
        '30d': 'month'
      };
      const googleDate = dateMap[postedDate];
      if (googleDate) {
        url += `&date_posted=${googleDate}`;
      }
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        message: 'Failed to fetch jobs',
        error: data 
      });
    }
    
    let jobs = data.jobs || [];
    
    // Apply client-side filters for parameters not supported by API
    
    // Filter by work mode (Remote/Onsite/Hybrid)
    if (workMode) {
      jobs = jobs.filter(job => {
        const desc = (job.description || '').toLowerCase();
        const title = (job.title || '').toLowerCase();
        const extensions = (job.extensions || []).map(e => e.toLowerCase()).join(' ');
        const detectedExts = job.detected_extensions || {};
        
        const searchText = `${desc} ${title} ${extensions}`.toLowerCase();
        const mode = workMode.toLowerCase();
        
        if (mode === 'remote') {
          return searchText.includes('remote') || 
                 searchText.includes('work from home') || 
                 detectedExts.work_from_home === true;
        } else if (mode === 'onsite') {
          return !searchText.includes('remote') && 
                 !searchText.includes('work from home') &&
                 !searchText.includes('hybrid');
        } else if (mode === 'hybrid') {
          return searchText.includes('hybrid');
        }
        return true;
      });
    }
    
    // Filter by experience level
    if (experienceLevel) {
      jobs = jobs.filter(job => {
        const desc = (job.description || '').toLowerCase();
        const title = (job.title || '').toLowerCase();
        const searchText = `${desc} ${title}`;
        
        if (experienceLevel === 'Fresher') {
          return searchText.includes('fresher') || 
                 searchText.includes('0 year') ||
                 searchText.includes('0-1 year') ||
                 searchText.includes('entry level');
        } else if (experienceLevel === 'Entry Level') {
          return searchText.includes('entry') || 
                 searchText.includes('0-2 year') ||
                 searchText.includes('junior');
        } else if (experienceLevel === 'Mid Level') {
          return searchText.includes('mid') || 
                 searchText.includes('3-5 year') ||
                 searchText.includes('intermediate');
        } else if (experienceLevel === 'Senior') {
          return searchText.includes('senior') || 
                 searchText.includes('5+ year') ||
                 searchText.includes('lead');
        }
        return true;
      });
    }
    
    // Filter by salary range
    if (salaryRange) {
      jobs = jobs.filter(job => {
        const salary = job.detected_extensions?.salary || '';
        // This is a basic filter - can be enhanced based on actual salary formats
        return true; // Keep all jobs if salary parsing is complex
      });
    }
    
    // Filter by company
    if (company) {
      jobs = jobs.filter(job => 
        (job.company_name || '').toLowerCase().includes(company.toLowerCase())
      );
    }
    
    // Filter by degree requirement
    if (degreeRequired) {
      jobs = jobs.filter(job => {
        const desc = (job.description || '').toLowerCase();
        const detectedExts = job.detected_extensions || {};
        
        if (degreeRequired === 'No Degree') {
          return detectedExts.no_degree_mentioned === true || 
                 desc.includes('no degree required');
        } else if (degreeRequired === 'Bachelor') {
          return desc.includes('bachelor') || desc.includes('b.e') || 
                 desc.includes('b.tech') || desc.includes('b.sc');
        } else if (degreeRequired === 'Master') {
          return desc.includes('master') || desc.includes('m.e') || 
                 desc.includes('m.tech') || desc.includes('m.sc');
        } else if (degreeRequired === 'PhD') {
          return desc.includes('phd') || desc.includes('doctorate');
        }
        return true;
      });
    }
    
    // Filter by apply platform
    if (applyPlatform) {
      jobs = jobs.filter(job => {
        const via = (job.via || '').toLowerCase();
        const applyLinks = job.apply_links || [];
        const sources = applyLinks.map(link => link.source.toLowerCase()).join(' ');
        
        return via.includes(applyPlatform.toLowerCase()) || 
               sources.includes(applyPlatform.toLowerCase());
      });
    }
    
    res.json({
      success: true,
      jobs: jobs,
      search_parameters: {
        ...data.search_parameters,
        filters_applied: {
          workMode,
          experienceLevel,
          jobType,
          salaryRange,
          techStack,
          postedDate,
          company,
          degreeRequired,
          applyPlatform,
          roleCategory
        }
      },
      total_results: jobs.length
    });
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};
