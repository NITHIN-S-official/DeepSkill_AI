// Comprehensive skill normalization and synonym mapping
export const SKILL_SYNONYMS = {
  // JavaScript ecosystem
  'javascript': ['js', 'javascript', 'ecmascript', 'es6', 'es2015'],
  'node.js': ['node', 'nodejs', 'node.js', 'node js'],
  'react': ['react', 'reactjs', 'react.js', 'react js'],
  'vue': ['vue', 'vuejs', 'vue.js', 'vue js'],
  'angular': ['angular', 'angularjs', 'angular.js', 'angular js'],
  'next.js': ['next', 'nextjs', 'next.js', 'next js'],
  'express': ['express', 'expressjs', 'express.js', 'express js'],
  'typescript': ['typescript', 'ts', 'type script'],
  
  // Python ecosystem
  'python': ['python', 'python3', 'python 3', 'py'],
  'django': ['django', 'python django'],
  'flask': ['flask', 'python flask'],
  'fastapi': ['fastapi', 'fast api'],
  'pandas': ['pandas', 'python pandas'],
  'numpy': ['numpy', 'python numpy'],
  'tensorflow': ['tensorflow', 'tensor flow', 'tf'],
  'pytorch': ['pytorch', 'torch', 'python torch'],
  'scikit-learn': ['scikit-learn', 'sklearn', 'scikit learn'],
  
  // Java ecosystem
  'java': ['java', 'java se', 'java ee'],
  'spring': ['spring', 'spring boot', 'springboot', 'spring framework'],
  'hibernate': ['hibernate', 'hibernate orm'],
  
  // Databases
  'mongodb': ['mongodb', 'mongo', 'mongo db'],
  'postgresql': ['postgresql', 'postgres', 'psql'],
  'mysql': ['mysql', 'my sql'],
  'sql': ['sql', 'structured query language'],
  'redis': ['redis', 'redis cache'],
  
  // Cloud & DevOps
  'aws': ['aws', 'amazon web services', 'amazon aws'],
  'azure': ['azure', 'microsoft azure'],
  'gcp': ['gcp', 'google cloud', 'google cloud platform'],
  'docker': ['docker', 'containerization'],
  'kubernetes': ['kubernetes', 'k8s', 'k8'],
  'jenkins': ['jenkins', 'ci/cd'],
  'git': ['git', 'github', 'gitlab', 'version control'],
  
  // Mobile
  'react native': ['react native', 'react-native', 'reactnative', 'rn'],
  'flutter': ['flutter', 'dart flutter'],
  'android': ['android', 'android development'],
  'ios': ['ios', 'swift', 'ios development'],
  
  // Data Science & ML
  'machine learning': ['machine learning', 'ml', 'machinelearning'],
  'deep learning': ['deep learning', 'dl', 'deeplearning', 'neural networks'],
  'artificial intelligence': ['artificial intelligence', 'ai'],
  'data science': ['data science', 'data analysis', 'data analytics'],
  'nlp': ['nlp', 'natural language processing', 'text processing'],
  'computer vision': ['computer vision', 'cv', 'image processing'],
  
  // Frontend
  'html': ['html', 'html5', 'html 5'],
  'css': ['css', 'css3', 'css 3'],
  'sass': ['sass', 'scss'],
  'tailwind': ['tailwind', 'tailwindcss', 'tailwind css'],
  'bootstrap': ['bootstrap', 'bootstrap css'],
  
  // Testing
  'jest': ['jest', 'jest testing'],
  'mocha': ['mocha', 'mocha testing'],
  'selenium': ['selenium', 'selenium testing'],
  'junit': ['junit', 'junit testing'],
  
  // Other
  'rest api': ['rest', 'rest api', 'restful', 'restful api'],
  'graphql': ['graphql', 'graph ql'],
  'microservices': ['microservices', 'micro services'],
  'agile': ['agile', 'scrum', 'agile methodology'],
  'c++': ['c++', 'cpp', 'c plus plus'],
  'c#': ['c#', 'csharp', 'c sharp'],
  '.net': ['.net', 'dotnet', 'dot net', 'asp.net'],
  'go': ['go', 'golang', 'go lang'],
  'rust': ['rust', 'rust lang'],
  'php': ['php', 'php7', 'php 7', 'php8'],
  'laravel': ['laravel', 'php laravel'],
};

// Normalize skill to its canonical form
export function normalizeSkill(skill) {
  const lower = skill.toLowerCase().trim();
  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    if (synonyms.includes(lower)) {
      return canonical;
    }
  }
  return lower;
}

// Extract skills from text using comprehensive pattern matching
export function extractSkills(text) {
  const skills = new Set();
  const lowerText = text.toLowerCase();
  
  // Check all known skills and their synonyms
  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    for (const synonym of synonyms) {
      // Use word boundary matching for accurate detection
      const regex = new RegExp(`\\b${synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(lowerText)) {
        skills.add(canonical);
        break;
      }
    }
  }
  
  return Array.from(skills);
}

// Calculate skill match score
export function calculateSkillMatch(resumeSkills, requiredSkills) {
  const normalizedResume = resumeSkills.map(normalizeSkill);
  const normalizedRequired = requiredSkills.map(normalizeSkill);
  
  const matching = normalizedRequired.filter(skill => 
    normalizedResume.includes(skill)
  );
  
  const missing = normalizedRequired.filter(skill => 
    !normalizedResume.includes(skill)
  );
  
  return {
    matching,
    missing,
    matchPercentage: normalizedRequired.length > 0 
      ? (matching.length / normalizedRequired.length) * 100 
      : 0
  };
}
