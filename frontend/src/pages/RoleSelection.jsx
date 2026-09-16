import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, CheckCircle, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/api.js';


function RoleSelection({ resumeText, selectedRoles: initialSelectedRoles, onRolesSelected }) {
  const [roles, setRoles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoles, setSelectedRoles] = useState(initialSelectedRoles || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!resumeText) {
      navigate('/upload');
      return;
    }
    fetchRolesAndCategories();
  }, [resumeText, navigate]);
  
  const fetchRolesAndCategories = async () => {
    try {
      const [rolesRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/api/roles`),
        axios.get(`${API_URL}/api/categories`)
      ]);

      setRoles(rolesRes.data.roles);
      setCategories(['All', ...categoriesRes.data.categories]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to load roles. Please try again.');
      setLoading(false);
    }
  };

  const handleRoleToggle = (role) => {
    setSelectedRoles(prev => {
      const isSelected = prev.find(r => r.id === role.id);
      
      if (isSelected) {
        return prev.filter(r => r.id !== role.id);
      } else {
        if (prev.length >= 5) {
          setError('Maximum 5 roles can be selected');
          setTimeout(() => setError(''), 3000);
          return prev;
        }
        return [...prev, role];
      }
    });
  };

  const handleRemoveRole = (roleId) => {
    setSelectedRoles(prev => prev.filter(r => r.id !== roleId));
  };

  const handleAnalyze = () => {
    if (selectedRoles.length === 0) {
      setError('Please select at least one role');
      return;
    }
    
    onRolesSelected(selectedRoles);
    navigate('/analysis');
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Select <span className="text-white-900">Target Roles</span>
          </h1>
          <p className="text-xl text-gray-600">
            Choose 1-5 roles you're targeting for analysis
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search roles, categories, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Roles Section */}
        {selectedRoles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Roles ({selectedRoles.length}/5)
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedRoles.map(role => (
                <motion.div
                  key={role.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-primary-300 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                  <span className="font-medium text-gray-900">{role.title}</span>
                  <button
                    onClick={() => handleRemoveRole(role.id)}
                    className="ml-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRoles.map((role, index) => {
            const isSelected = selectedRoles.find(r => r.id === role.id);
            
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => handleRoleToggle(role)}
                className={`card p-6 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-primary-500 bg-gradient-to-br from-primary-50 to-secondary-50'
                    : 'hover:shadow-xl'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-br from-primary-500 to-secondary-500'
                        : 'bg-gradient-to-br from-primary-100 to-secondary-100'
                    }`}>
                      <Briefcase className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-primary-600'}`} />
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {role.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {role.category}
                </p>

                <div className="flex flex-wrap gap-2">
                  {role.skills.slice(0, 4).map(skill => (
                    <span
                      key={skill}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        isSelected
                          ? 'bg-primary-200 text-primary-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {role.skills.length > 4 && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      +{role.skills.length - 4}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No roles found matching your search</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <AnimatePresence>
        {selectedRoles.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-primary-200 shadow-2xl z-50"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ready to analyze</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedRoles.length} {selectedRoles.length === 1 ? 'role' : 'roles'} selected
                  </p>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={selectedRoles.length === 0}
                  className="gradient-button text-lg inline-flex items-center gap-2"
                >
                  Analyze ({selectedRoles.length} {selectedRoles.length === 1 ? 'role' : 'roles'})
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoleSelection;
