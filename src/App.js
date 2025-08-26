import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Marketplace from './components/Marketplace';
import PluginDetail from './components/PluginDetail';
import Login from './components/Login';
import PluginSubmissionSuccess from './components/PluginSubmissionSuccess';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import WorkspacePluginEdit from './components/WorkspacePluginEdit';
import ManagePlugins from './components/ManagePlugins';
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
            path="/workspace/:workspaceId/:pluginId" 
            element={
              <ProtectedRoute>
                <WorkspacePluginEdit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workspace/:workspaceId/plugins" 
            element={
              <ProtectedRoute>
                <ManagePlugins />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;