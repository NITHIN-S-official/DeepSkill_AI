import { extractSkills, calculateSkillMatch } from './skillDatabase.js';
import { getRoleById } from './roleDatabase.js';
import { detectResumeSections, calculateResumeMetrics, analyzeATSKeywords, hashText } from './resumeParser.js';

// Generate AI-like phrasing variations based on deterministic hash
function getPhrasingVariant(hash, variants) {
  return variants[hash % variants.length];
}

// Main analysis engine
export function analyzeResume(resumeText, selectedRoleIds) {
  const results = [];
  const resumeSkills = extractSkills(resumeText);
  const sections = detectResumeSections(resumeText);
  const metrics = calculateResumeMetrics(resumeText, sections);
  const textHash = hashText(resumeText);

  for (const roleId of selectedRoleIds) {
    try {
      const role = getRoleById(roleId);
      if (!role) {
        console.warn(`Role not found: ${roleId}`);
        continue;
      }

      const skillMatch = calculateSkillMatch(resumeSkills, role.skills);
      const atsKeywords = analyzeATSKeywords(resumeText, [...role.skills, ...role.keywords]);
      
      // Calculate compatibility score (30-95 range)
      const baseScore = skillMatch.matchPercentage;
      const sectionBonus = metrics.sectionCount * 3;
      const atsBonus = Object.values(atsKeywords).filter(count => count > 0).length * 2;
      
      let compatibilityScore = Math.round(baseScore * 0.6 + sectionBonus + atsBonus);
      
      // Ensure score is between 30 and 95
      compatibilityScore = Math.max(30, Math.min(95, compatibilityScore));
      
      // Add slight variation based on text hash (±3 points)
      const hashVariation = (textHash % 7) - 3;
      compatibilityScore = Math.max(30, Math.min(95, compatibilityScore + hashVariation));

      // Identify skills to improve (present but low mention)
      const skillsToImprove = skillMatch.matching.filter(skill => {
        const mentions = atsKeywords[skill] || 0;
        return mentions > 0 && mentions < 3;
      }).slice(0, 5);

      // Generate AI-like analysis text
      const analysis = generateAnalysisText(role, skillMatch, compatibilityScore, metrics, textHash);

      results.push({
        roleId: role.id,
        roleTitle: role.title,
        compatibilityScore,
        matchingSkills: skillMatch.matching,
        missingSkills: skillMatch.missing.slice(0, 8),
        skillsToImprove,
        toolsToLearn: skillMatch.missing.slice(0, 5),
        atsKeywords: Object.entries(atsKeywords)
          .filter(([_, count]) => count > 0)
          .map(([keyword, count]) => ({ keyword, count })),
        analysis,
        suggestions: generateSuggestions(role, skillMatch, sections, metrics, textHash)
      });
    } catch (error) {
      console.error(`Error analyzing role ${roleId}:`, error);
      // Continue with next role instead of failing entire request
    }
  }

  return results;
}

// Generate AI-like analysis text
function generateAnalysisText(role, skillMatch, score, metrics, hash) {
  const intros = [
    `Based on your resume, your profile shows`,
    `After analyzing your background, I've identified`,
    `Your resume demonstrates`,
    `The analysis reveals that your profile exhibits`
  ];

  const scoreDescriptions = {
    high: ['strong alignment', 'excellent compatibility', 'solid match', 'impressive fit'],
    medium: ['moderate alignment', 'good potential', 'promising compatibility', 'developing fit'],
    low: ['foundational alignment', 'growth potential', 'emerging compatibility', 'early-stage fit']
  };

  const level = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
  const intro = getPhrasingVariant(hash, intros);
  const scoreDesc = getPhrasingVariant(hash + 1, scoreDescriptions[level]);

  let text = `${intro} ${scoreDesc} with the ${role.title} role. `;

  if (skillMatch.matching.length > 0) {
    text += `You have demonstrated proficiency in ${skillMatch.matching.length} key skills including ${skillMatch.matching.slice(0, 3).join(', ')}. `;
  }

  if (skillMatch.missing.length > 0) {
    text += `To enhance your candidacy, focus on developing ${skillMatch.missing.slice(0, 3).join(', ')}. `;
  }

  if (!metrics.hasSummary) {
    text += `Adding a compelling professional summary would strengthen your resume. `;
  }

  if (metrics.sectionCount < 4) {
    text += `Expanding your resume with additional sections will improve ATS compatibility. `;
  }

  return text;
}

// Generate detailed suggestions
function generateSuggestions(role, skillMatch, sections, metrics, hash) {
  const suggestions = {
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    ats: [],
    learning: []
  };

  // Summary suggestions
  if (!metrics.hasSummary || sections.summary.length < 100) {
    suggestions.summary.push(
      `Craft a compelling 3-4 line professional summary highlighting your ${role.title} aspirations`,
      `Mention your strongest skills: ${skillMatch.matching.slice(0, 3).join(', ')}`,
      `Quantify your experience or achievements where possible`
    );
  } else {
    suggestions.summary.push(
      `Your summary is present. Consider emphasizing ${skillMatch.missing.slice(0, 2).join(' and ')} if you have experience`,
      `Use action-oriented language that showcases impact`
    );
  }

  // Skills suggestions
  suggestions.skills.push(
    `Organize skills by category (Languages, Frameworks, Tools, Databases)`,
    `Prominently feature: ${role.skills.slice(0, 5).join(', ')}`,
    `Remove outdated or irrelevant technologies`
  );

  if (skillMatch.missing.length > 0) {
    suggestions.skills.push(
      `Consider learning: ${skillMatch.missing.slice(0, 3).join(', ')} to strengthen your profile`
    );
  }

  // Experience suggestions
  suggestions.experience.push(
    `Use the STAR method (Situation, Task, Action, Result) for bullet points`,
    `Quantify achievements with metrics and percentages`,
    `Lead with strong action verbs (Developed, Implemented, Optimized)`,
    `Highlight technologies used, especially: ${role.skills.slice(0, 4).join(', ')}`
  );

  // Projects suggestions
  suggestions.projects.push(
    `Showcase 3-4 relevant projects that demonstrate ${role.title} skills`,
    `Include project descriptions, technologies used, and your specific contributions`,
    `Add links to GitHub repositories or live demos`,
    `Focus on projects using: ${role.skills.slice(0, 3).join(', ')}`
  );

  // ATS suggestions
  suggestions.ats.push(
    `Increase keyword density for: ${skillMatch.missing.slice(0, 5).join(', ')}`,
    `Use standard section headings (Experience, Education, Skills, Projects)`,
    `Avoid tables, images, and complex formatting that ATS systems can't parse`,
    `Save resume as PDF with selectable text`,
    `Mirror language from job descriptions for roles you're targeting`
  );

  // Learning resources
  suggestions.learning.push(
    `Master ${role.skills[0]} through hands-on projects and tutorials`,
    `Build a portfolio showcasing ${role.title} projects`,
    `Contribute to open-source projects using ${role.skills.slice(0, 2).join(' and ')}`,
    `Earn certifications in ${skillMatch.missing.slice(0, 2).join(' or ')}`
  );

  return suggestions;
}

// Generate project ideas based on role
export function generateProjectIdeas(role, skillMatch) {
  const projectIdeas = [];
  const hash = role.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Role-specific project ideas
  const projectTemplates = {
    'frontend-developer': [
      'Build a responsive e-commerce product page with React and Tailwind CSS',
      'Create an interactive dashboard with real-time data visualization',
      'Develop a progressive web app (PWA) with offline capabilities'
    ],
    'backend-developer': [
      'Design and implement a RESTful API with authentication and authorization',
      'Build a microservices architecture for a sample application',
      'Create a real-time chat application using WebSockets'
    ],
    'full-stack-developer': [
      'Develop a full-stack social media platform with user authentication',
      'Build a task management application with real-time updates',
      'Create an e-commerce platform with payment integration'
    ],
    'data-scientist': [
      'Build a machine learning model for predictive analysis',
      'Create an interactive data visualization dashboard',
      'Develop a recommendation system using collaborative filtering'
    ],
    'ml-engineer': [
      'Deploy a machine learning model as a REST API',
      'Build an end-to-end ML pipeline with model monitoring',
      'Create a computer vision application for object detection'
    ]
  };

  // Get role-specific ideas or generate generic ones
  const specificIdeas = projectTemplates[role.id] || [
    `Build a portfolio project showcasing ${role.skills.slice(0, 3).join(', ')}`,
    `Create an application that solves a real-world problem using ${role.skills[0]}`,
    `Contribute to open-source projects related to ${role.title}`
  ];

  return specificIdeas;
}

// Generate before/after bullet transformations
export function generateBulletTransformations(role) {
  return [
    {
      before: 'Worked on the frontend of the website',
      after: `Developed responsive web interfaces using ${role.skills[0]}, improving load time by 40% and enhancing user engagement`,
      improvement: 'Added specific technologies, quantified impact, and focused on results'
    },
    {
      before: 'Helped with bug fixes',
      after: `Debugged and resolved 50+ production issues, reducing system downtime by 30% through proactive monitoring`,
      improvement: 'Quantified contributions and demonstrated impact on system reliability'
    },
    {
      before: 'Part of the development team',
      after: `Collaborated with cross-functional team of 8 to deliver ${role.title} features, meeting 100% of sprint commitments`,
      improvement: 'Specified role, team size, and measurable outcomes'
    }
  ];
}
