#!/usr/bin/env python3
"""
ATS Resume Scorer using spaCy
Analyzes resume against job description and provides detailed scoring
"""

import sys
import json
import spacy
from collections import Counter
import re

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print(json.dumps({"error": "spaCy model not found. Run: python -m spacy download en_core_web_sm"}))
    sys.exit(1)

# Comprehensive skill database
SKILLS = [
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "php", "ruby",
    "go", "rust", "kotlin", "swift", "scala", "r", "matlab", "perl",
    
    # Web Technologies
    "html", "css", "react", "angular", "vue", "node.js", "express",
    "django", "flask", "fastapi", "spring boot", "asp.net", "laravel",
    "next.js", "nuxt.js", "gatsby", "jquery", "bootstrap", "tailwind",
    
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "cassandra",
    "elasticsearch", "dynamodb", "oracle", "sql server", "sqlite",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab",
    "github actions", "terraform", "ansible", "ci/cd", "linux",
    
    # Data Science & AI
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    "data analysis", "data science", "neural networks", "ai",
    
    # Other Skills
    "git", "agile", "scrum", "rest api", "graphql", "microservices",
    "websockets", "oauth", "jwt", "testing", "unit testing",
    "selenium", "jest", "pytest", "jira", "figma", "ui/ux"
]

# Important sections for ATS
SECTION_KEYWORDS = {
    "experience": ["experience", "work history", "employment", "professional experience"],
    "education": ["education", "academic", "qualification", "degree"],
    "skills": ["skills", "technical skills", "expertise", "competencies"],
    "projects": ["projects", "portfolio", "work samples"],
    "certifications": ["certifications", "certificates", "licenses"]
}


def preprocess(text):
    """Clean and tokenize text using spaCy"""
    doc = nlp(text.lower())
    tokens = [
        token.lemma_
        for token in doc
        if not token.is_stop and token.is_alpha and len(token.text) > 2
    ]
    return tokens


def extract_skills(text):
    """Extract skills from text based on skill database"""
    found = []
    text_lower = text.lower()
    
    for skill in SKILLS:
        # Use word boundaries to avoid partial matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)
    
    return set(found)


def extract_email(text):
    """Extract email from text"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    return emails[0] if emails else None


def extract_phone(text):
    """Extract phone number from text"""
    phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
    phones = re.findall(phone_pattern, text)
    return phones[0] if phones else None


def detect_sections(text):
    """Detect presence of important resume sections"""
    detected = {}
    text_lower = text.lower()
    
    for section, keywords in SECTION_KEYWORDS.items():
        detected[section] = any(keyword in text_lower for keyword in keywords)
    
    return detected


def calculate_format_score(resume_text):
    """Calculate format and structure score"""
    score = 0
    
    # Check for contact information
    if extract_email(resume_text):
        score += 20
    if extract_phone(resume_text):
        score += 10
    
    # Check for important sections
    sections = detect_sections(resume_text)
    score += sum(20 for section, present in sections.items() if present and section in ["experience", "skills"])
    score += sum(10 for section, present in sections.items() if present and section not in ["experience", "skills"])
    
    return min(score, 100)


def skill_match_score(resume_skills, jd_skills):
    """Calculate skill matching score"""
    if not jd_skills:
        return 100, set(), jd_skills  # No JD provided, return perfect score
    
    matched = resume_skills.intersection(jd_skills)
    missing = jd_skills - resume_skills
    score = (len(matched) / len(jd_skills)) * 100 if jd_skills else 0
    
    return round(score, 2), matched, missing


def keyword_score(resume_tokens, jd_tokens):
    """Calculate keyword frequency match"""
    if not jd_tokens:
        return 100  # No JD provided
    
    resume_freq = Counter(resume_tokens)
    jd_freq = Counter(jd_tokens)

    common = set(resume_freq) & set(jd_freq)
    score = sum(min(resume_freq[k], jd_freq[k]) for k in common)
    total = sum(jd_freq.values())

    return round((score / total) * 100, 2) if total > 0 else 0


def calculate_readability_score(text):
    """Calculate readability score based on text structure"""
    score = 100
    
    # Check word count (ideal: 400-800 words)
    word_count = len(text.split())
    if word_count < 300:
        score -= 20
    elif word_count > 1000:
        score -= 10
    
    # Check for bullet points
    bullet_count = text.count('•') + text.count('*') + text.count('-')
    if bullet_count < 5:
        score -= 10
    
    # Check for proper capitalization
    sentences = text.split('.')
    capitalized = sum(1 for s in sentences if s.strip() and s.strip()[0].isupper())
    if len(sentences) > 0 and capitalized / len(sentences) < 0.5:
        score -= 10
    
    return max(score, 0)


def calculate_experience_score(resume_text, jd_text):
    """Calculate experience relevance score"""
    resume_tokens = set(preprocess(resume_text))
    jd_tokens = set(preprocess(jd_text)) if jd_text else set()
    
    if not jd_tokens:
        return 85  # Default good score if no JD
    
    # Calculate overlap
    common = resume_tokens & jd_tokens
    score = (len(common) / len(jd_tokens)) * 100 if jd_tokens else 85
    
    return min(round(score, 2), 100)


def generate_suggestions(matched_skills, missing_skills, sections, format_score, keyword_match):
    """Generate improvement suggestions"""
    suggestions = []
    
    if missing_skills:
        suggestions.append(f"Add these {len(missing_skills)} missing skills: {', '.join(list(missing_skills)[:5])}")
    
    if not sections.get('skills'):
        suggestions.append("Add a dedicated 'Skills' section to improve ATS parsing")
    
    if not sections.get('experience'):
        suggestions.append("Add a clear 'Experience' or 'Work History' section")
    
    if format_score < 80:
        suggestions.append("Include complete contact information (email and phone)")
    
    if keyword_match < 60:
        suggestions.append("Use more keywords from the job description throughout your resume")
    
    if len(suggestions) == 0:
        suggestions.append("Your resume is well-optimized! Consider adding quantifiable achievements")
    
    return suggestions


def generate_strengths(matched_skills, sections, format_score):
    """Generate resume strengths"""
    strengths = []
    
    if len(matched_skills) > 5:
        strengths.append(f"Strong technical skills match ({len(matched_skills)} relevant skills)")
    
    if sections.get('skills') and sections.get('experience'):
        strengths.append("Well-structured with clear sections")
    
    if format_score >= 90:
        strengths.append("Complete contact information and ATS-friendly format")
    
    if sections.get('certifications'):
        strengths.append("Includes certifications which add credibility")
    
    if len(strengths) == 0:
        strengths.append("Resume structure is adequate")
    
    return strengths


def calculate_ats_score(resume_text, job_description=""):
    """
    Main ATS scoring function
    Returns detailed analysis of resume
    """
    try:
        # Preprocess texts
        resume_tokens = preprocess(resume_text)
        jd_tokens = preprocess(job_description) if job_description else []
        
        # Extract skills
        resume_skills = extract_skills(resume_text)
        jd_skills = extract_skills(job_description) if job_description else set()
        
        # Calculate scores
        skill_score, matched_skills, missing_skills = skill_match_score(resume_skills, jd_skills)
        keyword_match = keyword_score(resume_tokens, jd_tokens)
        format_score = calculate_format_score(resume_text)
        readability = calculate_readability_score(resume_text)
        experience_score = calculate_experience_score(resume_text, job_description)
        
        # Detect sections
        sections = detect_sections(resume_text)
        education_score = 90 if sections.get('education') else 60
        
        # Calculate overall score (weighted average)
        overall_score = (
            skill_score * 0.30 +
            keyword_match * 0.20 +
            format_score * 0.20 +
            experience_score * 0.15 +
            education_score * 0.10 +
            readability * 0.05
        )
        
        # Generate suggestions and strengths
        suggestions = generate_suggestions(matched_skills, missing_skills, sections, format_score, keyword_match)
        strengths = generate_strengths(matched_skills, sections, format_score)
        
        # Determine status levels
        def get_status(score):
            if score >= 80:
                return "excellent"
            elif score >= 60:
                return "good"
            elif score >= 40:
                return "average"
            else:
                return "poor"
        
        # Build response
        result = {
            "success": True,
            "overallScore": round(overall_score, 0),
            "sections": [
                {"name": "Keywords Match", "score": round(keyword_match, 0), "status": get_status(keyword_match)},
                {"name": "Format & Structure", "score": round(format_score, 0), "status": get_status(format_score)},
                {"name": "Skills Alignment", "score": round(skill_score, 0), "status": get_status(skill_score)},
                {"name": "Experience Relevance", "score": round(experience_score, 0), "status": get_status(experience_score)},
                {"name": "Education Match", "score": education_score, "status": get_status(education_score)},
                {"name": "Readability", "score": round(readability, 0), "status": get_status(readability)}
            ],
            "matchedKeywords": sorted(list(matched_skills)),
            "missingKeywords": sorted(list(missing_skills))[:10],  # Limit to top 10
            "suggestions": suggestions[:6],  # Limit to 6 suggestions
            "strengths": strengths[:4]  # Limit to 4 strengths
        }
        
        return result
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


if __name__ == "__main__":
    # Read input from command line arguments
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Resume text is required"}))
        sys.exit(1)
    
    resume_text = sys.argv[1]
    job_description = sys.argv[2] if len(sys.argv) > 2 else ""
    
    # Calculate score
    result = calculate_ats_score(resume_text, job_description)
    
    # Output as JSON
    print(json.dumps(result, indent=2))
