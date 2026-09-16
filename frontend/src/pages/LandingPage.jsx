import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Award, Upload, Search, CheckCircle, Users, Briefcase, Zap } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Role-Based Analysis',
      description: 'Get personalized insights for up to 5 target roles simultaneously'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Compatibility Scoring',
      description: 'Understand your match percentage with detailed skill breakdowns'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'ATS Optimization',
      description: 'Improve your resume for Applicant Tracking Systems'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Suggestions',
      description: 'Get intelligent recommendations to enhance your resume'
    }
  ];

  const steps = [
    {
      icon: <Upload className="w-12 h-12" />,
      title: 'Upload Resume',
      description: 'Upload your resume in PDF, DOC, DOCX, or TXT format, or paste it directly'
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: 'Select Target Roles',
      description: 'Choose 1-5 roles you\'re targeting from our database of 100+ positions'
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: 'Get AI Analysis & Suggestions',
      description: 'Receive detailed compatibility scores, skill gaps, and improvement recommendations'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-200 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Online AI-Powered Analysis
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white-900">Transform Your Resume</span>
              <br />
              <span className="text-white-900">Land Your Dream Job</span>
            </h1>
            
            <p className="text-xl text-white-600 mb-10 max-w-3xl mx-auto">
              Get AI-powered insights on your placement readiness. Analyze your resume against target roles, 
              identify skill gaps, and receive personalized improvement suggestions.
            </p>
            
            <motion.button
              onClick={() => navigate('/upload')}
              className="gradient-button text-lg inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              Analyze Your Resume
            </motion.button>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white-900">
              Powerful Features for <span className="text-white-900">Career Success</span>
            </h2>
            <p className="text-lg text-white-600">
              Everything you need to optimize your resume and ace your placements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="card p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white-900">{feature.title}</h3>
                <p className="text-white-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-60">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white-900">
              How It <span className="text-white-900">Works</span>
            </h2>
            <p className="text-lg text-white-600">
              Three simple steps to resume excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card p-8 text-center h-full">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-6 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold flex items-center justify-center text-xl shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white-900">{step.title}</h3>
                  <p className="text-white-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Students Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white-900">
                Built for <span className="text-white-900">Students & Job Seekers</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Placement Focused</h3>
                    <p className="text-white-600">
                      Designed specifically for campus placements and entry-level positions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Beginner Friendly</h3>
                    <p className="text-white-600">
                      Clear, actionable guidance even if you're new to resume building
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Role-Based Guidance</h3>
                    <p className="text-white-600">
                      Tailored advice for 100+ different job roles across multiple domains
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card p-8 bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                    <span className="text-lg">100+ Job Roles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                    <span className="text-lg">Completely Offline</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                    <span className="text-lg">No API Keys Required</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                    <span className="text-lg">Instant Analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                    <span className="text-lg">Detailed Suggestions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                    <span className="text-lg">ATS Optimization</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Resume?
            </h2>
            <p className="text-xl text-primary-100 mb-10">
              Start your journey to placement success today with AI-powered insights
            </p>
            <motion.button
              onClick={() => navigate('/upload')}
              className="bg-white text-primary-600 font-semibold py-4 px-10 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 text-lg inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              Analyze Your Resume Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white-400 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            © 2026 DeepSkill AI. Built for Safe Tech Day. Completely offline, no API keys required.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
