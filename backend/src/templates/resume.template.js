/**
 * Professional LaTeX Resume Template Generator
 * Generates trendy, ATS-friendly resumes with modern formatting
 * Based on professional resume styling
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

  // Build contact line with social links combined
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location
  ].filter(Boolean);
  
  const contactLine = contactParts.join(' | ');

  return `\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{fancyhdr}
\\usepackage{ragged2e}

% Page setup
\\geometry{left=0.7in,right=0.7in,top=0.5in,bottom=0.5in}
\\setlist{nosep, leftmargin=20pt}
\\pagestyle{empty}

% Hyperlink setup (ATS-friendly)
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=black,
    pdfborder={0 0 0}
}

% Section formatting - Clean and Professional
\\titleformat{\\section}
    {\\vspace{-3pt}\\fontsize{12pt}{12pt}\\bfseries}
    {}
    {0pt}
    {}
    [\\vspace{-8pt}\\hrule\\vspace{4pt}]

\\titlespacing{\\section}{0pt}{8pt}{4pt}

% Use justified text
\\justifying

\\begin{document}

% Header - Compact 2-line format
\\begin{center}
{\\fontsize{16pt}{16pt}\\selectfont\\bfseries ${personalInfo.name}}\\\\[3pt]
{\\small ${contactLine}}
\\end{center}

\\vspace{6pt}

% Education Section
\\section*{EDUCATION}
${education.map(edu => {
  let eduLine = `\\textbf{${edu.degree}}`;
  if (edu.specialization) {
    eduLine += ` in ${edu.specialization}`;
  }
  eduLine += ` \\hfill ${edu.endDate}`;
  let result = eduLine + `\\\\\n${edu.institution}`;
  if (edu.cgpa) {
    result += ` \\hfill \\textit{CGPA: ${edu.cgpa}}`;
  }
  if (edu.details) {
    result += `\\\\\n\\small ${edu.details}`;
  }
  result += `\\\\\n`;
  return result;
}).join('\n')}

${experience && experience.length > 0 ? `% Professional Experience
\\section*{EXPERIENCE}
${experience.map(exp => `\\textbf{${exp.position}} \\hfill ${exp.startDate} -- ${exp.endDate}\\\\
\\textit{${exp.company}}${exp.location ? ` | ${exp.location}` : ''}\\\\\n\\vspace{2pt}
\\begin{itemize}[topsep=0pt, itemsep=2pt]
${exp.responsibilities.map(resp => `  \\item ${resp}`).join('\n')}
\\end{itemize}
\\vspace{4pt}`).join('\n\n')}

` : ''}

% Projects Section
${projects && projects.length > 0 ? `\\section*{PROJECTS}
${projects.map(proj => {
  let projLine = `\\textbf{${proj.title}}`;
  if (proj.link) {
    projLine += ` \\hfill \\href{${proj.link}}{[GitHub]}`;
  }
  projLine += `\\\\\n${proj.description}`;
  if (proj.technologies && proj.technologies.length > 0) {
    projLine += `\\\\\n\\textit{Tech: ${proj.technologies.join(', ')}}`;
  }
  projLine += `\\\\\n`;
  return projLine;
}).join('\n')}

` : ''}

% Technical Skills Section
\\section*{TECHNICAL SKILLS}
${Object.entries(skills).map(([category, skillList]) => {
  const skillsStr = Array.isArray(skillList) ? skillList.join(', ') : skillList;
  return `\\textbf{${category}:} ${skillsStr}`;
}).join('\\\\\n')}

${certifications && certifications.length > 0 ? `\\section*{CERTIFICATIONS}
${certifications.map(cert => `\\textbf{${cert.name}}${cert.issuer ? ` -- ${cert.issuer}` : ''}${cert.date ? ` \\hfill ${cert.date}` : ''}`).join('\\\\\n')}

` : ''}

${achievements && achievements.length > 0 ? `\\section*{ACHIEVEMENTS & AWARDS}
\\begin{itemize}[topsep=0pt, itemsep=2pt]
${achievements.map(ach => `  \\item ${ach}`).join('\n')}
\\end{itemize}

` : ''}

\\end{document}`;
};

module.exports = { generateLatexResume };
