import json
import os
import re

# Synonym mapping exactly matching JavaScript side
SKILL_SYNONYMS = {
    'javascript': ['js', 'javascript', 'ecmascript', 'es6', 'es2015'],
    'node.js': ['node', 'nodejs', 'node.js', 'node js'],
    'react': ['react', 'reactjs', 'react.js', 'react js'],
    'vue': ['vue', 'vuejs', 'vue.js', 'vue js'],
    'angular': ['angular', 'angularjs', 'angular.js', 'angular js'],
    'next.js': ['next', 'nextjs', 'next.js', 'next js'],
    'express': ['express', 'expressjs', 'express.js', 'express js'],
    'typescript': ['typescript', 'ts', 'type script'],
    'python': ['python', 'python3', 'python 3', 'py'],
    'django': ['django', 'python django'],
    'flask': ['flask', 'python flask'],
    'fastapi': ['fastapi', 'fast api'],
    'pandas': ['pandas', 'python pandas'],
    'numpy': ['numpy', 'python numpy'],
    'tensorflow': ['tensorflow', 'tensor flow', 'tf'],
    'pytorch': ['pytorch', 'torch', 'python torch'],
    'scikit-learn': ['scikit-learn', 'sklearn', 'scikit learn'],
    'java': ['java', 'java se', 'java ee'],
    'spring': ['spring', 'spring boot', 'springboot', 'spring framework'],
    'hibernate': ['hibernate', 'hibernate orm'],
    'mongodb': ['mongodb', 'mongo', 'mongo db'],
    'postgresql': ['postgresql', 'postgres', 'psql'],
    'mysql': ['mysql', 'my sql'],
    'sql': ['sql', 'structured query language'],
    'redis': ['redis', 'redis cache'],
    'aws': ['aws', 'amazon web services', 'amazon aws'],
    'azure': ['azure', 'microsoft azure'],
    'gcp': ['gcp', 'google cloud', 'google cloud platform'],
    'docker': ['docker', 'containerization'],
    'kubernetes': ['kubernetes', 'k8s', 'k8'],
    'jenkins': ['jenkins', 'ci/cd'],
    'git': ['git', 'github', 'gitlab', 'version control'],
    'react native': ['react native', 'react-native', 'reactnative', 'rn'],
    'flutter': ['flutter', 'dart flutter'],
    'android': ['android', 'android development'],
    'ios': ['ios', 'swift', 'ios development'],
    'machine learning': ['machine learning', 'ml', 'machinelearning'],
    'deep learning': ['deep learning', 'dl', 'deeplearning', 'neural networks'],
    'artificial intelligence': ['artificial intelligence', 'ai'],
    'data science': ['data science', 'data analysis', 'data analytics'],
    'nlp': ['nlp', 'natural language processing', 'text processing'],
    'computer vision': ['computer vision', 'cv', 'image processing'],
    'html': ['html', 'html5', 'html 5'],
    'css': ['css', 'css3', 'css 3'],
    'sass': ['sass', 'scss'],
    'tailwind': ['tailwind', 'tailwindcss', 'tailwind css'],
    'bootstrap': ['bootstrap', 'bootstrap css'],
    'jest': ['jest', 'jest testing'],
    'mocha': ['mocha', 'mocha testing'],
    'selenium': ['selenium', 'selenium testing'],
    'junit': ['junit', 'junit testing'],
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
}

ROLES_DB_PATH = os.path.join(os.path.dirname(__file__), "roles_db.json")

def load_roles():
    if os.path.exists(ROLES_DB_PATH):
        try:
            with open(ROLES_DB_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading roles_db.json: {e}")
    return []

def get_role_by_id(role_id):
    roles = load_roles()
    for role in roles:
        if role.get("id") == role_id:
            return role
    return None

def normalize_skill(skill):
    lower = skill.lower().strip()
    for canonical, synonyms in SKILL_SYNONYMS.items():
        if lower in synonyms:
            return canonical
    return lower

def extract_skills(text):
    skills = set()
    lower_text = text.lower()
    
    for canonical, synonyms in SKILL_SYNONYMS.items():
        for synonym in synonyms:
            # Word boundary matching helper that handles symbols (like c++, .net)
            pattern = re.escape(synonym)
            if synonym[0].isalnum():
                pattern = r'\b' + pattern
            if synonym[-1].isalnum():
                pattern = pattern + r'\b'
            
            if re.search(pattern, lower_text, re.IGNORECASE):
                skills.add(canonical)
                break
                
    return list(skills)

def calculate_skill_match(resume_skills, required_skills):
    normalized_resume = [normalize_skill(s) for s in resume_skills]
    normalized_required = [normalize_skill(s) for s in required_skills]
    
    matching = [s for s in normalized_required if s in normalized_resume]
    missing = [s for s in normalized_required if s not in normalized_resume]
    
    match_percentage = (len(matching) / len(normalized_required)) * 100 if normalized_required else 0
    
    return {
        "matching": matching,
        "missing": missing,
        "match_percentage": match_percentage
    }

def detect_resume_sections(text):
    sections = {
        'summary': '',
        'skills': '',
        'experience': '',
        'projects': '',
        'education': '',
        'certifications': '',
        'other': ''
    }
    
    lines = text.split('\n')
    current_section = 'other'
    
    section_patterns = {
        'summary': re.compile(r'^(summary|profile|objective|about|career objective|professional summary)', re.IGNORECASE),
        'skills': re.compile(r'^(skills|technical skills|core competencies|expertise|technologies)', re.IGNORECASE),
        'experience': re.compile(r'^(experience|work experience|employment|professional experience|work history)', re.IGNORECASE),
        'projects': re.compile(r'^(projects|academic projects|personal projects|key projects)', re.IGNORECASE),
        'education': re.compile(r'^(education|academic|qualification|educational background)', re.IGNORECASE),
        'certifications': re.compile(r'^(certifications|certificates|training|courses)', re.IGNORECASE)
    }
    
    for line in lines:
        trimmed = line.strip()
        if not trimmed:
            continue
            
        matched_section = None
        for sec, pattern in section_patterns.items():
            if pattern.match(trimmed):
                matched_section = sec
                break
                
        if matched_section:
            current_section = matched_section
        else:
            sections[current_section] += line + '\n'
            
    return sections

def calculate_resume_metrics(text, sections):
    words = len(re.findall(r'\w+', text))
    metrics = {
        "wordCount": words,
        "hasSummary": len(sections['summary'].strip()) > 50,
        "hasSkills": len(sections['skills'].strip()) > 20,
        "hasExperience": len(sections['experience'].strip()) > 100,
        "hasProjects": len(sections['projects'].strip()) > 50,
        "hasEducation": len(sections['education'].strip()) > 20,
        "sectionCount": 0
    }
    
    for key, value in sections.items():
        if key != 'other' and len(value.strip()) > 20:
            metrics["sectionCount"] += 1
            
    return metrics

def analyze_ats_keywords(resume_text, role_keywords):
    resume_lower = resume_text.lower()
    keyword_density = {}
    
    for keyword in role_keywords:
        pattern = re.escape(keyword.lower())
        if keyword[0].isalnum():
            pattern = r'\b' + pattern
        if keyword[-1].isalnum():
            pattern = pattern + r'\b'
            
        matches = re.findall(pattern, resume_lower)
        keyword_density[keyword] = len(matches)
        
    return keyword_density

def hash_text(text):
    h = 0
    for char in text:
        h = ((h << 5) - h) + ord(char)
        h = h & h
    return abs(h)

def generate_suggestions(role, skill_match, sections, metrics, text_hash):
    # Prefix categories so Gateway can easily map them
    suggestions = []
    
    # Summary
    if not metrics["hasSummary"] or len(sections['summary'].strip()) < 100:
        suggestions.append(f"Summary: Craft a compelling 3-4 line professional summary highlighting your {role['title']} aspirations")
        if skill_match["matching"]:
            suggestions.append(f"Summary: Mention your strongest skills: {', '.join(skill_match['matching'][:3])}")
        suggestions.append("Summary: Quantify your experience or achievements where possible")
    else:
        if len(skill_match["missing"]) >= 2:
            suggestions.append(f"Summary: Your summary is present. Consider emphasizing {skill_match['missing'][0]} and {skill_match['missing'][1]} if you have experience")
        suggestions.append("Summary: Use action-oriented language that showcases impact")
        
    # Skills
    suggestions.append("Skills: Organize skills by category (Languages, Frameworks, Tools, Databases)")
    suggestions.append(f"Skills: Prominently feature: {', '.join(role['skills'][:5])}")
    suggestions.append("Skills: Remove outdated or irrelevant technologies")
    if skill_match["missing"]:
        suggestions.append(f"Skills: Consider learning: {', '.join(skill_match['missing'][:3])} to strengthen your profile")
        
    # Experience
    suggestions.append("Experience: Use the STAR method (Situation, Task, Action, Result) for bullet points")
    suggestions.append("Experience: Quantify achievements with metrics and percentages")
    suggestions.append("Experience: Lead with strong action verbs (Developed, Implemented, Optimized)")
    suggestions.append(f"Experience: Highlight technologies used, especially: {', '.join(role['skills'][:4])}")
    
    # Projects
    suggestions.append(f"Projects: Showcase 3-4 relevant projects that demonstrate {role['title']} skills")
    suggestions.append("Projects: Include project descriptions, technologies used, and your specific contributions")
    suggestions.append("Projects: Add links to GitHub repositories or live demos")
    suggestions.append(f"Projects: Focus on projects using: {', '.join(role['skills'][:3])}")
    
    # ATS
    if skill_match["missing"]:
        suggestions.append(f"ATS: Increase keyword density for: {', '.join(skill_match['missing'][:5])}")
    suggestions.append("ATS: Use standard section headings (Experience, Education, Skills, Projects)")
    suggestions.append("ATS: Avoid tables, images, and complex formatting that ATS systems can't parse")
    suggestions.append("ATS: Save resume as PDF with selectable text")
    suggestions.append("ATS: Mirror language from job descriptions for roles you're targeting")
    
    # Learning
    suggestions.append(f"Learning: Master {role['skills'][0]} through hands-on projects and tutorials")
    suggestions.append(f"Learning: Build a portfolio showcasing {role['title']} projects")
    if len(role['skills']) >= 2:
        suggestions.append(f"Learning: Contribute to open-source projects using {role['skills'][0]} and {role['skills'][1]}")
    if len(skill_match['missing']) >= 2:
        suggestions.append(f"Learning: Earn certifications in {skill_match['missing'][0]} or {skill_match['missing'][1]}")
        
    return suggestions

def generate_bullet_transformations(role):
    # Match the layout from Node
    first_skill = role['skills'][0] if role['skills'] else "React"
    return [
        {
            "before": "Worked on the frontend of the website",
            "after": f"Developed responsive web interfaces using {first_skill}, improving load time by 40% and enhancing user engagement"
        },
        {
            "before": "Helped with bug fixes",
            "after": "Debugged and resolved 50+ production issues, reducing system downtime by 30% through proactive monitoring"
        },
        {
            "before": "Part of the development team",
            "after": f"Collaborated with cross-functional team of 8 to deliver {role['title']} features, meeting 100% of sprint commitments"
        }
    ]

def analyze_offline(resume_text, target_roles):
    results = []
    
    resume_skills = extract_skills(resume_text)
    sections = detect_resume_sections(resume_text)
    metrics = calculate_resume_metrics(resume_text, sections)
    text_hash = hash_text(resume_text)
    
    for role_id in target_roles:
        role = get_role_by_id(role_id)
        if not role:
            continue
            
        skill_match = calculate_skill_match(resume_skills, role["skills"])
        role_keywords = role["skills"] + role["keywords"]
        ats_raw = analyze_ats_keywords(resume_text, role_keywords)
        
        # Calculate compatibility score
        base_score = skill_match["match_percentage"]
        section_bonus = metrics["sectionCount"] * 3
        ats_bonus = sum(1 for count in ats_raw.values() if count > 0) * 2
        
        compatibility_score = round(base_score * 0.6 + section_bonus + ats_bonus)
        compatibility_score = max(30, min(95, compatibility_score))
        
        # Add slight variation based on text hash
        hash_variation = (text_hash % 7) - 3
        compatibility_score = max(30, min(95, compatibility_score + hash_variation))
        
        # Format ATS keywords
        ats_keywords = [
            {"keyword": kw, "frequency": count}
            for kw, count in ats_raw.items() if count > 0
        ]
        
        suggestions = generate_suggestions(role, skill_match, sections, metrics, text_hash)
        bullet_transformations = generate_bullet_transformations(role)
        
        results.append({
            "role": role_id,
            "compatibility_score": compatibility_score,
            "matching_skills": skill_match["matching"],
            "missing_skills": skill_match["missing"][:8],
            "ats_keywords": ats_keywords,
            "suggestions": suggestions,
            "bullet_transformations": bullet_transformations
        })
        
    return results
