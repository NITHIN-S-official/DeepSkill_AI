import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, AlertCircle, Lightbulb, ArrowRight, RefreshCw, ChevronLeft, Info } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/api.js';

function CircularProgress({ score, size = 120 }) {
  const [displayScore, setDisplayScore] = useState(0);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = score / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke={getColor(displayScore)}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: getColor(displayScore) }}>
          {displayScore}%
        </span>
        <span className="text-xs text-gray-600">Match</span>
      </div>
    </div>
  );
}

function AnalysisResults({ resumeText, selectedRoles, analysisResults, onAnalysisComplete, onReset }) {
  const [results, setResults] = useState(analysisResults);
  const [loading, setLoading] = useState(!analysisResults);
  const [error, setError] = useState('');
  const [fallbackInfo, setFallbackInfo] = useState({ fallback_used: false, fallback_reason: '', mode_used: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!resumeText || !selectedRoles || selectedRoles.length === 0) {
      navigate('/upload');
      return;
    }

    if (!results) {
      performAnalysis();
    }
  }, [resumeText, selectedRoles, results, navigate]);

  const performAnalysis = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, {
        resumeText,
        selectedRoles: selectedRoles.map(r => r.id)
      });

      if (response.data.success) {
        setResults(response.data.results);
        setFallbackInfo({
          fallback_used: response.data.fallback_used || false,
          fallback_reason: response.data.fallback_reason || '',
          mode_used: response.data.mode_used || 'unknown',
        });
        onAnalysisComplete(response.data.results);
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium mb-2">Analyzing Your Resume</p>
          <p className="text-gray-600">This won't take long...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={performAnalysis} className="gradient-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your <span className="text-white-900">Analysis Results</span>
          </h1>
          <p className="text-xl text-gray-600">
            Here's how you match with your target roles
          </p>
        </motion.div>

        {/* Fallback notification banner */}
        {fallbackInfo.fallback_used && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3"
          >
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-blue-700 text-sm">
              Analysis completed using Offline AI because the Online AI provider was unavailable.
            </p>
          </motion.div>
        )}

        {/* Results for Each Role */}
        <div className="space-y-8 mb-12">
          {results.map((result, index) => (
            <motion.div
              key={result.roleId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="card p-8"
            >
              {/* Role Header with Score */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {result.roleTitle}
                  </h2>
                  <p className="text-gray-600 text-lg">{result.analysis}</p>
                </div>
                <div className="flex-shrink-0">
                  <CircularProgress score={result.compatibilityScore} />
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Matching Skills */}
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Matching Skills</h3>
                  </div>
                  {result.matchingSkills.length > 0 ? (
                    <div className="space-y-2">
                      {result.matchingSkills.map(skill => (
                        <div key={skill} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No matching skills found</p>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Missing Skills</h3>
                  </div>
                  {result.missingSkills.length > 0 ? (
                    <div className="space-y-2">
                      {result.missingSkills.map(skill => (
                        <div key={skill} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">All key skills present</p>
                  )}
                </div>

                {/* Skills to Improve */}
                <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Skills to Improve</h3>
                  </div>
                  {result.skillsToImprove.length > 0 ? (
                    <div className="space-y-2">
                      {result.skillsToImprove.map(skill => (
                        <div key={skill} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">Strong skill representation</p>
                  )}
                </div>
              </div>

              {/* Tools to Learn */}
              {result.toolsToLearn.length > 0 && (
                <div className="mt-6 bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Recommended Tools to Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.toolsToLearn.map(tool => (
                      <span
                        key={tool}
                        className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg font-medium text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ATS Keywords */}
              {result.atsKeywords.length > 0 && (
                <div className="mt-6 bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ATS Keywords Found</h3>
                  <div className="flex flex-wrap gap-3">
                    {result.atsKeywords.slice(0, 10).map(({ keyword, count }) => (
                      <span
                        key={keyword}
                        className="px-4 py-2 bg-purple-200 text-purple-800 rounded-lg font-medium text-sm"
                      >
                        {keyword} <span className="text-purple-600">×{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Analyze Another Resume
          </button>

          <button
            onClick={() => navigate('/select-roles')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            Change Selected Roles
          </button>

          <button
            onClick={() => navigate('/improvement-guide')}
            className="gradient-button text-lg inline-flex items-center gap-2"
          >
            View Detailed Suggestions
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default AnalysisResults;
