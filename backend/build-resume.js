const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, BorderStyle, ExternalHyperlink, TabStopType, TabStopPosition, convertInchesToTwip } = require('docx');
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
    wclsebsite: '' // Add portfolio if you have one
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

// Professional color scheme
const COLORS = {
  primary: '212529',      // Dark gray for headers
  secondary: '555555',    // Gray for dates
  link: '0066CC',         // Blue for links
  text: '333333'          // Dark text
};

// Helper function to create professional section heading
const createSectionHeading = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 24,
        color: COLORS.primary,
        allCaps: true
      })
    ],
    spacing: { before: 200, after: 80 },
    border: {
      bottom: {
        color: COLORS.primary,
        space: 1,
        style: BorderStyle.SINGLE,
        size: 8
      }
    }
  });
};

// Generate DOCX document with professional formatting
const createResume = (data) => {
  const sections = [];

  // Header - Name (larger, bold, centered)
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.personalInfo.name,
          bold: true,
          size: 40,
          color: COLORS.primary
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    })
  );

  // Contact Information & Social Links (Combined with dot separators)
  const contactChildren = [];
  
  // Add email
  if (data.personalInfo.email) {
    contactChildren.push(new TextRun({ text: data.personalInfo.email, size: 20, color: COLORS.text }));
  }
  
  // Add phone
  if (data.personalInfo.phone) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
    contactChildren.push(new TextRun({ text: data.personalInfo.phone, size: 20, color: COLORS.text }));
  }
  
  // Add location
  if (data.personalInfo.location) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
    contactChildren.push(new TextRun({ text: data.personalInfo.location, size: 20, color: COLORS.text }));
  }
  
  // Add LinkedIn with hyperlink
  if (data.personalInfo.linkedin) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
    contactChildren.push(
      new ExternalHyperlink({
        children: [
          new TextRun({ text: 'LinkedIn', size: 20, color: COLORS.link, underline: { type: UnderlineType.SINGLE } })
        ],
        link: data.personalInfo.linkedin
      })
    );
  }
  
  // Add GitHub with hyperlink
  if (data.personalInfo.github) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
    contactChildren.push(
      new ExternalHyperlink({
        children: [
          new TextRun({ text: 'GitHub', size: 20, color: COLORS.link, underline: { type: UnderlineType.SINGLE } })
        ],
        link: data.personalInfo.github
      })
    );
  }

  // Add Portfolio/Website with hyperlink
  if (data.personalInfo.website) {
    if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
    contactChildren.push(
      new ExternalHyperlink({
        children: [
          new TextRun({ text: 'Portfolio', size: 20, color: COLORS.link, underline: { type: UnderlineType.SINGLE } })
        ],
        link: data.personalInfo.website
      })
    );
  }

  sections.push(
    new Paragraph({
      children: contactChildren,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  );

  // EDUCATION Section
  sections.push(createSectionHeading('Education'));
  
  data.education.forEach(edu => {
    // Degree with date on right
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: edu.degree + (edu.specialization ? ` in ${edu.specialization}` : ''),
            bold: true,
            size: 22,
            color: COLORS.primary
          })
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) }],
        spacing: { after: 40 }
      })
    );
    
    // Institution with CGPA
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: edu.institution,
            italics: true,
            size: 22,
            color: COLORS.text
          }),
          new TextRun({ text: '\t' }),
          new TextRun({
            text: edu.endDate,
            size: 22,
            color: COLORS.secondary
          }),
          ...(edu.cgpa ? [
            new TextRun({ text: '  |  ', size: 22, color: COLORS.secondary }),
            new TextRun({
              text: `CGPA: ${edu.cgpa}`,
              italics: true,
              size: 22,
              color: COLORS.text
            })
          ] : [])
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) }],
        spacing: { after: 100 }
      })
    );

    if (edu.details) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.details, size: 20, color: COLORS.text })
          ],
          spacing: { after: 100 }
        })
      );
    }
  });

  // EXPERIENCE Section
  if (data.experience && data.experience.length > 0) {
    sections.push(createSectionHeading('Experience'));
    
    data.experience.forEach(exp => {
      // Position with date on right
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 22,
              color: COLORS.primary
            }),
            new TextRun({ text: '\t' }),
            new TextRun({
              text: `${exp.startDate} – ${exp.endDate}`,
              size: 22,
              color: COLORS.secondary
            })
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) }],
          spacing: { after: 40 }
        })
      );
      
      // Company with location
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.company,
              italics: true,
              size: 22,
              color: COLORS.text
            }),
            ...(exp.location ? [
              new TextRun({ text: '  •  ', size: 22, color: COLORS.secondary }),
              new TextRun({
                text: exp.location,
                size: 22,
                color: COLORS.text
              })
            ] : [])
          ],
          spacing: { after: 80 }
        })
      );
      
      // Responsibilities as bullet points
      exp.responsibilities.forEach(resp => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: resp, size: 21, color: COLORS.text })
            ],
            bullet: { level: 0 },
            spacing: { after: 40 }
          })
        );
      });
      
      sections.push(new Paragraph({ text: '', spacing: { after: 80 } }));
    });
  }

  // PROJECTS Section
  if (data.projects && data.projects.length > 0) {
    sections.push(createSectionHeading('Projects'));
    
    data.projects.forEach(proj => {
      // Project title with link
      const projChildren = [
        new TextRun({
          text: proj.title,
          bold: true,
          size: 22,
          color: COLORS.primary
        })
      ];
      
      if (proj.link) {
        projChildren.push(new TextRun({ text: '\t' }));
        projChildren.push(
          new ExternalHyperlink({
            children: [
              new TextRun({ text: '[View Project]', size: 20, color: COLORS.link, underline: { type: UnderlineType.SINGLE } })
            ],
            link: proj.link
          })
        );
      }
      
      sections.push(
        new Paragraph({
          children: projChildren,
          tabStops: [{ type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) }],
          spacing: { after: 40 }
        })
      );
      
      // Description
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.description, size: 21, color: COLORS.text })
          ],
          spacing: { after: 40 }
        })
      );
      
      // Technologies
      if (proj.technologies && proj.technologies.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Technologies: ',
                bold: true,
                italics: true,
                size: 20,
                color: COLORS.secondary
              }),
              new TextRun({
                text: proj.technologies.join(', '),
                italics: true,
                size: 20,
                color: COLORS.text
              })
            ],
            spacing: { after: 120 }
          })
        );
      }
    });
  }

  // TECHNICAL SKILLS Section
  sections.push(createSectionHeading('Technical Skills'));
  
  Object.entries(data.skills).forEach(([category, skillList]) => {
    const skillsStr = Array.isArray(skillList) ? skillList.join(', ') : skillList;
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${category}: `,
            bold: true,
            size: 22,
            color: COLORS.primary
          }),
          new TextRun({
            text: skillsStr,
            size: 22,
            color: COLORS.text
          })
        ],
        spacing: { after: 60 }
      })
    );
  });

  // CERTIFICATIONS Section
  if (data.certifications && data.certifications.length > 0) {
    sections.push(createSectionHeading('Certifications'));
    
    data.certifications.forEach(cert => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 22,
              color: COLORS.primary
            }),
            ...(cert.issuer ? [
              new TextRun({ text: ' – ', size: 22, color: COLORS.secondary }),
              new TextRun({
                text: cert.issuer,
                italics: true,
                size: 22,
                color: COLORS.text
              })
            ] : []),
            ...(cert.date ? [
              new TextRun({ text: '\t' }),
              new TextRun({
                text: cert.date,
                size: 22,
                color: COLORS.secondary
              })
            ] : [])
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) }],
          spacing: { after: 60 }
        })
      );
    });
  }

  // ACHIEVEMENTS Section
  if (data.achievements && data.achievements.length > 0) {
    sections.push(createSectionHeading('Achievements & Awards'));
    
    data.achievements.forEach(ach => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: ach, size: 21, color: COLORS.text })
          ],
          bullet: { level: 0 },
          spacing: { after: 50 }
        })
      );
    });
  }

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.5),
            right: convertInchesToTwip(0.6),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.6)
          }
        }
      },
      children: sections
    }]
  });
};

// Generate DOCX file with resume data
const doc = createResume(resumeData);

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
    // Use person's name from resume data for filename
    const nameSlug = resumeData.personalInfo.name.toLowerCase().replace(/\s+/g, '_');
    const outputPath = path.join(outputDir, `${nameSlug}_${timestamp}.tex`);
    fs.writeFileSync(outputPath, latexContent, 'utf8');
    
    console.log('\n✅ Resume LaTeX file generated successfully!');
    console.log(`📄 Output: ${outputPath}`);
    console.log('\n📝 To compile to PDF:');
    console.log('   Option 1: Upload to https://www.overleaf.com (Recommended)');
    console.log('   Option 2: Install LaTeX and run: pdflatex resume.tex');
  } else if (choice === '2') {
    // Generate DOCX
    // Use person's name from resume data for filename
    const nameSlug = resumeData.personalInfo.name.toLowerCase().replace(/\s+/g, '_');
    const outputPath = path.join(outputDir, `${nameSlug}_${timestamp}.docx`);
    
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
