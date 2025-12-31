// Template 6: Teal Aqua - Fresh & Modern
function Template6({ data }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <header className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center text-teal-600 text-5xl font-bold shadow-xl">
            {data.name?.charAt(0) || 'P'}
          </div>
          <h1 className="text-5xl font-bold mb-3">{data.name || 'Your Name'}</h1>
          <p className="text-2xl text-teal-100 mb-4">{data.title || 'Your Title'}</p>
          <div className="flex items-center justify-center gap-6 text-teal-100">
            {data.email && <span>📧 {data.email}</span>}
            {data.phone && <span>📱 {data.phone}</span>}
            {data.location && <span>📍 {data.location}</span>}
          </div>
        </div>
      </header>

      {data.about && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-teal-700 mb-6">About Me</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{data.about}</p>
          </div>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="py-16 bg-teal-50">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-teal-700 mb-6">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-teal-700 mb-8">Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-teal-500 pl-6 hover:border-cyan-500 transition-colors">
                  <h3 className="text-2xl font-bold text-gray-800">{exp.position}</h3>
                  <p className="text-xl text-teal-600 font-semibold">{exp.company}</p>
                  <p className="text-gray-500 mb-3">{exp.duration}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.projects?.length > 0 && (
        <section className="py-16 bg-teal-50">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-teal-700 mb-8">Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{project.name}</h3>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-md text-sm font-medium">
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
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-teal-700 mb-8">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-cyan-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-800">{edu.degree}</h3>
                  <p className="text-teal-600 font-semibold">{edu.institution}</p>
                  <p className="text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-6 mb-4">
            {data.github && <a href={data.github} className="hover:text-teal-200">GitHub</a>}
            {data.linkedin && <a href={data.linkedin} className="hover:text-teal-200">LinkedIn</a>}
          </div>
          <p className="text-teal-100">© 2025 {data.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Template6;
