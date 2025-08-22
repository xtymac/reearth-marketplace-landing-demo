import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Marketplace from './components/Marketplace';
import PluginDetail from './components/PluginDetail';
import Login from './components/Login';
import PluginUpload from './components/PluginUpload';
import PluginSubmissionSuccess from './components/PluginSubmissionSuccess';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import DeveloperPortalEntry from './components/DeveloperPortalEntry';
import DeveloperPortal from './components/DeveloperPortal';
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
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/plugins/new" 
            element={
              <ProtectedRoute>
                <PluginUpload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/plugin/new" 
            element={
              <ProtectedRoute>
                <PluginUpload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/developer-portal/new" 
            element={
              <ProtectedRoute>
                <PluginUpload />
              </ProtectedRoute>
            } 
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
            path="/workspace/:workspaceId" 
            element={
              <ProtectedRoute>
                <Workspace />
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