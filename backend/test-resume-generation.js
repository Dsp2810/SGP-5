/**
 * Test Resume Generation
 * Standalone script to test if resume generation is working
 * Run: node test-resume-generation.js
 */

const path = require('path');
const fs = require('fs');

// Sample resume data for testing
const testResumeData = {
  personalInfo: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-234-567-8900",
    location: "Seattle, WA",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    github: "https://github.com/sarahjohnson"
  },
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Washington",
      startDate: "Sep 2018",
      endDate: "Jun 2022",
      cgpa: "3.9/4.0"
    }
  ],
  experience: [
    {
      position: "Full Stack Developer",
      company: "Amazon Web Services",
      startDate: "Jul 2022",
      endDate: "Present",
      responsibilities: [
        "Developed RESTful APIs using Node.js serving 1M+ requests",
        "Implemented React dashboard reducing support queries by 30%",
        "Optimized database queries improving performance by 45%"
      ]
    }
  ],
  projects: [
    {
      title: "E-Commerce Marketplace",
      description: "Full-stack marketplace with payment integration and real-time chat",
      technologies: ["React", "Node.js", "MongoDB", "Redis", "Stripe"],
      link: "https://github.com/sarah/ecommerce"
    },
    {
      title: "AI Resume Analyzer",
      description: "ML application analyzing resumes for ATS compatibility",
      technologies: ["Python", "Flask", "TensorFlow", "React"]
    }
  ],
  skills: {
    "Languages": ["JavaScript", "Python", "Java", "TypeScript"],
    "Frontend": ["React", "Vue.js", "HTML5", "CSS3"],
    "Backend": ["Node.js", "Express", "Django", "Flask"],
    "Databases": ["MongoDB", "PostgreSQL", "Redis"]
  },
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "Jan 2023"
    }
  ],
  achievements: [
    "Won 1st place in AWS Hackathon 2023",
    "Published article on Medium with 5K+ views"
  ]
};

console.log('🧪 Resume Generation Test\n');
console.log('=' .repeat(60));

async function testResumeGeneration() {
  try {
    // Import required modules
    console.log('\n📦 Loading modules...');
    const ResumeValidator = require('./src/utils/resumeValidator');
    const resumeGeneratorService = require('./src/services/resumeGeneratorService');
    
    console.log('✅ Modules loaded successfully\n');

    // Step 1: Validate data
    console.log('🔍 Step 1: Validating resume data...');
    const validation = ResumeValidator.validate(testResumeData);
    
    if (!validation.valid) {
      console.log('❌ Validation failed:');
      validation.errors.forEach(err => console.log(`   - ${err}`));
      process.exit(1);
    }
    
    console.log('✅ Data validation passed');
    console.log(`   - Personal Info: ${validation.sanitizedData.personalInfo.name}`);
    console.log(`   - Education entries: ${validation.sanitizedData.education.length}`);
    console.log(`   - Experience entries: ${validation.sanitizedData.experience.length}`);
    console.log(`   - Projects: ${validation.sanitizedData.projects.length}`);
    console.log(`   - Skill categories: ${Object.keys(validation.sanitizedData.skills).length}`);
    
    const sanitizedData = validation.sanitizedData;

    // Step 2: Generate PDF
    console.log('\n📄 Step 2: Generating PDF resume...');
    try {
      const pdfResult = await resumeGeneratorService.generatePDF(sanitizedData, 'test-user-123');
      console.log('✅ PDF generated successfully!');
      console.log(`   - Filename: ${pdfResult.filename}`);
      console.log(`   - Path: ${pdfResult.filepath}`);
      console.log(`   - Download URL: ${pdfResult.url}`);
      
      // Check if file exists
      if (fs.existsSync(pdfResult.filepath)) {
        const stats = fs.statSync(pdfResult.filepath);
        console.log(`   - File size: ${(stats.size / 1024).toFixed(2)} KB`);
      }
    } catch (error) {
      console.log('❌ PDF generation failed:', error.message);
      if (error.message.includes('LaTeX')) {
        console.log('   💡 Tip: Install LaTeX (MiKTeX) for PDF generation');
        console.log('   You can still test DOCX generation below');
      }
    }

    // Step 3: Generate DOCX
    console.log('\n📄 Step 3: Generating DOCX resume...');
    try {
      const docxResult = await resumeGeneratorService.generateDOCX(sanitizedData, 'test-user-123');
      console.log('✅ DOCX generated successfully!');
      console.log(`   - Filename: ${docxResult.filename}`);
      console.log(`   - Path: ${docxResult.filepath}`);
      console.log(`   - Download URL: ${docxResult.url}`);
      
      // Check if file exists
      if (fs.existsSync(docxResult.filepath)) {
        const stats = fs.statSync(docxResult.filepath);
        console.log(`   - File size: ${(stats.size / 1024).toFixed(2)} KB`);
      }
    } catch (error) {
      console.log('❌ DOCX generation failed:', error.message);
    }

    // Step 4: Test LaTeX template generation
    console.log('\n📝 Step 4: Testing LaTeX template...');
    try {
      const { generateLatexResume } = require('./src/templates/resume.template');
      const SanitizerUtils = require('./src/utils/sanitizer');
      
      const latexData = SanitizerUtils.sanitizeForLaTeX(sanitizedData);
      const latexContent = generateLatexResume(latexData);
      
      console.log('✅ LaTeX template generated');
      console.log(`   - Content length: ${latexContent.length} characters`);
      console.log(`   - Contains name: ${latexContent.includes(sanitizedData.personalInfo.name) ? 'Yes' : 'No'}`);
      console.log(`   - Contains sections: ${latexContent.includes('EDUCATION') && latexContent.includes('PROJECTS') ? 'Yes' : 'No'}`);
      
      // Save LaTeX for inspection
      const latexPath = path.join(__dirname, 'generated', 'test-resume.tex');
      fs.writeFileSync(latexPath, latexContent);
      console.log(`   - Saved to: ${latexPath}`);
    } catch (error) {
      console.log('❌ LaTeX template generation failed:', error.message);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Test completed! Check the generated/ folder for output files.\n');
    console.log('📂 Generated files location: backend/generated/\n');
    console.log('💡 Next steps:');
    console.log('   1. Check generated PDF/DOCX files');
    console.log('   2. Verify the formatting and content');
    console.log('   3. Start the server: npm run dev');
    console.log('   4. Test via API with Postman\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testResumeGeneration();
