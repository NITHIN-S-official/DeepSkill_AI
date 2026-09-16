import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Briefcase, 
  Code, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  Target,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-6"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600" />
        )}
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-6 pb-6"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

function ImprovementGuide({ analysisResults, selectedRoles }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!analysisResults || !selectedRoles || selectedRoles.length === 0) {
      navigate('/upload');
      return;
    }

    // Aggregate suggestions from all results
    const allSuggestions = analysisResults.map(result => ({
      roleId: result.roleId,
      roleTitle: result.roleTitle,
      suggestions: result.suggestions
    }));

    setSuggestions(allSuggestions);
    setLoading(false);
  }, [analysisResults, selectedRoles, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Resume <span className="text-white-900">Improvement Guide</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Detailed suggestions to enhance your resume
          </p>

          {/* Optimizing For Roles */}
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="text-gray-600 font-medium">Optimizing for:</span>
            {selectedRoles.map(role => (
              <span
                key={role.id}
                className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-primary-300 text-primary-800 font-medium rounded-lg"
              >
                {role.title}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Summary Suggestions */}
        <CollapsibleSection title="Professional Summary" icon={FileText}>
          <div className="space-y-4">
            {suggestions[0]?.suggestions?.summary?.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Skills Improvements */}
        <CollapsibleSection title="Skills Section Optimization" icon={Code}>
          <div className="space-y-4">
            {suggestions[0]?.suggestions?.skills?.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Experience Improvements */}
        <CollapsibleSection title="Experience Section Enhancement" icon={Briefcase}>
          <div className="space-y-4">
            {suggestions[0]?.suggestions?.experience?.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Projects Guidance */}
        <CollapsibleSection title="Projects Section Strategy" icon={Target}>
          <div className="space-y-4">
            {suggestions[0]?.suggestions?.projects?.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* ATS Optimization */}
        <CollapsibleSection title="ATS Optimization Tips" icon={TrendingUp}>
          <div className="space-y-4">
            {suggestions[0]?.suggestions?.ats?.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Before/After Bullet Transformations */}
        <CollapsibleSection title="Bullet Point Transformations" icon={Lightbulb}>
          <div className="space-y-6">
            {[
              {
                before: 'Worked on the frontend of the website',
                after: `Developed responsive web interfaces using React and Tailwind CSS, improving load time by 40% and enhancing user engagement`,
                improvement: 'Added specific technologies, quantified impact, and focused on results'
              },
              {
                before: 'Helped with bug fixes',
                after: `Debugged and resolved 50+ production issues, reducing system downtime by 30% through proactive monitoring`,
                improvement: 'Quantified contributions and demonstrated impact on system reliability'
              },
              {
                before: 'Part of the development team',
                after: `Collaborated with cross-functional team of 8 to deliver features, meeting 100% of sprint commitments`,
                improvement: 'Specified role, team size, and measurable outcomes'
              }
            ].map((item, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-xl p-6">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-red-600 uppercase">Before</span>
                  <p className="text-gray-700 mt-1 line-through">{item.before}</p>
                </div>
                <div className="mb-4">
                  <span className="text-xs font-semibold text-green-600 uppercase">After</span>
                  <p className="text-gray-900 font-medium mt-1">{item.after}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-xs font-semibold text-blue-600 uppercase">Why It's Better</span>
                  <p className="text-gray-600 text-sm mt-1">{item.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Project Ideas */}
        <CollapsibleSection title="Project Ideas to Build" icon={Code}>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedRoles.map((role) => (
              <div key={role.id} className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
                <h3 className="font-semibold text-gray-900 mb-3">{role.title}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2"></div>
                    <span className="text-gray-700 text-sm">
                      Build a portfolio project showcasing {role.skills.slice(0, 3).join(', ')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2"></div>
                    <span className="text-gray-700 text-sm">
                      Create an application solving a real-world problem
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2"></div>
                    <span className="text-gray-700 text-sm">
                      Contribute to open-source projects using {role.skills[0]}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Learning Resources */}
        <CollapsibleSection title="Learning Resources" icon={BookOpen}>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedRoles.map((role) => (
              <div key={role.id} className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{role.title} Learning Path</h3>
                <div className="space-y-3 mt-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Master {role.skills[0]}</p>
                      <p className="text-sm text-gray-600">Complete tutorials and build projects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Code className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Build Portfolio Projects</p>
                      <p className="text-sm text-gray-600">Create 3-5 showcase projects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Earn Certifications</p>
                      <p className="text-sm text-gray-600">Get certified in key technologies</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-center mt-12"
        >
          <button
            onClick={() => navigate('/analysis')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Analysis
          </button>

          <button
            onClick={() => navigate('/select-roles')}
            className="gradient-button text-lg inline-flex items-center gap-2"
          >
            Select Different Roles
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default ImprovementGuide;
