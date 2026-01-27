/**
 * Test PDF Generation
 * Tests the complete pipeline: Data → LaTeX → PDF
 */

const resumeService = require('./src/services/resumeGeneratorService');

// Sample resume data
const testData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-234-567-8900",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe"
  },
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      startDate: "Sep 2018",
      endDate: "May 2022",
      cgpa: "3.9/4.0"
    }
  ],
  experience: [
    {
      position: "Software Engineer",
      company: "Google",
      startDate: "Jun 2022",
      endDate: "Present",
      responsibilities: [
        "Developed scalable microservices using Node.js and Python",
        "Improved system performance by 40% through optimization",
        "Led team of 3 engineers on critical infrastructure projects"
      ]
    }
  ],
  projects: [
    {
      title: "E-commerce Platform",
      description: "Full-stack web application with 10,000+ active users",
      technologies: ["React", "Node.js", "MongoDB", "AWS"],
      link: "https://github.com/johndoe/ecommerce"
    }
  ],
  skills: {
    "Programming Languages": ["JavaScript", "Python", "Java", "C++"],
    "Frameworks": ["React", "Node.js", "Django", "Spring Boot"],
    "Tools": ["Git", "Docker", "Kubernetes", "AWS"]
  },
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "Mar 2023"
    }
  ],
  achievements: [
    "Won 1st place in University Hackathon 2021",
    "Published research paper on Machine Learning at IEEE Conference"
  ]
};

async function testPDFGeneration() {
  console.log('🔄 Testing PDF Generation...\n');

  try {
    const userId = 'test-user-123';

    console.log('📄 Generating PDF...');
    const result = await resumeService.generatePDF(testData, userId);

    console.log('\n✅ PDF Generation Successful!');
    console.log('📁 File Path:', result.filepath);
    console.log('🔗 Download URL:', result.url);

    // Check if file exists
    const fs = require('fs');
    if (fs.existsSync(result.filepath)) {
      const stats = fs.statSync(result.filepath);
      console.log('📊 File Size:', (stats.size / 1024).toFixed(2), 'KB');
    }

  } catch (error) {
    console.error('\n❌ PDF Generation Failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('pdflatex')) {
      console.log('\n⚠️  LaTeX is not installed!');
      console.log('📥 Please install MiKTeX from: https://miktex.org/download');
      console.log('   After installation, restart your terminal and try again.');
    }
  }
}

async function testDOCXGeneration() {
  console.log('\n🔄 Testing DOCX Generation...\n');

  try {
    const userId = 'test-user-123';

    console.log('📄 Generating DOCX...');
    const result = await resumeService.generateDOCX(testData, userId);

    console.log('\n✅ DOCX Generation Successful!');
    console.log('📁 File Path:', result.filepath);
    console.log('🔗 Download URL:', result.url);

    // Check if file exists
    const fs = require('fs');
    if (fs.existsSync(result.filepath)) {
      const stats = fs.statSync(result.filepath);
      console.log('📊 File Size:', (stats.size / 1024).toFixed(2), 'KB');
    }

  } catch (error) {
    console.error('\n❌ DOCX Generation Failed!');
    console.error('Error:', error.message);
  }
}

// Run tests
(async () => {
  await testPDFGeneration();
  await testDOCXGeneration();
})();
