import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TemplateSelection from './components/FormBuilder/TemplateSelection';
import DataTable from './components/DataTable';
import FormBuilder from './components/FormBuilder/FormBuilder';
import TemplatePreview from './components/FormBuilder/TemplatePreview';
import MainDashboard from './components/MainDashboard';
import './charts/ChartjsConfig';
// Import pages
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import LandingPage from './pages/LandingPage'; 
import FormCreation from "./pages/FormCreation";

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

const App = () => {
  return (
    <Router>
      <ScrollToTop /> {/* Ensure scroll resets on route change */}
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1">
          <Routes>
            <Route path="/MainDashboard" element={<MainDashboard />} />
            <Route path="/templateSelection" element={<TemplateSelection />} />
            <Route path="/preview" element={<TemplatePreview />} />
            <Route path="/workspace/:id" element={<DataTable />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/form-creation" element={<FormCreation/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
