import { useState, useEffect } from 'react';
import { indianStates, getCitiesForState } from '../../data/indianLocations';

function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('python developer');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Location Filters
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [workMode, setWorkMode] = useState(''); // Remote/Onsite/Hybrid

  // Job Filters
  const [experienceLevel, setExperienceLevel] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [techStack, setTechStack] = useState('');
  const [postedDate, setPostedDate] = useState('');
  const [company, setCompany] = useState('');
  const [degreeRequired, setDegreeRequired] = useState('');
  const [applyPlatform, setApplyPlatform] = useState('');
  const [roleCategory, setRoleCategory] = useState('');

  // Available cities based on selected state
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    // Check if jobs are cached in sessionStorage
    const cachedJobs = sessionStorage.getItem('jobsData');
    if (cachedJobs) {
      setJobs(JSON.parse(cachedJobs));
    }
    // API will only be called when user clicks "Search Jobs" button
  }, []);

  // Update available cities when state changes
  useEffect(() => {
    if (state) {
      setAvailableCities(getCitiesForState(state));
      setCity(''); // Reset city when state changes
    } else {
      setAvailableCities([]);
      setCity('');
    }
  }, [state]);

  const buildLocationQuery = () => {
    let locationParts = [];
    
    if (city) {
      locationParts.push(city);
    }
    if (state) {
      locationParts.push(state);
    }
    if (country) {
      locationParts.push(country);
    }
    
    return locationParts.join(', ') || 'India';
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams({
        query: searchQuery,
        location: buildLocationQuery(),
      });

      // Add optional filters
      if (workMode) params.append('workMode', workMode);
      if (experienceLevel) params.append('experienceLevel', experienceLevel);
      if (jobType) params.append('jobType', jobType);
      if (salaryRange) params.append('salaryRange', salaryRange);
      if (techStack) params.append('techStack', techStack);
      if (postedDate) params.append('postedDate', postedDate);
      if (company) params.append('company', company);
      if (degreeRequired) params.append('degreeRequired', degreeRequired);
      if (applyPlatform) params.append('applyPlatform', applyPlatform);
      if (roleCategory) params.append('roleCategory', roleCategory);

      const response = await fetch(
        `http://localhost:5000/api/jobs/search?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch jobs');
      }

      setJobs(data.jobs || []);
      // Cache the results in sessionStorage
      sessionStorage.setItem('jobsData', JSON.stringify(data.jobs || []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Clear cache and fetch new results
    sessionStorage.removeItem('jobsData');
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearchQuery('python developer');
    setCountry('India');
    setState('');
    setCity('');
    setWorkMode('');
    setExperienceLevel('');
    setJobType('');
    setSalaryRange('');
    setTechStack('');
    setPostedDate('');
    setCompany('');
    setDegreeRequired('');
    setApplyPlatform('');
    setRoleCategory('');
  };

  const handleShowDetails = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Job Tracker</h1>
          <p className="text-gray-600 mt-1">Search and track job opportunities</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title / Keywords
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="e.g., Python Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Mode
            </label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Location Filters for India */}
        {country === 'India' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                {indianStates.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                disabled={!state}
              >
                <option value="">All Cities</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Advanced Filters - Collapsible */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Entry Level">Entry Level (0-2 years)</option>
                  <option value="Mid Level">Mid Level (3-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                  <option value="Lead">Lead/Principal</option>
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (LPA)
                </label>
                <select
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">Any Salary</option>
                  <option value="0-3">0-3 LPA</option>
                  <option value="3-5">3-5 LPA</option>
                  <option value="5-8">5-8 LPA</option>
                  <option value="8-12">8-12 LPA</option>
                  <option value="12-18">12-18 LPA</option>
                  <option value="18+">18+ LPA</option>
                </select>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tech Stack
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="e.g., Python, React, AWS"
                />
              </div>

              {/* Posted Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posted Date
                </label>
                <select
                  value={postedDate}
                  onChange={(e) => setPostedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">Any Time</option>
                  <option value="24h">Last 24 hours</option>
                  <option value="3d">Last 3 days</option>
                  <option value="7d">Last 7 days</option>
                  <option value="14d">Last 14 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Company name"
                />
              </div>

              {/* Degree Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree Required
                </label>
                <select
                  value={degreeRequired}
                  onChange={(e) => setDegreeRequired(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">Any Degree</option>
                  <option value="No Degree">No Degree Required</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              {/* Apply Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apply Platform
                </label>
                <select
                  value={applyPlatform}
                  onChange={(e) => setApplyPlatform(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">All Platforms</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Naukri">Naukri</option>
                  <option value="Shine">Shine</option>
                  <option value="Company Website">Company Website</option>
                </select>
              </div>

              {/* Role Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Category
                </label>
                <select
                  value={roleCategory}
                  onChange={(e) => setRoleCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="QA/Testing">QA/Testing</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Product Management">Product Management</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-6 rounded-lg hover:from-gray-900 hover:to-black transition duration-200 disabled:opacity-50 font-medium"
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-800"></div>
            <p className="text-gray-600 mt-2">Loading jobs...</p>
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <p className="text-gray-600">No jobs found. Try different search criteria.</p>
          </div>
        )}

        {!loading && jobs.map((job, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  {job.thumbnail && (
                    <img src={job.thumbnail} alt={job.company_name} className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                    <p className="text-gray-600 mt-1">{job.company_name}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Position #{job.position}
                      </span>
                      {job.via && (
                        <span className="text-gray-500">via {job.via.replace('via ', '')}</span>
                      )}
                    </div>
                    {job.extensions && job.extensions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.extensions.map((ext, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {ext}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:w-48">
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2 px-4 rounded-lg hover:from-gray-900 hover:to-black transition duration-200 text-center"
                >
                  Apply Now
                </a>
                <button
                  onClick={() => handleShowDetails(job)}
                  className="border-2 border-gray-800 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-800 hover:text-white transition duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Company</h3>
                <p className="text-gray-600">{selectedJob.company_name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                <p className="text-gray-600">{selectedJob.location}</p>
              </div>
              {selectedJob.description && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-line text-sm">{selectedJob.description}</p>
                </div>
              )}
              {selectedJob.detected_extensions && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Job Details</h3>
                  <div className="space-y-2 text-sm">
                    {selectedJob.detected_extensions.schedule && (
                      <p className="text-gray-600"><span className="font-medium">Schedule:</span> {selectedJob.detected_extensions.schedule}</p>
                    )}
                    {selectedJob.detected_extensions.salary && (
                      <p className="text-gray-600"><span className="font-medium">Salary:</span> {selectedJob.detected_extensions.salary}</p>
                    )}
                    {selectedJob.detected_extensions.posted_at && (
                      <p className="text-gray-600"><span className="font-medium">Posted:</span> {selectedJob.detected_extensions.posted_at}</p>
                    )}
                  </div>
                </div>
              )}
              {selectedJob.apply_links && selectedJob.apply_links.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Apply On</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.apply_links.map((link, i) => (
                      <a
                        key={i}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition"
                      >
                        {link.source}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobTracker;
