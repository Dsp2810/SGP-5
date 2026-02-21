import { Link } from 'react-router-dom';

function DashboardHome() {
  const features = [
    {
      title: 'Portfolio Generator',
      icon: '💼',
      link: '/dashboard/portfolio',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Resume Builder',
      icon: '📄',
      link: '/dashboard/resume',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Job Tracker',
      icon: '📊',
      link: '/dashboard/jobs',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'ATS Analyzer',

      icon: '📈',
      link: '/dashboard/ats',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Mock Interview',
      icon: '🎥',
      link: '/dashboard/interview',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Aptitude Tests',
      icon: '✅',
      link: '/dashboard/aptitude',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-1">Welcome to Placify! 🚀</h1>
        <p className="text-gray-100">Your career companion</p>
      </div>

      {/* Features Grid */}
      <div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              <div className="mt-4 flex items-center text-gray-500 text-sm font-medium group-hover:text-gray-700">
                Get Started
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
