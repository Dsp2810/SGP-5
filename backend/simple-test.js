/**
 * Simple Resume Template Test
 * Tests if the LaTeX and DOCX templates work with sample data
 */

const path = require('path');
const fs = require('fs');

// Simple test data
const testData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe"
  },
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      startDate: "2018",
      endDate: "2022",
      cgpa: "3.8/4.0"
    }
  ],
  experience: [
    {
      position: "Software Engineer",
      company: "Google",
      startDate: "Jun 2022",
      endDate: "Present",
      responsibilities: [
        "Developed scalable microservices",
        "Improved system performance by 40%"
      ]
    }
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      description: "Built a full-stack e-commerce application",
      technologies: ["React", "Node.js", "MongoDB"],
      link: "https://github.com/john/ecommerce"
    }
  ],
  skills: {
    "Languages": ["JavaScript", "Python", "Java"],
    "Frameworks": ["React", "Express", "Django"]
  },
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon",
      date: "2023"
    }
  ],
  achievements: [
    "Won Best Innovation Award 2023"
  ]
};

console.log('🧪 Simple Template Test\n');
console.log('='.repeat(60));

async function test() {
  try {
    // Test 1: LaTeX Template
    console.log('\n📝 Test 1: LaTeX Template Generation');
    const { generateLatexResume } = require('./src/templates/resume.template');
    const latexContent = generateLatexResume(testData);
    
    console.log('✅ LaTeX template generated successfully');
    console.log(`   - Length: ${latexContent.length} characters`);
    console.log(`   - Has name: ${latexContent.includes(testData.personalInfo.name)}`);
    console.log(`   - Has sections: ${latexContent.includes('EDUCATION')}`);
    
    // Save for inspection
    const generatedDir = path.join(__dirname, 'generated');
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }
    
    const latexPath = path.join(generatedDir, 'test-output.tex');
    fs.writeFileSync(latexPath, latexContent);
    console.log(`   - Saved to: ${latexPath}`);
    console.log(`   - You can open this file to see the LaTeX output`);
    
    // Show snippet
    console.log('\n   📄 LaTeX Header Preview:');
    const lines = latexContent.split('\n');
    lines.slice(0, 5).forEach(line => console.log(`      ${line}`));
    console.log('      ...');
    
    // Test 2: DOCX Generation (if service exists)
    console.log('\n📝 Test 2: DOCX Generation');
    try {
      const resumeService = require('./src/services/resumeGeneratorService');
      const result = await resumeService.generateDOCX(testData, 'test-user');
      
      console.log('✅ DOCX generated successfully!');
      console.log(`   - Filename: ${result.filename}`);
      console.log(`   - Path: ${result.filepath}`);
      
      if (fs.existsSync(result.filepath)) {
        const stats = fs.statSync(result.filepath);
        console.log(`   - Size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`   - Open this file in Microsoft Word to view`);
      }
    } catch (error) {
      console.log('⚠️  DOCX generation failed:', error.message);
    }
    
    // Test 3: PDF Generation (if LaTeX installed)
    console.log('\n📝 Test 3: PDF Generation');
    try {
      const resumeService = require('./src/services/resumeGeneratorService');
      const result = await resumeService.generatePDF(testData, 'test-user');
      
      console.log('✅ PDF generated successfully!');
      console.log(`   - Filename: ${result.filename}`);
      console.log(`   - Path: ${result.filepath}`);
      
      if (fs.existsSync(result.filepath)) {
        const stats = fs.statSync(result.filepath);
        console.log(`   - Size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`   - Open this file in PDF viewer to view`);
      }
    } catch (error) {
      console.log('⚠️  PDF generation failed:', error.message);
      if (error.message.includes('LaTeX') || error.message.includes('pdflatex')) {
        console.log('   💡 Install MiKTeX to enable PDF generation');
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Template test complete!\n');
    console.log('📂 Check the generated/ folder for output files\n');
    console.log('Next steps:');
    console.log('  1. Open generated/test-output.tex to see LaTeX source');
    console.log('  2. Open any .docx files in Microsoft Word');
    console.log('  3. Open any .pdf files in a PDF viewer');
    console.log('  4. Verify the content matches your test data\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nStack trace:', error.stack);
  }
}

test();
