import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle2, X, Copy, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/api.js';


function ResumeUpload({ onResumeUpload, resumeText }) {
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'paste'
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState(resumeText || '');
  const [extractedText, setExtractedText] = useState(resumeText || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (resumeText) {
      setExtractedText(resumeText);
      if (uploadMode === 'paste') {
        setPastedText(resumeText);
      }
    }
  }, [resumeText, uploadMode]);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError('');
    setShowWarning(false);
    
    if (acceptedFiles.length === 0) {
      setError('Please upload a valid file (PDF, DOC, DOCX, or TXT)');
      return;
    }

    const uploadedFile = acceptedFiles[0];
    
    // Validate file size (10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setFile(uploadedFile);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await axios.post(
        `${API_URL}/api/parse-resume`,
        formData
      );
      // Get extracted text once
      const extracted = response.data.text || "";

      // Save locally for preview
      setExtractedText(extracted);

      // Save globally in App.jsx
      onResumeUpload(extracted);

      if (response.data.wordCount < 10) {
        // Not an error — just poor extraction
        setShowWarning(true);
        setError("");
        navigate("/paste-resume"); // or show inline CTA
      } else {
        setShowWarning(false);
        setError("");
      }

    } catch (err) {
      console.error("Upload failed:", err);

      // REAL errors only (network / server crash)
      setError(err.response?.data?.error || "Upload failed. Please try again.");
      setShowWarning(false);

    } finally {
      setLoading(false);
    }
  },[]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  });

  const handlePasteSubmit = () => {
    setError('');
    if (!pastedText.trim()) {
      setError('Please paste your resume text');
      return;
    }
    
    if (pastedText.trim().length < 100) {
      setError('Resume text seems too short. Please paste your complete resume.');
      return;
    }

    setExtractedText(pastedText.trim());
  };

  const handleClearFile = () => {
    setFile(null);
    setExtractedText('');
    setError('');
    setShowWarning(false);
  };

  const handleClearPaste = () => {
    setPastedText('');
    setExtractedText('');
    setError('');
  };

  const handleContinue = () => {
    if (!extractedText || extractedText.trim().length < 100) {
      setError('Please provide a valid resume before continuing');
      return;
    }
    
    onResumeUpload(extractedText);
    navigate('/select-roles');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

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
            Upload Your <span className="text-white-900">Resume</span>
          </h1>
          <p className="text-xl text-gray-600">
            Upload or paste your resume to begin the analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload/Paste Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Toggle Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setUploadMode('upload')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  uploadMode === 'upload'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300'
                }`}
              >
                <Upload className="w-5 h-5 inline mr-2" />
                Upload File
              </button>
              <button
                onClick={() => setUploadMode('paste')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  uploadMode === 'paste'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300'
                }`}
              >
                <Copy className="w-5 h-5 inline mr-2" />
                Paste Resume
              </button>
            </div>

            {/* Upload Mode */}
            {uploadMode === 'upload' && (
              <div className="card p-8">
                {!file ? (
                  <div
                    {...getRootProps()}
                    className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    {isDragActive ? (
                      <p className="text-lg font-medium text-primary-600">Drop your resume here...</p>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drag & drop your resume here
                        </p>
                        <p className="text-gray-500 mb-4">or click to browse</p>
                        <p className="text-sm text-gray-400">
                          Supported: PDF, DOC, DOCX, TXT (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={handleClearFile}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {loading && (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                      </div>
                    )}
                  </div>
                )}

                {showWarning && (
                  <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800">Text Extraction Issue</p>
                      <p className="text-sm text-yellow-700">
                        The PDF text extraction may be incomplete. Consider using "Paste Resume" for better results.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Paste Mode */}
            {uploadMode === 'paste' && (
              <div className="card p-8">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Paste Your Resume Text
                  </label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Copy and paste your complete resume here..."
                    className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                {pastedText && (
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                      {pastedText.length} characters
                    </p>
                    <button
                      onClick={handleClearPaste}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <button
                  onClick={handlePasteSubmit}
                  disabled={!pastedText.trim()}
                  className="gradient-button w-full"
                >
                  Process Resume Text
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Column - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card p-8 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">Resume Preview</h3>
              </div>

              {extractedText ? (
                <>
                  <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {extractedText}
                    </pre>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Word Count:</span>
                      <span className="font-semibold text-gray-900">
                        {extractedText.split(/\s+/).length} words
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Character Count:</span>
                      <span className="font-semibold text-gray-900">
                        {extractedText.length} characters
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Your resume preview will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* S-001: Sticky Select Roles Action Bar */}
        {extractedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-0 left-0 right-0 z-10 mt-8 py-4 px-4 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
          >
            <div className="max-w-7xl mx-auto text-center">
              <button
                onClick={handleContinue}
                className="gradient-button text-lg inline-flex items-center gap-2"
              >
                Select Roles
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;
