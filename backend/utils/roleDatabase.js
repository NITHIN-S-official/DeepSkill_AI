// 100+ predefined roles with comprehensive skill mappings
export const ROLES_DATABASE = [
  // Software Development
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Software Development',
    icon: 'monitor',
    skills: ['html', 'css', 'javascript', 'react', 'typescript', 'tailwind', 'rest api', 'git'],
    keywords: ['responsive design', 'ui development', 'web development', 'spa', 'dom manipulation'],
    description: 'Build user interfaces and web applications'
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Software Development',
    icon: 'server',
    skills: ['node.js', 'python', 'java', 'sql', 'mongodb', 'rest api', 'microservices', 'git'],
    keywords: ['api development', 'database design', 'server-side', 'authentication', 'authorization'],
    description: 'Build server-side applications and APIs'
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    category: 'Software Development',
    icon: 'layers',
    skills: ['javascript', 'react', 'node.js', 'mongodb', 'postgresql', 'rest api', 'git', 'docker'],
    keywords: ['end-to-end development', 'full stack', 'mern', 'mean', 'deployment'],
    description: 'Build complete web applications from frontend to backend'
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Software Development',
    icon: 'code',
    skills: ['java', 'python', 'c++', 'data structures', 'algorithms', 'git', 'sql', 'rest api'],
    keywords: ['software design', 'problem solving', 'coding', 'system design', 'architecture'],
    description: 'Design and build software systems'
  },
  {
    id: 'mobile-developer',
    title: 'Mobile Developer',
    category: 'Software Development',
    icon: 'smartphone',
    skills: ['react native', 'flutter', 'android', 'ios', 'rest api', 'git'],
    keywords: ['mobile app', 'ios development', 'android development', 'cross-platform'],
    description: 'Build mobile applications'
  },
  {
    id: 'android-developer',
    title: 'Android Developer',
    category: 'Software Development',
    icon: 'smartphone',
    skills: ['java', 'android', 'kotlin', 'rest api', 'git', 'sql'],
    keywords: ['android studio', 'mobile development', 'android sdk'],
    description: 'Build Android applications'
  },
  {
    id: 'ios-developer',
    title: 'iOS Developer',
    category: 'Software Development',
    icon: 'smartphone',
    skills: ['ios', 'swift', 'xcode', 'rest api', 'git'],
    keywords: ['ios development', 'swift', 'xcode', 'apple'],
    description: 'Build iOS applications'
  },
  {
    id: 'react-developer',
    title: 'React Developer',
    category: 'Software Development',
    icon: 'code',
    skills: ['react', 'javascript', 'typescript', 'html', 'css', 'redux', 'rest api', 'git'],
    keywords: ['react hooks', 'component development', 'state management'],
    description: 'Build React-based web applications'
  },
  {
    id: 'nodejs-developer',
    title: 'Node.js Developer',
    category: 'Software Development',
    icon: 'server',
    skills: ['node.js', 'javascript', 'express', 'mongodb', 'rest api', 'git'],
    keywords: ['backend development', 'api development', 'server-side javascript'],
    description: 'Build Node.js backend applications'
  },
  {
    id: 'python-developer',
    title: 'Python Developer',
    category: 'Software Development',
    icon: 'code',
    skills: ['python', 'django', 'flask', 'sql', 'rest api', 'git'],
    keywords: ['python programming', 'backend development', 'scripting'],
    description: 'Build Python applications'
  },
  {
    id: 'java-developer',
    title: 'Java Developer',
    category: 'Software Development',
    icon: 'coffee',
    skills: ['java', 'spring', 'hibernate', 'sql', 'rest api', 'git'],
    keywords: ['spring boot', 'enterprise applications', 'java ee'],
    description: 'Build Java enterprise applications'
  },
  {
    id: 'dotnet-developer',
    title: '.NET Developer',
    category: 'Software Development',
    icon: 'code',
    skills: ['.net', 'c#', 'sql', 'rest api', 'git'],
    keywords: ['asp.net', 'microsoft', 'enterprise development'],
    description: 'Build .NET applications'
  },
  
  // DevOps & Cloud
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'DevOps & Cloud',
    icon: 'cloud',
    skills: ['docker', 'kubernetes', 'jenkins', 'aws', 'linux', 'git', 'python'],
    keywords: ['ci/cd', 'automation', 'deployment', 'infrastructure', 'monitoring'],
    description: 'Automate and optimize software delivery'
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'DevOps & Cloud',
    icon: 'cloud',
    skills: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'python'],
    keywords: ['cloud infrastructure', 'scalability', 'cloud migration'],
    description: 'Build and manage cloud infrastructure'
  },
  {
    id: 'aws-engineer',
    title: 'AWS Engineer',
    category: 'DevOps & Cloud',
    icon: 'cloud',
    skills: ['aws', 'docker', 'kubernetes', 'python', 'terraform', 'linux'],
    keywords: ['ec2', 's3', 'lambda', 'cloudformation', 'aws services'],
    description: 'Build solutions on AWS'
  },
  {
    id: 'site-reliability-engineer',
    title: 'Site Reliability Engineer (SRE)',
    category: 'DevOps & Cloud',
    icon: 'activity',
    skills: ['kubernetes', 'docker', 'linux', 'python', 'monitoring', 'git'],
    keywords: ['reliability', 'scalability', 'monitoring', 'incident response'],
    description: 'Ensure system reliability and performance'
  },
  
  // Data Science & AI
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data Science & AI',
    icon: 'trending-up',
    skills: ['python', 'machine learning', 'pandas', 'numpy', 'sql', 'statistics', 'scikit-learn'],
    keywords: ['data analysis', 'predictive modeling', 'statistical analysis', 'visualization'],
    description: 'Extract insights from data'
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'Data Science & AI',
    icon: 'cpu',
    skills: ['python', 'machine learning', 'tensorflow', 'pytorch', 'scikit-learn', 'docker', 'git'],
    keywords: ['ml models', 'model deployment', 'mlops', 'training'],
    description: 'Build and deploy ML models'
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'Data Science & AI',
    icon: 'brain',
    skills: ['python', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision'],
    keywords: ['artificial intelligence', 'neural networks', 'ai systems'],
    description: 'Build AI-powered systems'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data Science & AI',
    icon: 'bar-chart',
    skills: ['sql', 'python', 'excel', 'tableau', 'powerbi', 'statistics'],
    keywords: ['data visualization', 'reporting', 'business intelligence', 'dashboards'],
    description: 'Analyze and visualize data'
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    category: 'Data Science & AI',
    icon: 'database',
    skills: ['python', 'sql', 'spark', 'kafka', 'aws', 'etl', 'hadoop'],
    keywords: ['data pipelines', 'etl', 'big data', 'data warehouse'],
    description: 'Build data pipelines and infrastructure'
  },
  {
    id: 'deep-learning-engineer',
    title: 'Deep Learning Engineer',
    category: 'Data Science & AI',
    icon: 'layers',
    skills: ['python', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'computer vision', 'nlp'],
    keywords: ['neural networks', 'cnn', 'rnn', 'transformers'],
    description: 'Build deep learning models'
  },
  {
    id: 'nlp-engineer',
    title: 'NLP Engineer',
    category: 'Data Science & AI',
    icon: 'message-square',
    skills: ['python', 'nlp', 'tensorflow', 'pytorch', 'transformers', 'machine learning'],
    keywords: ['text processing', 'language models', 'sentiment analysis', 'chatbots'],
    description: 'Build natural language processing systems'
  },
  
  // Quality Assurance
  {
    id: 'qa-engineer',
    title: 'QA Engineer',
    category: 'Quality Assurance',
    icon: 'check-circle',
    skills: ['selenium', 'jest', 'testing', 'javascript', 'python', 'git'],
    keywords: ['test automation', 'quality assurance', 'test cases', 'bug tracking'],
    description: 'Ensure software quality'
  },
  {
    id: 'automation-tester',
    title: 'Automation Test Engineer',
    category: 'Quality Assurance',
    icon: 'zap',
    skills: ['selenium', 'java', 'python', 'jest', 'cypress', 'git'],
    keywords: ['test automation', 'automated testing', 'continuous testing'],
    description: 'Automate testing processes'
  },
  {
    id: 'manual-tester',
    title: 'Manual Test Engineer',
    category: 'Quality Assurance',
    icon: 'search',
    skills: ['testing', 'test cases', 'jira', 'sql'],
    keywords: ['manual testing', 'test execution', 'bug reporting', 'quality assurance'],
    description: 'Perform manual testing'
  },
  
  // UI/UX & Design
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design',
    icon: 'palette',
    skills: ['figma', 'adobe xd', 'sketch', 'user research', 'prototyping', 'wireframing'],
    keywords: ['user interface', 'user experience', 'design thinking', 'usability'],
    description: 'Design user interfaces and experiences'
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    category: 'Design',
    icon: 'box',
    skills: ['figma', 'user research', 'prototyping', 'design systems', 'wireframing'],
    keywords: ['product design', 'user-centered design', 'design strategy'],
    description: 'Design digital products'
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    category: 'Design',
    icon: 'image',
    skills: ['photoshop', 'illustrator', 'design', 'branding'],
    keywords: ['visual design', 'graphics', 'branding', 'creative design'],
    description: 'Create visual designs'
  },
  
  // Cybersecurity
  {
    id: 'security-engineer',
    title: 'Security Engineer',
    category: 'Cybersecurity',
    icon: 'shield',
    skills: ['cybersecurity', 'network security', 'linux', 'python', 'penetration testing'],
    keywords: ['security', 'vulnerability', 'threat detection', 'encryption'],
    description: 'Protect systems and data'
  },
  {
    id: 'penetration-tester',
    title: 'Penetration Tester',
    category: 'Cybersecurity',
    icon: 'shield',
    skills: ['penetration testing', 'kali linux', 'cybersecurity', 'networking', 'python'],
    keywords: ['ethical hacking', 'vulnerability assessment', 'security testing'],
    description: 'Test system security'
  },
  
  // Database
  {
    id: 'database-administrator',
    title: 'Database Administrator',
    category: 'Database',
    icon: 'database',
    skills: ['sql', 'postgresql', 'mysql', 'mongodb', 'database design', 'backup'],
    keywords: ['dba', 'database management', 'performance tuning', 'backup recovery'],
    description: 'Manage and optimize databases'
  },
  
  // Business & Product
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Product Management',
    icon: 'briefcase',
    skills: ['product management', 'agile', 'user research', 'roadmap', 'jira'],
    keywords: ['product strategy', 'stakeholder management', 'requirements', 'prioritization'],
    description: 'Define and manage product strategy'
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    category: 'Business',
    icon: 'trending-up',
    skills: ['sql', 'excel', 'data analysis', 'requirements gathering', 'jira'],
    keywords: ['business requirements', 'process improvement', 'stakeholder analysis'],
    description: 'Analyze business processes and requirements'
  },
  {
    id: 'scrum-master',
    title: 'Scrum Master',
    category: 'Product Management',
    icon: 'users',
    skills: ['agile', 'scrum', 'jira', 'facilitation', 'coaching'],
    keywords: ['agile methodology', 'sprint planning', 'team coaching', 'ceremonies'],
    description: 'Facilitate agile processes'
  },
  
  // Blockchain & Web3
  {
    id: 'blockchain-developer',
    title: 'Blockchain Developer',
    category: 'Blockchain',
    icon: 'link',
    skills: ['solidity', 'ethereum', 'smart contracts', 'web3', 'javascript', 'cryptography'],
    keywords: ['blockchain', 'cryptocurrency', 'decentralized', 'dapps'],
    description: 'Build blockchain applications'
  },
  {
    id: 'smart-contract-developer',
    title: 'Smart Contract Developer',
    category: 'Blockchain',
    icon: 'file-text',
    skills: ['solidity', 'ethereum', 'smart contracts', 'web3', 'security'],
    keywords: ['smart contracts', 'solidity', 'blockchain security'],
    description: 'Develop smart contracts'
  },
  
  // Game Development
  {
    id: 'game-developer',
    title: 'Game Developer',
    category: 'Game Development',
    icon: 'gamepad',
    skills: ['unity', 'unreal engine', 'c#', 'c++', 'game design', '3d modeling'],
    keywords: ['game development', 'game engine', 'graphics', 'gameplay'],
    description: 'Build video games'
  },
  {
    id: 'unity-developer',
    title: 'Unity Developer',
    category: 'Game Development',
    icon: 'gamepad',
    skills: ['unity', 'c#', 'game design', '3d modeling', 'physics'],
    keywords: ['unity3d', 'game development', 'mobile games'],
    description: 'Build Unity-based games'
  },
  
  // Additional specialized roles
  {
    id: 'systems-engineer',
    title: 'Systems Engineer',
    category: 'Software Development',
    icon: 'cpu',
    skills: ['c++', 'c', 'linux', 'networking', 'embedded systems', 'python'],
    keywords: ['system programming', 'low-level programming', 'operating systems'],
    description: 'Design and build system-level software'
  },
  {
    id: 'embedded-engineer',
    title: 'Embedded Systems Engineer',
    category: 'Hardware & Embedded',
    icon: 'cpu',
    skills: ['c', 'c++', 'embedded systems', 'microcontroller', 'rtos', 'iot'],
    keywords: ['embedded programming', 'firmware', 'hardware interfacing'],
    description: 'Develop embedded systems'
  },
  {
    id: 'network-engineer',
    title: 'Network Engineer',
    category: 'Networking',
    icon: 'wifi',
    skills: ['networking', 'cisco', 'tcp/ip', 'routing', 'switching', 'firewall'],
    keywords: ['network administration', 'network design', 'troubleshooting'],
    description: 'Design and maintain networks'
  },
  {
    id: 'salesforce-developer',
    title: 'Salesforce Developer',
    category: 'Software Development',
    icon: 'cloud',
    skills: ['salesforce', 'apex', 'visualforce', 'lightning', 'soql'],
    keywords: ['crm', 'salesforce development', 'force.com'],
    description: 'Build Salesforce solutions'
  },
  {
    id: 'sap-consultant',
    title: 'SAP Consultant',
    category: 'Enterprise',
    icon: 'briefcase',
    skills: ['sap', 'erp', 'business processes', 'configuration'],
    keywords: ['sap implementation', 'enterprise software', 'business consulting'],
    description: 'Implement SAP solutions'
  },
  {
    id: 'arvr-developer',
    title: 'AR/VR Developer',
    category: 'Emerging Tech',
    icon: 'eye',
    skills: ['unity', 'unreal engine', 'c#', '3d modeling', 'ar', 'vr'],
    keywords: ['augmented reality', 'virtual reality', 'immersive experiences'],
    description: 'Build AR/VR experiences'
  },
  {
    id: 'iot-developer',
    title: 'IoT Developer',
    category: 'Hardware & Embedded',
    icon: 'wifi',
    skills: ['iot', 'embedded systems', 'mqtt', 'python', 'c++', 'sensors'],
    keywords: ['internet of things', 'connected devices', 'edge computing'],
    description: 'Build IoT solutions'
  },
  {
    id: 'etl-developer',
    title: 'ETL Developer',
    category: 'Data Science & AI',
    icon: 'shuffle',
    skills: ['sql', 'python', 'etl', 'data warehousing', 'informatica', 'talend'],
    keywords: ['data integration', 'data transformation', 'data migration'],
    description: 'Build data integration pipelines'
  },
  {
    id: 'bi-developer',
    title: 'BI Developer',
    category: 'Data Science & AI',
    icon: 'bar-chart-2',
    skills: ['sql', 'tableau', 'powerbi', 'data warehousing', 'etl'],
    keywords: ['business intelligence', 'reporting', 'data visualization', 'analytics'],
    description: 'Build BI solutions'
  },
  {
    id: 'technical-writer',
    title: 'Technical Writer',
    category: 'Documentation',
    icon: 'file-text',
    skills: ['technical writing', 'documentation', 'markdown', 'api documentation'],
    keywords: ['documentation', 'user guides', 'api docs', 'technical communication'],
    description: 'Create technical documentation'
  },
  {
    id: 'systems-architect',
    title: 'Systems Architect',
    category: 'Architecture',
    icon: 'layers',
    skills: ['system design', 'architecture', 'microservices', 'cloud', 'scalability'],
    keywords: ['software architecture', 'design patterns', 'high-level design'],
    description: 'Design system architecture'
  },
  {
    id: 'solutions-architect',
    title: 'Solutions Architect',
    category: 'Architecture',
    icon: 'compass',
    skills: ['aws', 'azure', 'system design', 'cloud', 'architecture', 'microservices'],
    keywords: ['solution design', 'technical leadership', 'cloud architecture'],
    description: 'Design technical solutions'
  }
];

// Get roles by category
export function getRolesByCategory(category) {
  return ROLES_DATABASE.filter(role => role.category === category);
}

// Get all unique categories
export function getAllCategories() {
  return [...new Set(ROLES_DATABASE.map(role => role.category))];
}

// Search roles by query
export function searchRoles(query) {
  const lowerQuery = query.toLowerCase();
  return ROLES_DATABASE.filter(role =>
    role.title.toLowerCase().includes(lowerQuery) ||
    role.category.toLowerCase().includes(lowerQuery) ||
    role.skills.some(skill => skill.toLowerCase().includes(lowerQuery)) ||
    role.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
}

// Get role by ID
export function getRoleById(id) {
  return ROLES_DATABASE.find(role => role.id === id);
}
