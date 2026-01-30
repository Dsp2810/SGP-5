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
  
  const contactLine = contactParts.join(' $\\cdot$ ');

  // Build social links line with proper hyperlinks
  const socialLinks = [];
  if (personalInfo.linkedin) {
    socialLinks.push(`\\href{${personalInfo.linkedin}}{\\textcolor{linkblue}{LinkedIn}}`);
  }
  if (personalInfo.github) {
    socialLinks.push(`\\href{${personalInfo.github}}{\\textcolor{linkblue}{GitHub}}`);
  }
  if (personalInfo.website) {
    socialLinks.push(`\\href{${personalInfo.website}}{\\textcolor{linkblue}{Portfolio}}`);
  }
  const socialLine = socialLinks.length > 0 ? ` $\\cdot$ ${socialLinks.join(' $\\cdot$ ')}` : '';

  return `\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{fancyhdr}
\\usepackage{ragged2e}
\\usepackage{tabularx}
\\usepackage{fontawesome5}

% Page setup
\\geometry{left=0.6in,right=0.6in,top=0.5in,bottom=0.5in}
\\setlist{nosep, leftmargin=18pt}
\\pagestyle{empty}

% Define colors
\\definecolor{headercolor}{RGB}{33, 37, 41}
\\definecolor{sectioncolor}{RGB}{33, 37, 41}
\\definecolor{linkblue}{RGB}{0, 102, 204}
\\definecolor{datecolor}{RGB}{85, 85, 85}

% Hyperlink setup (ATS-friendly)
\\hypersetup{
    colorlinks=true,
    linkcolor=linkblue,
    urlcolor=linkblue,
    filecolor=linkblue,
    pdfborder={0 0 0},
    pdfnewwindow=true
}

% Section formatting - Clean and Professional
\\titleformat{\\section}
    {\\vspace{-4pt}\\color{sectioncolor}\\fontsize{11pt}{11pt}\\bfseries\\scshape}
    {}
    {0pt}
    {}
    [\\vspace{-6pt}\\textcolor{sectioncolor}{\\hrule height 0.8pt}\\vspace{4pt}]

\\titlespacing{\\section}{0pt}{10pt}{6pt}

% Use justified text
\\justifying

\\begin{document}

% Header - Professional 2-line format
\\begin{center}
{\\fontsize{20pt}{20pt}\\selectfont\\textcolor{headercolor}{\\textbf{${personalInfo.name}}}}\\\\[6pt]
{\\small ${contactLine}${socialLine}}
\\end{center}

\\vspace{8pt}

% Education Section
\\section*{Education}
${education.map(edu => {
  let result = `\\noindent\\textbf{${edu.degree}${edu.specialization ? ` in ${edu.specialization}` : ''}} \\hfill \\textcolor{datecolor}{${edu.endDate}}\\\\
${edu.institution}${edu.cgpa ? ` \\hfill \\textit{CGPA: ${edu.cgpa}}` : ''}`;
  if (edu.details) {
    result += `\\\\
\\small{${edu.details}}`;
  }
  return result;
}).join('\\\\[8pt]\n')}

${experience && experience.length > 0 ? `\\vspace{4pt}
% Professional Experience
\\section*{Experience}
${experience.map(exp => `\\noindent\\textbf{${exp.position}} \\hfill \\textcolor{datecolor}{${exp.startDate} -- ${exp.endDate}}\\\\
\\textit{${exp.company}}${exp.location ? ` $\\cdot$ ${exp.location}` : ''}
\\begin{itemize}[topsep=4pt, itemsep=2pt, parsep=0pt]
${exp.responsibilities.map(resp => `  \\item ${resp}`).join('\n')}
\\end{itemize}`).join('\\vspace{6pt}\n\n')}
` : ''}

${projects && projects.length > 0 ? `% Projects Section
\\section*{Projects}
${projects.map(proj => {
  let projLine = `\\noindent\\textbf{${proj.title}}`;
  if (proj.link) {
    projLine += ` \\hfill \\href{${proj.link}}{\\textcolor{linkblue}{\\small [View Project]}}`;
  }
  projLine += `\\\\
${proj.description}`;
  if (proj.technologies && proj.technologies.length > 0) {
    projLine += `\\\\
\\textit{\\small Technologies: ${proj.technologies.join(', ')}}`;
  }
  return projLine;
}).join('\\\\[8pt]\n')}
` : ''}

% Technical Skills Section
\\section*{Technical Skills}
\\begin{tabularx}{\\textwidth}{@{}l X@{}}
${Object.entries(skills).map(([category, skillList]) => {
  const skillsStr = Array.isArray(skillList) ? skillList.join(', ') : skillList;
  return `\\textbf{${category}:} & ${skillsStr}`;
}).join(' \\\\\n')}
\\end{tabularx}

${certifications && certifications.length > 0 ? `\\section*{Certifications}
${certifications.map(cert => `\\noindent\\textbf{${cert.name}}${cert.issuer ? ` -- \\textit{${cert.issuer}}` : ''}${cert.date ? ` \\hfill \\textcolor{datecolor}{${cert.date}}` : ''}`).join('\\\\\n')}
` : ''}

${achievements && achievements.length > 0 ? `\\section*{Achievements \\& Awards}
\\begin{itemize}[topsep=2pt, itemsep=3pt, parsep=0pt]
${achievements.map(ach => `  \\item ${ach}`).join('\n')}
\\end{itemize}
` : ''}

\\end{document}`;
};

module.exports = { generateLatexResume };
