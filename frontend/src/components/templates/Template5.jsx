// Template 5: Midnight Dark - Professional & Modern
function Template5({ data }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 py-16 border-b-4 border-indigo-500">
        <div className="container mx-auto px-6 text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
            {data.name?.charAt(0) || 'P'}
          </div>
          <h1 className="text-5xl font-bold mb-3">{data.name || 'Your Name'}</h1>
          <p className="text-2xl text-gray-300 mb-4">{data.title || 'Your Title'}</p>
          <div className="flex items-center justify-center gap-6 text-gray-400">
            {data.email && <span>📧 {data.email}</span>}
            {data.phone && <span>📱 {data.phone}</span>}
            {data.location && <span>📍 {data.location}</span>}
          </div>
        </div>
      </header>

      {data.about && (
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-indigo-400 mb-6">About Me</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{data.about}</p>
          </div>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-indigo-400 mb-6">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-indigo-400 mb-8">Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-6 hover:border-purple-500 transition-colors">
                  <h3 className="text-2xl font-bold text-white">{exp.position}</h3>
                  <p className="text-xl text-indigo-400 font-semibold">{exp.company}</p>
                  <p className="text-gray-400 mb-3">{exp.duration}</p>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.projects?.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-indigo-400 mb-8">Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-3">{project.name}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-900 text-indigo-300 rounded-md text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.education?.length > 0 && (
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-indigo-400 mb-8">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <p className="text-indigo-400 font-semibold">{edu.institution}</p>
                  <p className="text-gray-400">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-gray-800 border-t-4 border-indigo-500 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-6 mb-4">
            {data.github && <a href={data.github} className="hover:text-indigo-400">GitHub</a>}
            {data.linkedin && <a href={data.linkedin} className="hover:text-indigo-400">LinkedIn</a>}
          </div>
          <p className="text-gray-400">© 2025 {data.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Template5;
