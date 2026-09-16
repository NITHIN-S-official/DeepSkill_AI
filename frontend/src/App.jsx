import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ResumeUpload from './pages/ResumeUpload';
import RoleSelection from './pages/RoleSelection';
import AnalysisResults from './pages/AnalysisResults';
import ImprovementGuide from './pages/ImprovementGuide';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [resumeMetadata, setResumeMetadata] = useState({ fileName: '', fileSize: 0, wordCount: 0 });
  const navigate = useNavigate();

  const handleResumeUpload = (text, metadata) => {
    setResumeText(text);
    if (metadata) {
      setResumeMetadata(metadata);
    }
  };

  const handleRolesSelected = (roles) => {
    setSelectedRoles(roles);
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
  };

  const handleReset = () => {
    setResumeText('');
    setSelectedRoles([]);
    setAnalysisResults(null);
    setResumeMetadata({ fileName: '', fileSize: 0, wordCount: 0 });
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/upload" 
          element={
            <ResumeUpload 
              onResumeUpload={handleResumeUpload}
              resumeText={resumeText}
            />
          } 
        />
        <Route 
          path="/select-roles" 
          element={
            <RoleSelection 
              resumeText={resumeText}
              selectedRoles={selectedRoles}
              onRolesSelected={handleRolesSelected}
            />
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <AnalysisResults 
              resumeText={resumeText}
              selectedRoles={selectedRoles}
              analysisResults={analysisResults}
              onAnalysisComplete={handleAnalysisComplete}
              onReset={handleReset}
            />
          } 
        />
        <Route 
          path="/improvement-guide" 
          element={
            <ImprovementGuide 
              analysisResults={analysisResults}
              selectedRoles={selectedRoles}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
