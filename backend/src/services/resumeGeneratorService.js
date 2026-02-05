const latex = require('node-latex');
const fs = require('fs-extra');
const path = require('path');
const { Readable } = require('stream');
const { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  TabStopType,
  TabStopPosition,
  BorderStyle,
  ExternalHyperlink,
  convertInchesToTwip
} = require('docx');
const { generateLatexResume } = require('../templates/resume.template');
const SanitizerUtils = require('../utils/sanitizer');

const GENERATED_DIR = path.join(__dirname, '../../generated');

// Ensure directory exists
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

// Professional color scheme
const COLORS = {
  primary: '212529',      // Dark gray for headers
  secondary: '555555',    // Gray for dates
  link: '0066CC',         // Blue for links
  text: '333333'          // Dark text
};

// Helper function to ensure URL has proper protocol
const ensureUrlProtocol = (url) => {
  if (!url) return '';
  url = url.trim();
  
  // Remove any malformed or duplicate protocols
  url = url.replace(/^(https?:\/\/)+(https?:)?/i, '');
  
  // If it already starts with http:// or https://, return as is
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  
  // Add https:// if missing
  return 'https://' + url.replace(/^\/+/, '');
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

class ResumeGeneratorService {
  async generatePDF(resumeData, userId) {
    try {
      // Sanitize data for LaTeX
      const sanitizedData = SanitizerUtils.sanitizeForLaTeX(resumeData);
      
      const latexContent = generateLatexResume(sanitizedData);
      const timestamp = Date.now();
      // Use person's name from resume data for filename
      const nameSlug = sanitizedData.personalInfo?.name?.toLowerCase().replace(/\s+/g, '_') || 'resume';
      const filename = SanitizerUtils.sanitizeFilename(`${nameSlug}_${timestamp}.pdf`);
      const filepath = path.join(GENERATED_DIR, filename);

      return new Promise((resolve, reject) => {
        // Create readable stream from string
        const input = Readable.from([latexContent]);
        const output = fs.createWriteStream(filepath);

        const pdf = latex(input);
        
        pdf.pipe(output);

        pdf.on('error', (err) => {
          reject(new Error(`LaTeX compilation failed: ${err.message}`));
        });

        output.on('finish', () => {
          resolve({
            filename,
            filepath,
            url: `/api/resume/download/${filename}`
          });
        });

        output.on('error', (err) => {
          reject(new Error(`File write failed: ${err.message}`));
        });
      });
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  async generateDOCX(resumeData, userId) {
    try {
      const { personalInfo, education, experience, projects, skills, certifications, achievements } = resumeData;
      
      const sections = [];

      // ============ HEADER SECTION ============
      // Name (larger, bold, centered)
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personalInfo.name,
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
      if (personalInfo.email) {
        contactChildren.push(new TextRun({ text: personalInfo.email, size: 20, color: COLORS.text }));
      }
      
      // Add phone
      if (personalInfo.phone) {
        if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
        contactChildren.push(new TextRun({ text: personalInfo.phone, size: 20, color: COLORS.text }));
      }
      
      // Add location
      if (personalInfo.location) {
        if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
        contactChildren.push(new TextRun({ text: personalInfo.location, size: 20, color: COLORS.text }));
      }
      
      // Add LinkedIn with hyperlink
      if (personalInfo.linkedin) {
        if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
        contactChildren.push(
          new ExternalHyperlink({
            children: [
              new TextRun({ text: 'LinkedIn', size: 20, color: COLORS.link, underline: { type: UnderlineType.SINGLE } })
            ],
            link: ensureUrlProtocol(personalInfo.linkedin)
          })
        );
      }
      
      // Add GitHub with hyperlink
      if (personalInfo.github) {
        if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
        contactChildren.push(
          new ExternalHyperlink({
            children: [
              new TextRun({ text: 'GitHub', size: 20, color: COLORS.link, underline: { type: UnderlineType.SINGLE } })
            ],
            link: ensureUrlProtocol(personalInfo.github)
          })
        );
      }

      // Add Portfolio/Website with hyperlink
      if (personalInfo.website) {
        if (contactChildren.length > 0) contactChildren.push(new TextRun({ text: '  •  ', size: 20, color: COLORS.secondary }));
        contactChildren.push(
          new ExternalHyperlink({
            children: [
              new TextRun({ text: 'Portfolio', size: 20, color: COLORS.link, underline: { type: UnderlineType.SINGLE } })
            ],
            link: ensureUrlProtocol(personalInfo.website)
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

      // ============ EDUCATION SECTION ============
      sections.push(createSectionHeading('Education'));
      
      education.forEach(edu => {
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
      });

      // ============ EXPERIENCE SECTION ============
      if (experience && experience.length > 0) {
        sections.push(createSectionHeading('Experience'));
        
        experience.forEach(exp => {
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

      // ============ PROJECTS SECTION ============
      if (projects && projects.length > 0) {
        sections.push(createSectionHeading('Projects'));
        
        projects.forEach(proj => {
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
                link: ensureUrlProtocol(proj.link)
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

      // ============ SKILLS SECTION ============
      if (skills) {
        sections.push(createSectionHeading('Technical Skills'));
        
        // Handle skills as object (categories) or simple arrays
        if (typeof skills === 'object' && !Array.isArray(skills)) {
          Object.entries(skills).forEach(([category, skillList]) => {
            // Skip empty arrays or undefined/null values
            if (!skillList || (Array.isArray(skillList) && skillList.length === 0)) return;
            
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
        } else if (skills.technical || skills.soft) {
          // Handle old format with technical/soft arrays
          if (skills.technical && skills.technical.length > 0) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Technical Skills: ', bold: true, size: 22, color: COLORS.primary }),
                  new TextRun({ text: skills.technical.join(', '), size: 22, color: COLORS.text })
                ],
                spacing: { after: 60 }
              })
            );
          }
          if (skills.soft && skills.soft.length > 0) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Soft Skills: ', bold: true, size: 22, color: COLORS.primary }),
                  new TextRun({ text: skills.soft.join(', '), size: 22, color: COLORS.text })
                ],
                spacing: { after: 60 }
              })
            );
          }
        }
      }

      // ============ CERTIFICATIONS SECTION ============
      if (certifications && certifications.length > 0) {
        sections.push(createSectionHeading('Certifications'));
        
        certifications.forEach(cert => {
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

      // ============ ACHIEVEMENTS SECTION ============
      if (achievements && achievements.length > 0) {
        sections.push(createSectionHeading('Achievements & Awards'));
        
        achievements.forEach(ach => {
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

      // Create document
      const doc = new Document({ 
        sections: [{ 
          properties: {},
          children: sections 
        }] 
      });

      const timestamp = Date.now();
      // Use person's name from resume data for filename
      const nameSlug = personalInfo?.name?.toLowerCase().replace(/\s+/g, '_') || 'resume';
      const filename = SanitizerUtils.sanitizeFilename(`${nameSlug}_${timestamp}.docx`);
      const filepath = path.join(GENERATED_DIR, filename);

      const buffer = await Packer.toBuffer(doc);
      await fs.writeFile(filepath, buffer);

      return {
        filename,
        filepath,
        url: `/api/resume/download/${filename}`
      };
    } catch (error) {
      throw new Error(`DOCX generation failed: ${error.message}`);
    }
  }

  async deleteFile(filename) {
    try {
      const filepath = path.join(GENERATED_DIR, filename);
      await fs.remove(filepath);
      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }
}

module.exports = new ResumeGeneratorService();
