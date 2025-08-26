import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Marketplace from './components/Marketplace';
import PluginDetail from './components/PluginDetail';
import Login from './components/Login';
import PluginSubmissionSuccess from './components/PluginSubmissionSuccess';
import DeveloperPortalEntry from './components/DeveloperPortalEntry';
import DeveloperPortal from './components/DeveloperPortal';
import DeveloperPluginUpload from './components/DeveloperPluginUpload';
import DashboardNotAvailable from './components/DashboardNotAvailable';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/plugin/:id" element={<PluginDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardNotAvailable />} />
          <Route 
            path="/developer-portal/new" 
            element={
              <ProtectedRoute>
                <DeveloperPluginUpload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/developer-portal/submit" 
            element={
              <ProtectedRoute>
                <DeveloperPluginUpload />
              </ProtectedRoute>
            } 
          />
          {/* Redirect legacy routes to new developer portal route */}
          <Route 
            path="/plugins/new" 
            element={<Navigate to="/developer-portal/new" replace />}
          />
          <Route 
            path="/plugin/new" 
            element={<Navigate to="/developer-portal/new" replace />}
          />
          <Route 
            path="/plugin/new/success" 
            element={
              <ProtectedRoute>
                <PluginSubmissionSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/developer-portal" 
            element={<DeveloperPortalEntry />}
          />
          <Route 
            path="/developer-portal/workspace" 
            element={<DeveloperPortal />}
          />
          <Route 
            path="/developer-portal/workspace/:pluginId" 
            element={<DeveloperPortal />}
          />
          <Route 
            path="/edit" 
            element={
              <ProtectedRoute>
                <DeveloperPortal />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;