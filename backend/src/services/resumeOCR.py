#!/usr/bin/env python3
"""
Resume OCR and Parser using Surya OCR
Extracts text from resume images/PDFs and structures the data for portfolio generation
"""

import sys
import json
import re
from pathlib import Path
from PIL import Image
import pypdfium2 as pdfium
from surya.detection import DetectionPredictor
from surya.recognition import RecognitionPredictor

# Load Surya models (cached after first load)
det_predictor = DetectionPredictor()
rec_predictor = RecognitionPredictor()

def extract_text_from_pdf(pdf_path):
    """
    Extract text from PDF using Surya OCR
    """
    try:
        # Convert PDF to images
        pdf = pdfium.PdfDocument(pdf_path)
        images = []
        
        for page_num in range(len(pdf)):
            page = pdf[page_num]
            pil_image = page.render(scale=2).to_pil()
            images.append(pil_image)
        
        # Run OCR on all pages (langs=None means auto-detect)
        langs = [None] * len(images)
        predictions = rec_predictor(images, langs, det_predictor=det_predictor)
        
        # Combine text from all pages
        full_text = ""
        for pred in predictions:
            for text_line in pred.text_lines:
                full_text += text_line.text + "\n"
        
        return full_text.strip()
    
    except Exception as e:
        raise Exception(f"OCR extraction failed: {str(e)}")

def extract_text_from_image(image_path):
    """
    Extract text from image using Surya OCR
    """
    try:
        # Load image
        image = Image.open(image_path)
        
        # Run OCR
        predictions = rec_predictor([image], [None], det_predictor=det_predictor)
        
        # Extract text
        full_text = ""
        for text_line in predictions[0].text_lines:
            full_text += text_line.text + "\n"
        
        return full_text.strip()
    
    except Exception as e:
        raise Exception(f"OCR extraction failed: {str(e)}")

def parse_resume_data(text):
    """
    Parse extracted text to find structured data matching resume template format
    """
    data = {
        "personalInfo": {
            "name": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "github": "",
            "website": ""
        },
        "education": [],
        "experience": [],
        "projects": [],
        "skills": {},
        "certifications": [],
        "achievements": []
    }
    
    lines = text.split('\n')
    
    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    if emails:
        data["personalInfo"]["email"] = emails[0]
    
    # Extract phone (improved pattern)
    phone_pattern = r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\.•]?[(]?[0-9]{1,4}[)]?[-\s\.•]?[0-9]{1,4}[-\s\.•X]*[0-9X]{1,9}'
    phones = re.findall(phone_pattern, text)
    if phones:
        # Clean up the phone number
        phone = phones[0].strip().replace('•', '-')
        data["personalInfo"]["phone"] = phone
    
    # Extract LinkedIn (full URL or placeholder)
    linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+'
    linkedin = re.findall(linkedin_pattern, text, re.IGNORECASE)
    if linkedin:
        data["personalInfo"]["linkedin"] = linkedin[0]
    elif re.search(r'\bLinkedIn\b', text, re.IGNORECASE):
        # Found "LinkedIn" text in header - use placeholder
        data["personalInfo"]["linkedin"] = "LinkedIn"
    
    # Extract GitHub (full URL or placeholder)
    github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[\w-]+'
    github = re.findall(github_pattern, text, re.IGNORECASE)
    if github:
        data["personalInfo"]["github"] = github[0]
    elif re.search(r'\bGitHub\b', text, re.IGNORECASE):
        # Found "GitHub" text in header - use placeholder
        data["personalInfo"]["github"] = "GitHub"
    
    # Extract portfolio/website
    portfolio_pattern = r'(?:https?://)?(?:www\.)?[\w-]+\.(?:com|io|dev|net|org)/?[\w-]*'
    portfolios = re.findall(portfolio_pattern, text, re.IGNORECASE)
    # Filter out LinkedIn and GitHub
    portfolios = [p for p in portfolios if 'linkedin' not in p.lower() and 'github' not in p.lower()]
    if portfolios:
        data["personalInfo"]["website"] = portfolios[0]
    
    # Extract name (usually first non-empty line)
    for line in lines:
        clean_line = line.strip()
        if clean_line and len(clean_line.split()) <= 4 and not any(char.isdigit() for char in clean_line):
            # Check if it's not an email or URL
            if '@' not in clean_line and 'http' not in clean_line.lower():
                data["personalInfo"]["name"] = clean_line
                break
    
    # Extract location (look for city/state or city/country patterns)
    # Try US format first: "City, ST"
    location_pattern_us = r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}\b'
    locations = re.findall(location_pattern_us, text)
    if locations:
        data["personalInfo"]["location"] = locations[0]
    else:
        # Try international format: "City, Country" or "State, Country"
        location_pattern_intl = r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s+[A-Z][a-z]+\b'
        locations = re.findall(location_pattern_intl, text)
        if locations:
            data["personalInfo"]["location"] = locations[0]
    
    # Look for sections
    text_lower = text.lower()
    
    # Extract skills section - organize into categories
    if 'skill' in text_lower:
        skills_idx = text_lower.find('skill')
        skills_section = text[skills_idx:skills_idx+800]
        
        # Try to identify categories
        category_keywords = {
            "Languages": ["python", "javascript", "java", "c++", "c#", "ruby", "go", "rust", "php", "typescript"],
            "Frameworks": ["react", "angular", "vue", "django", "flask", "spring", "express", "next.js", "node.js"],
            "Tools": ["git", "docker", "kubernetes", "jenkins", "aws", "azure", "gcp", "mongodb", "postgresql"],
            "Web Technologies": ["html", "css", "sass", "tailwind", "bootstrap"]
        }
        
        # Extract all skill-like words
        skill_words = re.findall(r'\b[A-Z][a-z]+(?:\.[a-z]+)?(?:\s+[A-Z][a-z]+)*\b|[A-Z]{2,}|\b[a-z]+\.js\b', skills_section)
        skill_words_lower = [s.lower() for s in skill_words]
        
        # Categorize skills
        categorized = {cat: [] for cat in category_keywords}
        uncategorized = []
        
        for skill in skill_words[:20]:  # Limit to 20 skills
            skill_lower = skill.lower()
            categorized_flag = False
            for category, keywords in category_keywords.items():
                if any(kw in skill_lower for kw in keywords):
                    if skill not in categorized[category]:
                        categorized[category].append(skill)
                    categorized_flag = True
                    break
            if not categorized_flag and skill not in uncategorized:
                uncategorized.append(skill)
        
        # Add non-empty categories
        for category, skills_list in categorized.items():
            if skills_list:
                data["skills"][category] = skills_list
        
        # Add uncategorized as "Technical Skills" if any
        if uncategorized:
            data["skills"]["Technical Skills"] = uncategorized[:10]
        
        # If no categorization worked, just add all as one category
        if not data["skills"] and skill_words:
            data["skills"]["Technical Skills"] = list(set(skill_words[:15]))
    
    # Extract education section with more details
    if 'education' in text_lower:
        edu_idx = text_lower.find('education')
        edu_section = text[edu_idx:edu_idx+1000]
        
        # Look for degree patterns with more context
        lines_in_edu = edu_section.split('\n')
        current_edu = {}
        
        for line in lines_in_edu[:30]:
            clean = line.strip()
            if not clean:
                continue
                
            # Check for degree
            if any(deg in clean.lower() for deg in ['bachelor', 'master', 'b.tech', 'b.e', 'm.tech', 'm.e', 'phd', 'diploma']):
                if current_edu:  # Save previous education
                    data["education"].append(current_edu)
                current_edu = {
                    "degree": clean,
                    "specialization": "",
                    "institution": "",
                    "endDate": "",
                    "cgpa": ""
                }
            # Check for CGPA/GPA
            elif current_edu and ('gpa' in clean.lower() or 'cgpa' in clean.lower()):
                gpa_match = re.search(r'(\d+\.?\d*)', clean)
                if gpa_match:
                    current_edu["cgpa"] = gpa_match.group(1)
            # Check for year
            elif current_edu and re.search(r'\b(19|20)\d{2}\b', clean):
                year_match = re.search(r'\b(19|20)\d{2}\b', clean)
                if year_match:
                    current_edu["endDate"] = year_match.group(0)
            # Likely institution name
            elif current_edu and not current_edu["institution"] and len(clean) > 10:
                current_edu["institution"] = clean
        
        # Add the last education entry
        if current_edu:
            data["education"].append(current_edu)
    
    # Extract experience section with responsibilities
    if 'experience' in text_lower or 'work' in text_lower:
        exp_idx = max(
            text_lower.find('experience') if 'experience' in text_lower else -1,
            text_lower.find('work history') if 'work history' in text_lower else -1
        )
        if exp_idx != -1:
            exp_section = text[exp_idx:exp_idx+2000]
            lines_in_exp = exp_section.split('\n')
            
            current_exp = {}
            responsibilities = []
            
            for i, line in enumerate(lines_in_exp[:50]):
                clean = line.strip()
                if not clean or clean.lower() == 'experience':
                    continue
                
                # Check for date ranges (indicates new position)
                date_pattern = r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})(?:[\s,]+\d{4})?[^\n]{0,40}(?:[–—-]|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|\d{4})\b'
                if re.search(date_pattern, clean, re.IGNORECASE):
                    # Save previous experience
                    if current_exp and current_exp.get("position"):
                        current_exp["responsibilities"] = responsibilities
                        data["experience"].append(current_exp)
                        responsibilities = []
                    
                    # Start new experience
                    date_match = re.search(date_pattern, clean, re.IGNORECASE)
                    current_exp = {
                        "position": "",
                        "company": "",
                        "location": "",
                        "startDate": date_match.group(1) if date_match else "",
                        "endDate": date_match.group(2) if date_match else "",
                        "responsibilities": []
                    }
                    # Position is often on previous line or before dates
                    position_text = clean[:clean.find(date_match.group(0))] if date_match else clean
                    if position_text.strip():
                        current_exp["position"] = position_text.strip()
                    elif i > 0:  # Check previous line for position
                        prev_line = lines_in_exp[i-1].strip()
                        if prev_line and len(prev_line) < 100:
                            current_exp["position"] = prev_line
                
                # Check for company name (often after em dash, bullet, or "at" keyword)
                elif current_exp and not current_exp["company"]:
                    # Check if line has both company and location separated by bullet
                    if '•' in clean and len(clean.split('•')) >= 2:
                        parts = clean.split('•')
                        current_exp["company"] = parts[0].strip()
                        if len(parts) > 1:
                            current_exp["location"] = parts[1].strip()
                    elif '—' in clean or '@' in clean:
                        company_text = clean.split('—')[-1] if '—' in clean else clean.split('@')[-1]
                        current_exp["company"] = company_text.strip()
                    elif not current_exp["position"] and len(clean) < 100:
                        # This might be company name if position is already set
                        current_exp["company"] = clean
                
                # Check for bullet points (responsibilities) - support multiple bullet styles
                elif current_exp and (clean.startswith('●') or clean.startswith('•') or clean.startswith('-') or clean.startswith('*') or clean.startswith('○')):
                    resp = clean[1:].strip()
                    if len(resp) > 10:
                        responsibilities.append(resp)
                
                # Position title (if not set and looks like a title)
                elif current_exp and not current_exp["position"] and len(clean) > 5 and len(clean) < 100:
                    if not any(char.isdigit() for char in clean[:10]):  # Titles usually don't start with numbers
                        current_exp["position"] = clean
                
                # Regular text might be responsibility
                elif current_exp and len(clean) > 20 and len(responsibilities) < 5:
                    responsibilities.append(clean)
            
            # Add the last experience
            if current_exp:
                current_exp["responsibilities"] = responsibilities
                data["experience"].append(current_exp)
    
    # Extract projects section with technologies
    if 'project' in text_lower:
        proj_idx = text_lower.find('project')
        proj_section = text[proj_idx:proj_idx+2500]
        lines_in_proj = proj_section.split('\n')
        
        current_project = {}
        
        for i, line in enumerate(lines_in_proj[:60]):
            clean = line.strip()
            if not clean or clean.lower() == 'projects':
                continue
            
            # Check for URL (project link) - including [View Project] patterns
            url_pattern = r'https?://[\w\-\./]+'
            url_match = re.search(url_pattern, clean)
            view_link_pattern = r'\[View Project\]|\[GitHub\]|\[Demo\]|\[Link\]'
            has_link_indicator = re.search(view_link_pattern, clean, re.IGNORECASE)
            
            # New project title - look for standalone lines or lines ending with [View Project]
            is_likely_title = (
                len(clean) > 10 and len(clean) < 150 and
                not clean.startswith('•') and
                not clean.startswith('-') and
                not clean.lower().startswith('tech') and
                (has_link_indicator or (not url_match and not any(sep in clean for sep in [':', '—'])))
            )
            
            if is_likely_title:
                # Save previous project
                if current_project and current_project.get("title"):
                    data["projects"].append(current_project)
                
                # Extract title (remove [View Project] if present)
                title = re.sub(r'\s*\[.*?\]\s*$', '', clean).strip()
                current_project = {
                    "title": title,
                    "description": "",
                    "technologies": [],
                    "link": ""
                }
            # Project link
            elif current_project and url_match:
                current_project["link"] = url_match.group(0)
            # Technologies line (starts with "Technologies:" or similar)
            elif current_project and re.match(r'^(?:Technologies?|Tech Stack|Built with):', clean, re.IGNORECASE):
                # Extract technologies after the colon
                tech_text = re.sub(r'^(?:Technologies?|Tech Stack|Built with):\s*', '', clean, flags=re.IGNORECASE)
                tech_list = [t.strip() for t in re.split(r'[,;]', tech_text) if t.strip()]
                current_project["technologies"] = tech_list[:10]
            # Description (multi-line support)
            elif current_project and len(clean) > 20:
                if not current_project["description"]:
                    current_project["description"] = clean
                else:
                    # Append to description if it's continuation
                    current_project["description"] += " " + clean
                    
            if len(data["projects"]) >= 8:
                break
        
        # Add last project
        if current_project and current_project.get("title"):
            data["projects"].append(current_project)
    
    # Extract certifications
    if 'certification' in text_lower or 'certificate' in text_lower:
        cert_idx = max(
            text_lower.find('certification') if 'certification' in text_lower else -1,
            text_lower.find('certificate') if 'certificate' in text_lower else -1
        )
        if cert_idx != -1:
            cert_section = text[cert_idx:cert_idx+800]
            lines_in_cert = cert_section.split('\n')
            
            for line in lines_in_cert[:15]:
                clean = line.strip()
                if clean and len(clean) > 10 and not clean.lower().startswith('certif'):
                    # Extract date if present
                    date_match = re.search(r'\b(19|20)\d{2}\b', clean)
                    cert_date = date_match.group(0) if date_match else ""
                    
                    # Extract issuer (often after hyphen or comma)
                    issuer = ""
                    name = clean
                    if '—' in clean or '-' in clean:
                        parts = clean.split('—' if '—' in clean else '-')
                        name = parts[0].strip()
                        if len(parts) > 1:
                            issuer = parts[1].strip()
                    
                    data["certifications"].append({
                        "name": name,
                        "issuer": issuer,
                        "date": cert_date
                    })
                    
                    if len(data["certifications"]) >= 5:
                        break
    
    # Extract achievements
    achievement_keywords = ['achievement', 'award', 'honor', 'recognition']
    for keyword in achievement_keywords:
        if keyword in text_lower:
            ach_idx = text_lower.find(keyword)
            ach_section = text[ach_idx:ach_idx+600]
            lines_in_ach = ach_section.split('\n')
            
            for line in lines_in_ach[:10]:
                clean = line.strip()
                if clean and len(clean) > 15 and not any(kw in clean.lower() for kw in achievement_keywords):
                    # Check for bullet points
                    if clean.startswith('•') or clean.startswith('-') or clean.startswith('*'):
                        clean = clean[1:].strip()
                    data["achievements"].append(clean)
                    
                    if len(data["achievements"]) >= 5:
                        break
            break
    
    return data

def process_resume(file_path):
    """
    Main function to process resume file
    """
    try:
        file_path = Path(file_path)
        
        if not file_path.exists():
            return {
                "success": False,
                "error": "File not found"
            }
        
        # Determine file type and extract text
        if file_path.suffix.lower() == '.pdf':
            text = extract_text_from_pdf(str(file_path))
        elif file_path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
            text = extract_text_from_image(str(file_path))
        else:
            return {
                "success": False,
                "error": "Unsupported file type. Please use PDF or image files."
            }
        
        # Parse the extracted text
        data = parse_resume_data(text)
        
        return {
            "success": True,
            "data": data,
            "raw_text": text,
            "message": "Resume processed successfully"
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to process resume"
        }

if __name__ == "__main__":
    # Read file path from command line
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "File path is required"
        }))
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    # Process the resume
    result = process_resume(file_path)
    
    # Output as JSON
    print(json.dumps(result, indent=2))
