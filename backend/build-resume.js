const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, BorderStyle } = require('docx');
const { generateLatexResume } = require('./src/templates/resume.template');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Your resume data
const resumeData = {
  personalInfo: {
    name: 'DHAVAL PATEL',
    email: 'dspatel0006@gmail.com',
    phone: '+91-XXXXXXXXXX', // Add your phone number
    location: 'Gujarat, India',
    linkedin: 'https://www.linkedin.com/in/pateldhavals-',
    github: 'https://github.com/Dsp2810',
    website: '' // Add portfolio if you have one
  },

  education: [
    {
      degree: 'Bachelor of Technology',
      specialization: 'Computer Science and Engineering',
      institution: 'Your University Name',
      endDate: 'Expected 2026',
      cgpa: '8.5', // Add your actual CGPA
      details: '' // Any additional details
    }
  ],

  experience: [
    {
      position: 'Software Development Intern',
      company: 'Company Name',
      location: 'Location',
      startDate: 'June 2025',
      endDate: 'Present',
      responsibilities: [
        'Developed and maintained full-stack web applications using React and Node.js',
        'Implemented RESTful APIs and integrated third-party services',
        'Collaborated with cross-functional teams to deliver features on schedule',
        'Optimized database queries resulting in 30% performance improvement'
      ]
    }
  ],

  projects: [
    {
      title: 'SGP-5 - Job Portal & Career Assistant',
      link: 'https://github.com/Dsp2810/SGP-5',
      description: 'A comprehensive career development platform with resume builder, ATS analyzer, job tracker, and portfolio generator features.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'LaTeX', 'JWT Authentication']
    },
    {
      title: 'Resume Builder & ATS Analyzer',
      link: 'https://github.com/Dsp2810',
      description: 'Intelligent resume generation system with ATS optimization and professional LaTeX templates.',
      technologies: ['React', 'LaTeX', 'NLP', 'PDF Generation', 'Material-UI']
    },
    {
      title: 'Mock Interview Platform',
      link: '',
      description: 'Interactive interview preparation tool with AI-powered feedback and performance analytics.',
      technologies: ['React', 'Speech Recognition', 'OpenAI API', 'WebRTC']
    }
  ],

  skills: {
    'Programming Languages': ['JavaScript', 'Python', 'Java', 'C++', 'SQL'],
    'Web Technologies': ['React.js', 'Node.js', 'Express.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
    'Databases': ['MongoDB', 'MySQL', 'PostgreSQL'],
    'Tools & Platforms': ['Git', 'GitHub', 'VS Code', 'Postman', 'Docker', 'AWS'],
    'Concepts': ['Data Structures', 'Algorithms', 'OOP', 'REST APIs', 'Microservices']
  },

  certifications: [
    {
      name: 'Full Stack Web Development',
      issuer: 'Udemy',
      date: 'Jan 2025'
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Dec 2024'
    }
  ],

  achievements: [
    'Winner of University Hackathon 2025 - Built an AI-powered career guidance platform',
    'Published research paper on "Machine Learning in Career Development" in IEEE Conference',
    'Led a team of 5 developers in building a college management system',
    'Active contributor to open-source projects with 50+ GitHub contributions'
  ]
};

// Helper function to create section heading
const createSectionHeading = (text) => {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    border: {
      bottom: {
        color: "000000",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6
      }
    }
  });
};

// Generate DOCX document
const createResume = () => {
  const sections = [];

  // Header - Name
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.personalInfo.name,
          bold: true,
          size: 32
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 }
    })
  );

  // Contact Information & Social Links (Combined in one line)
  const contactChildren = [];
  
  // Add email
  if (resumeData.personalInfo.email) {
    contactChildren.push(new TextRun({ text: resumeData.personalInfo.email, size: 20 }));
  }
  
  // Add phone
  if (resumeData.personalInfo.phone) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: ' | ', size: 20 }));
    contactChildren.push(new TextRun({ text: resumeData.personalInfo.phone, size: 20 }));
  }
  
  // Add location
  if (resumeData.personalInfo.location) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: ' | ', size: 20 }));
    contactChildren.push(new TextRun({ text: resumeData.personalInfo.location, size: 20 }));
  }
  
  // Add LinkedIn
  if (resumeData.personalInfo.linkedin) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: ' | ', size: 20 }));
    contactChildren.push(new TextRun({ text: 'LinkedIn', size: 20, color: '0000FF', underline: {} }));
  }
  
  // Add GitHub
  if (resumeData.personalInfo.github) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: ' | ', size: 20 }));
    contactChildren.push(new TextRun({ text: 'GitHub', size: 20, color: '0000FF', underline: {} }));
  }

  sections.push(
    new Paragraph({
      children: contactChildren,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  );

  // EDUCATION Section
  sections.push(createSectionHeading('EDUCATION'));
  
  resumeData.education.forEach(edu => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: edu.degree + (edu.specialization ? ` in ${edu.specialization}` : ''),
            bold: true,
            size: 22
          }),
          new TextRun({
            text: `\t\t${edu.endDate}`,
            size: 22
          })
        ],
        spacing: { after: 50 }
      })
    );
    
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: edu.institution,
            italics: true,
            size: 22
          }),
          ...(edu.cgpa ? [new TextRun({
            text: `\t\tCGPA: ${edu.cgpa}`,
            italics: true,
            size: 22
          })] : [])
        ],
        spacing: { after: 100 }
      })
    );
  });

  // EXPERIENCE Section
  if (resumeData.experience && resumeData.experience.length > 0) {
    sections.push(createSectionHeading('EXPERIENCE'));
    
    resumeData.experience.forEach(exp => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 22
            }),
            new TextRun({
              text: `\t\t${exp.startDate} -- ${exp.endDate}`,
              size: 22
            })
          ],
          spacing: { after: 50 }
        })
      );
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.company + (exp.location ? ` | ${exp.location}` : ''),
              italics: true,
              size: 22
            })
          ],
          spacing: { after: 100 }
        })
      );
      
      exp.responsibilities.forEach(resp => {
        sections.push(
          new Paragraph({
            text: resp,
            bullet: { level: 0 },
            size: 22,
            spacing: { after: 50 }
          })
        );
      });
      
      sections.push(new Paragraph({ text: '', spacing: { after: 100 } }));
    });
  }

  // PROJECTS Section
  if (resumeData.projects && resumeData.projects.length > 0) {
    sections.push(createSectionHeading('PROJECTS'));
    
    resumeData.projects.forEach(proj => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
              size: 22
            }),
            ...(proj.link ? [new TextRun({
              text: `\t\t[GitHub]`,
              size: 20
            })] : [])
          ],
          spacing: { after: 50 }
        })
      );
      
      sections.push(
        new Paragraph({
          text: proj.description,
          size: 22,
          spacing: { after: 50 }
        })
      );
      
      if (proj.technologies && proj.technologies.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Tech: ' + proj.technologies.join(', '),
                italics: true,
                size: 20
              })
            ],
            spacing: { after: 150 }
          })
        );
      }
    });
  }

  // TECHNICAL SKILLS Section
  sections.push(createSectionHeading('TECHNICAL SKILLS'));
  
  Object.entries(resumeData.skills).forEach(([category, skillList]) => {
    const skillsStr = Array.isArray(skillList) ? skillList.join(', ') : skillList;
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${category}: `,
            bold: true,
            size: 22
          }),
          new TextRun({
            text: skillsStr,
            size: 22
          })
        ],
        spacing: { after: 100 }
      })
    );
  });

  // CERTIFICATIONS Section
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    sections.push(createSectionHeading('CERTIFICATIONS'));
    
    resumeData.certifications.forEach(cert => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 22
            }),
            ...(cert.issuer ? [new TextRun({
              text: ` -- ${cert.issuer}`,
              size: 22
            })] : []),
            ...(cert.date ? [new TextRun({
              text: `\t\t${cert.date}`,
              size: 22
            })] : [])
          ],
          spacing: { after: 100 }
        })
      );
    });
  }

  // ACHIEVEMENTS Section
  if (resumeData.achievements && resumeData.achievements.length > 0) {
    sections.push(createSectionHeading('ACHIEVEMENTS & AWARDS'));
    
    resumeData.achievements.forEach(ach => {
      sections.push(
        new Paragraph({
          text: ach,
          bullet: { level: 0 },
          size: 22,
          spacing: { after: 50 }
        })
      );
    });
  }

  return new Document({
    sections: [{
      properties: {},
      children: sections
    }]
  });
};

// Generate DOCX file
const doc = createResume();

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ask user for format preference
console.log('\n📄 Choose output format:');
console.log('1. PDF (LaTeX - requires compilation)');
console.log('2. DOCX (Microsoft Word - ready to open)');

rl.question('\nEnter your choice (1 or 2): ', (choice) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  
  if (choice === '1') {
    // Generate LaTeX/PDF
    const latexContent = generateLatexResume(resumeData);
    const outputPath = path.join(outputDir, `resume_${timestamp}.tex`);
    fs.writeFileSync(outputPath, latexContent, 'utf8');
    
    console.log('\n✅ Resume LaTeX file generated successfully!');
    console.log(`📄 Output: ${outputPath}`);
    console.log('\n📝 To compile to PDF:');
    console.log('   Option 1: Upload to https://www.overleaf.com (Recommended)');
    console.log('   Option 2: Install LaTeX and run: pdflatex resume.tex');
  } else if (choice === '2') {
    // Generate DOCX
    const outputPath = path.join(outputDir, `resume_${timestamp}.docx`);
    
    Packer.toBuffer(doc).then(buffer => {
      fs.writeFileSync(outputPath, buffer);
      
      console.log('\n✅ Resume DOCX file generated successfully!');
      console.log(`📄 Output: ${outputPath}`);
      console.log('\n📝 Next steps:');
      console.log('   1. Open the file in Microsoft Word');
      console.log('   2. Make any final adjustments');
      console.log('   3. Export as PDF if needed');
    }).catch(err => {
      console.error('❌ Error generating resume:', err);
    }).finally(() => {
      rl.close();
    });
    return;
  } else {
    console.log('❌ Invalid choice. Please run again and select 1 or 2.');
  }
  
  rl.close();
});
