/**
 * LaTeX and Data Sanitization Utilities
 * Escapes special characters for LaTeX compilation
 */

class SanitizerUtils {
  /**
   * Escape LaTeX special characters
   * @param {string} text - Text to sanitize
   * @returns {string} - Sanitized text safe for LaTeX
   */
  static escapeLaTeX(text) {
    if (!text || typeof text !== 'string') return '';

    // LaTeX special characters that need escaping
    const specialChars = {
      '&': '\\&',
      '%': '\\%',
      '$': '\\$',
      '#': '\\#',
      '_': '\\_',
      '{': '\\{',
      '}': '\\}',
      '~': '\\textasciitilde{}',
      '^': '\\textasciicircum{}',
      '\\': '\\textbackslash{}'
    };

    return text.replace(/[&%$#_{}~^\\]/g, (char) => specialChars[char] || char);
  }

  /**
   * Sanitize URL for LaTeX (encode special characters)
   * @param {string} url - URL to sanitize
   * @returns {string} - Sanitized URL
   */
  static sanitizeURL(url) {
    if (!url || typeof url !== 'string') return '';
    
    // URLs in LaTeX hyperref can handle most characters
    // but we escape % and # which are problematic
    return url.replace(/%/g, '\\%').replace(/#/g, '\\#');
  }

  /**
   * Sanitize complete resume data for LaTeX
   * @param {Object} data - Resume data object
   * @returns {Object} - Sanitized resume data
   */
  static sanitizeForLaTeX(data) {
    const sanitized = JSON.parse(JSON.stringify(data)); // Deep clone

    // Sanitize personal info
    if (sanitized.personalInfo) {
      sanitized.personalInfo.name = this.escapeLaTeX(sanitized.personalInfo.name);
      sanitized.personalInfo.email = sanitized.personalInfo.email; // Email is safe
      sanitized.personalInfo.phone = this.escapeLaTeX(sanitized.personalInfo.phone);
      sanitized.personalInfo.location = this.escapeLaTeX(sanitized.personalInfo.location);
      
      if (sanitized.personalInfo.linkedin) {
        sanitized.personalInfo.linkedin = this.sanitizeURL(sanitized.personalInfo.linkedin);
      }
      if (sanitized.personalInfo.github) {
        sanitized.personalInfo.github = this.sanitizeURL(sanitized.personalInfo.github);
      }
    }

    // Sanitize education
    if (Array.isArray(sanitized.education)) {
      sanitized.education = sanitized.education.map(edu => ({
        ...edu,
        degree: this.escapeLaTeX(edu.degree),
        institution: this.escapeLaTeX(edu.institution),
        startDate: this.escapeLaTeX(edu.startDate),
        endDate: this.escapeLaTeX(edu.endDate),
        cgpa: edu.cgpa ? this.escapeLaTeX(edu.cgpa) : ''
      }));
    }

    // Sanitize experience
    if (Array.isArray(sanitized.experience)) {
      sanitized.experience = sanitized.experience.map(exp => ({
        ...exp,
        position: this.escapeLaTeX(exp.position),
        company: this.escapeLaTeX(exp.company),
        startDate: this.escapeLaTeX(exp.startDate),
        endDate: this.escapeLaTeX(exp.endDate),
        responsibilities: exp.responsibilities.map(r => this.escapeLaTeX(r))
      }));
    }

    // Sanitize projects
    if (Array.isArray(sanitized.projects)) {
      sanitized.projects = sanitized.projects.map(proj => ({
        ...proj,
        title: this.escapeLaTeX(proj.title),
        description: this.escapeLaTeX(proj.description),
        technologies: proj.technologies.map(t => this.escapeLaTeX(t)),
        link: proj.link ? this.sanitizeURL(proj.link) : ''
      }));
    }

    // Sanitize skills
    if (sanitized.skills) {
      const sanitizedSkills = {};
      for (const [category, skillList] of Object.entries(sanitized.skills)) {
        const sanitizedCategory = this.escapeLaTeX(category);
        if (Array.isArray(skillList)) {
          sanitizedSkills[sanitizedCategory] = skillList.map(s => this.escapeLaTeX(s));
        } else {
          sanitizedSkills[sanitizedCategory] = this.escapeLaTeX(skillList);
        }
      }
      sanitized.skills = sanitizedSkills;
    }

    // Sanitize certifications
    if (Array.isArray(sanitized.certifications)) {
      sanitized.certifications = sanitized.certifications.map(cert => ({
        name: this.escapeLaTeX(cert.name),
        issuer: this.escapeLaTeX(cert.issuer),
        date: this.escapeLaTeX(cert.date)
      }));
    }

    // Sanitize achievements
    if (Array.isArray(sanitized.achievements)) {
      sanitized.achievements = sanitized.achievements.map(a => this.escapeLaTeX(a));
    }

    return sanitized;
  }

  /**
   * General text sanitization (basic HTML entity encoding)
   * @param {string} text - Text to sanitize
   * @returns {string} - Sanitized text
   */
  static sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    
    // Basic sanitization - remove dangerous characters and trim
    return text
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * URL-specific sanitization (preserves URL structure)
   * @param {string} url - URL to sanitize
   * @returns {string} - Sanitized URL
   */
  static sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    
    url = url.trim();
    
    // Remove any control characters or dangerous patterns
    url = url.replace(/[\x00-\x1F\x7F]/g, '');
    
    // If already has protocol, clean it up
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    
    // Remove any malformed protocol attempts
    url = url.replace(/^(https?:)+/i, '');
    
    // Add https:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url.replace(/^\/+/, '');
    }
    
    return url;
  }

  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} - Truncated text
   */
  static truncate(text, maxLength = 500) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Remove potentially dangerous characters from filename
   * @param {string} filename - Original filename
   * @returns {string} - Safe filename
   */
  static sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
}

module.exports = SanitizerUtils;
