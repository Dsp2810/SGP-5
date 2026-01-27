/**
 * Professional LaTeX Resume Template Generator
 * Generates ATS-friendly, well-formatted resume with proper styling
 */

const generateLatexResume = (data) => {
  const {
    personalInfo,
    education,
    experience,
    projects,
    skills,
    certifications,
    achievements
  } = data;

  // Build contact line with proper separators
  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location
  ].filter(Boolean).join(' $|$ ');

  // Build social links line
  const socialLinks = [];
  if (personalInfo.linkedin) {
    socialLinks.push(`\\href{${personalInfo.linkedin}}{LinkedIn}`);
  }
  if (personalInfo.github) {
    socialLinks.push(`\\href{${personalInfo.github}}{GitHub}`);
  }
  const socialLine = socialLinks.length > 0 ? socialLinks.join(' $|$ ') : '';

  return `\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}

% Page setup
\\geometry{left=0.75in,right=0.75in,top=0.75in,bottom=0.75in}
\\setlist{nosep, leftmargin=*}
\\pagestyle{empty}

% Hyperlink setup (ATS-friendly)
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue,
    pdfborder={0 0 0}
}

% Section formatting
\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{6pt}

\\begin{document}

% Header
\\begin{center}
{\\LARGE\\bfseries ${personalInfo.name}}\\\\[3pt]
${contactLine}${socialLine ? `\\\\[2pt]\n${socialLine}` : ''}
\\end{center}

\\vspace{8pt}

% Education Section
\\section*{EDUCATION}
${education.map(edu => `\\textbf{${edu.degree}} \\hfill ${edu.startDate} -- ${edu.endDate}\\\\
${edu.institution}${edu.cgpa ? ` \\hfill \\textit{CGPA: ${edu.cgpa}}` : ''}\\\\[4pt]`).join('\n')}

${experience && experience.length > 0 ? `% Experience Section
\\section*{EXPERIENCE}
${experience.map(exp => `\\textbf{${exp.position}} \\hfill ${exp.startDate} -- ${exp.endDate}\\\\
\\textit{${exp.company}}\\\\[2pt]
\\begin{itemize}[topsep=2pt]
${exp.responsibilities.map(resp => `  \\item ${resp}`).join('\n')}
\\end{itemize}
\\vspace{4pt}`).join('\n\n')}
` : ''}

% Projects Section
\\section*{PROJECTS}
${projects.map(proj => `\\textbf{${proj.title}}${proj.link ? ` -- \\href{${proj.link}}{[Link]}` : ''}\\\\
${proj.description}\\\\
\\textit{Technologies: ${proj.technologies.join(', ')}}\\\\[4pt]`).join('\n')}

% Technical Skills Section
\\section*{TECHNICAL SKILLS}
\\begin{itemize}[topsep=2pt]
${Object.entries(skills).map(([category, skillList]) => {
  const skillsStr = Array.isArray(skillList) ? skillList.join(', ') : skillList;
  return `  \\item \\textbf{${category}:} ${skillsStr}`;
}).join('\n')}
\\end{itemize}

${certifications && certifications.length > 0 ? `% Certifications Section
\\section*{CERTIFICATIONS}
\\begin{itemize}[topsep=2pt]
${certifications.map(cert => `  \\item \\textbf{${cert.name}} -- ${cert.issuer} \\hfill ${cert.date}`).join('\n')}
\\end{itemize}
` : ''}

${achievements && achievements.length > 0 ? `% Achievements Section
\\section*{ACHIEVEMENTS}
\\begin{itemize}[topsep=2pt]
${achievements.map(ach => `  \\item ${ach}`).join('\n')}
\\end{itemize}
` : ''}

\\end{document}`;
};

module.exports = { generateLatexResume };
