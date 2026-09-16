// Resume text parsing and section detection
export function detectResumeSections(text) {
  const sections = {
    summary: '',
    skills: '',
    experience: '',
    projects: '',
    education: '',
    certifications: '',
    other: ''
  };

  const lines = text.split('\n');
  let currentSection = 'other';

  const sectionPatterns = {
    summary: /^(summary|profile|objective|about|career objective|professional summary)/i,
    skills: /^(skills|technical skills|core competencies|expertise|technologies)/i,
    experience: /^(experience|work experience|employment|professional experience|work history)/i,
    projects: /^(projects|academic projects|personal projects|key projects)/i,
    education: /^(education|academic|qualification|educational background)/i,
    certifications: /^(certifications|certificates|training|courses)/i
  };

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line is a section header
    let matchedSection = null;
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(trimmed)) {
        matchedSection = section;
        break;
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
    } else {
      sections[currentSection] += line + '\n';
    }
  }

  return sections;
}

// Extract key information from resume
export function extractResumeMetadata(text) {
  const metadata = {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: ''
  };

  // Email extraction
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) metadata.email = emailMatch[0];

  // Phone extraction
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) metadata.phone = phoneMatch[0];

  // LinkedIn extraction
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) metadata.linkedin = linkedinMatch[0];

  // GitHub extraction
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) metadata.github = githubMatch[0];

  return metadata;
}

// Calculate resume quality metrics
export function calculateResumeMetrics(text, sections) {
  const metrics = {
    wordCount: text.split(/\s+/).length,
    hasSummary: sections.summary.length > 50,
    hasSkills: sections.skills.length > 20,
    hasExperience: sections.experience.length > 100,
    hasProjects: sections.projects.length > 50,
    hasEducation: sections.education.length > 20,
    sectionCount: 0
  };

  // Count populated sections
  for (const [key, value] of Object.entries(sections)) {
    if (key !== 'other' && value.length > 20) {
      metrics.sectionCount++;
    }
  }

  return metrics;
}

// ATS keyword density analysis
export function analyzeATSKeywords(resumeText, roleKeywords) {
  const resumeLower = resumeText.toLowerCase();
  const keywordDensity = {};
  
  for (const keyword of roleKeywords) {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
    const matches = resumeLower.match(regex);
    keywordDensity[keyword] = matches ? matches.length : 0;
  }

  return keywordDensity;
}

// Calculate hash from text for deterministic variation
export function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
