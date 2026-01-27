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
  TabStopPosition
} = require('docx');
const { generateLatexResume } = require('../templates/resume.template');
const SanitizerUtils = require('../utils/sanitizer');

const GENERATED_DIR = path.join(__dirname, '../../generated');

// Ensure directory exists
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

class ResumeGeneratorService {
  async generatePDF(resumeData, userId) {
    try {
      // Sanitize data for LaTeX
      const sanitizedData = SanitizerUtils.sanitizeForLaTeX(resumeData);
      
      const latexContent = generateLatexResume(sanitizedData);
      const timestamp = Date.now();
      const filename = SanitizerUtils.sanitizeFilename(`resume_${userId}_${timestamp}.pdf`);
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
      sections.push(
        new Paragraph({
          text: personalInfo.name,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        })
      );

      // Contact info
      const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean);
      sections.push(
        new Paragraph({
          text: contactParts.join(' | '),
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        })
      );

      // Social links
      if (personalInfo.linkedin || personalInfo.github) {
        const socialParts = [];
        if (personalInfo.linkedin) socialParts.push(`LinkedIn: ${personalInfo.linkedin}`);
        if (personalInfo.github) socialParts.push(`GitHub: ${personalInfo.github}`);
        
        sections.push(
          new Paragraph({
            text: socialParts.join(' | '),
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          })
        );
      }

      // ============ EDUCATION SECTION ============
      sections.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
          thematicBreak: true
        })
      );

      education.forEach((edu, index) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree, bold: true }),
              new TextRun({ text: ` | ${edu.institution}` }),
            ],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.startDate} - ${edu.endDate}` }),
              ...(edu.cgpa ? [new TextRun({ text: ` | CGPA: ${edu.cgpa}`, bold: true })] : [])
            ],
            spacing: { after: index < education.length - 1 ? 150 : 200 }
          })
        );
      });

      // ============ EXPERIENCE SECTION ============
      if (experience && experience.length > 0) {
        sections.push(
          new Paragraph({
            text: 'EXPERIENCE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            thematicBreak: true
          })
        );

        experience.forEach((exp, expIndex) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true }),
                new TextRun({ text: ` | ${exp.company}` }),
              ],
              spacing: { after: 50 }
            }),
            new Paragraph({
              text: `${exp.startDate} - ${exp.endDate}`,
              spacing: { after: 100 }
            })
          );

          // Responsibilities as bullet points
          exp.responsibilities.forEach((resp, respIndex) => {
            sections.push(
              new Paragraph({
                text: resp,
                bullet: { level: 0 },
                spacing: { after: respIndex < exp.responsibilities.length - 1 ? 50 : 150 }
              })
            );
          });

          if (expIndex < experience.length - 1) {
            sections.push(new Paragraph({ spacing: { after: 100 } }));
          }
        });
      }

      // ============ PROJECTS SECTION ============
      sections.push(
        new Paragraph({
          text: 'PROJECTS',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
          thematicBreak: true
        })
      );

      projects.forEach((proj, index) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: proj.title, bold: true }),
              ...(proj.link ? [new TextRun({ text: ` | ${proj.link}`, italics: true })] : [])
            ],
            spacing: { after: 50 }
          }),
          new Paragraph({
            text: proj.description,
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Technologies: ', italics: true }),
              new TextRun({ text: proj.technologies.join(', ') })
            ],
            spacing: { after: index < projects.length - 1 ? 150 : 200 }
          })
        );
      });

      // ============ SKILLS SECTION ============
      sections.push(
        new Paragraph({
          text: 'TECHNICAL SKILLS',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
          thematicBreak: true
        })
      );

      Object.entries(skills).forEach(([category, skillList], index) => {
        const skillsStr = Array.isArray(skillList) ? skillList.join(', ') : skillList;
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${category}: `, bold: true }),
              new TextRun({ text: skillsStr })
            ],
            bullet: { level: 0 },
            spacing: { after: index < Object.keys(skills).length - 1 ? 50 : 200 }
          })
        );
      });

      // ============ CERTIFICATIONS SECTION ============
      if (certifications && certifications.length > 0) {
        sections.push(
          new Paragraph({
            text: 'CERTIFICATIONS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            thematicBreak: true
          })
        );

        certifications.forEach((cert, index) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: cert.name, bold: true }),
                new TextRun({ text: ` | ${cert.issuer} | ${cert.date}` })
              ],
              bullet: { level: 0 },
              spacing: { after: index < certifications.length - 1 ? 50 : 200 }
            })
          );
        });
      }

      // ============ ACHIEVEMENTS SECTION ============
      if (achievements && achievements.length > 0) {
        sections.push(
          new Paragraph({
            text: 'ACHIEVEMENTS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            thematicBreak: true
          })
        );

        achievements.forEach((achievement, index) => {
          sections.push(
            new Paragraph({
              text: achievement,
              bullet: { level: 0 },
              spacing: { after: index < achievements.length - 1 ? 50 : 100 }
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
      const filename = SanitizerUtils.sanitizeFilename(`resume_${userId}_${timestamp}.docx`);
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
