import { useState } from 'react';

function JobTracker() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [jobs, setJobs] = useState([
    {
      id: 1,
      company: 'Google',
      position: 'Software Engineer',
      status: 'interview',
      appliedDate: '2025-01-15',
      salary: '$120k - $180k',
      location: 'Mountain View, CA',
      notes: 'Phone screen scheduled for next week'
    },
    {
      id: 2,
      company: 'Microsoft',
      position: 'Full Stack Developer',
      status: 'applied',
      appliedDate: '2025-01-10',
      salary: '$110k - $160k',
      location: 'Seattle, WA',
      notes: ''
    },
    {
      id: 3,
      company: 'Amazon',
      position: 'Frontend Engineer',
      status: 'offer',
      appliedDate: '2024-12-20',
      salary: '$130k - $170k',
      location: 'Austin, TX',
      notes: 'Offer received, reviewing details'
    },
    {
      id: 4,
      company: 'Meta',
      position: 'Backend Developer',
      status: 'rejected',
      appliedDate: '2024-12-15',
      salary: '$125k - $175k',
      location: 'Menlo Park, CA',
      notes: 'Did not move forward after technical round'
    }
  ]);

  const [newJob, setNewJob] = useState({
    company: '',
    position: '',
    status: 'applied',
    salary: '',
    location: '',
    notes: ''
  });

  const statusConfig = {
    applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700', icon: '📤' },
    interview: { label: 'Interview', color: 'bg-purple-100 text-purple-700', icon: '🎯' },
    offer: { label: 'Offer', color: 'bg-green-100 text-green-700', icon: '🎉' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: '❌' },
    withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-700', icon: '⏸️' }
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    setJobs([
      ...jobs,
      {
        id: Date.now(),
        ...newJob,
        appliedDate: new Date().toISOString().split('T')[0]
      }
    ]);
    setNewJob({ company: '', position: '', status: 'applied', salary: '', location: '', notes: '' });
    setShowAddModal(false);
  };

  const stats = [
    { label: 'Total Applications', value: jobs.length, color: 'from-blue-500 to-blue-600' },
    { label: 'Interviews', value: jobs.filter(j => j.status === 'interview').length, color: 'from-purple-500 to-purple-600' },
    { label: 'Offers', value: jobs.filter(j => j.status === 'offer').length, color: 'from-green-500 to-green-600' },
    { label: 'Response Rate', value: '65%', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Application Tracker</h1>
          <p className="text-gray-600">Track all your job applications in one place</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md">
            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Job List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{job.company}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{job.position}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${statusConfig[job.status].color}`}>
                      <span>{statusConfig[job.status].icon}</span>
                      {statusConfig[job.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{job.appliedDate}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{job.salary}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{job.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Add Job Application</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddJob} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <input
                    type="text"
                    value={newJob.company}
                    onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                    placeholder="Google"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                  <input
                    type="text"
                    value={newJob.position}
                    onChange={(e) => setNewJob({...newJob, position: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newJob.status}
                    onChange={(e) => setNewJob({...newJob, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  >
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                    placeholder="$100k - $150k"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newJob.notes}
                  onChange={(e) => setNewJob({...newJob, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  placeholder="Add any notes about this application..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all"
                >
                  Add Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobTracker;
