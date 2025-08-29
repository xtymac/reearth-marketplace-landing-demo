import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Marketplace from './components/Marketplace';
import PluginDetail from './components/PluginDetail';
import Login from './components/Login';
import PluginSubmissionSuccess from './components/PluginSubmissionSuccess';
import DeveloperConsoleEntry from './components/DeveloperConsoleEntry';
import DeveloperConsole from './components/DeveloperConsole';
import DeveloperConsoleUpload from './components/DeveloperConsoleUpload';
import DashboardNotAvailable from './components/DashboardNotAvailable';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import WorkspacePluginEdit from './components/WorkspacePluginEdit';
import ManagePlugins from './components/ManagePlugins';
import LikedPlugins from './components/LikedPlugins';
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
          
          {/* Dashboard Routes - from Version_2 */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Developer Console Routes - from Version_1 */}
          <Route 
            path="/developer-console" 
            element={<DeveloperConsoleEntry />}
          />
          <Route 
            path="/developer-console/workspace" 
            element={<DeveloperConsole />}
          />
          <Route 
            path="/developer-console/workspace/:pluginId" 
            element={<DeveloperConsole />}
          />
          <Route 
            path="/developer-console/new" 
            element={
              <ProtectedRoute>
                <DeveloperConsoleUpload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/developer-console/submit" 
            element={
              <ProtectedRoute>
                <DeveloperConsoleUpload />
              </ProtectedRoute>
            } 
          />
          
          {/* Workspace Routes - from Version_2 */}
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
          
          {/* Plugin Management Routes - from Version_2 */}
          <Route 
            path="/liked-plugins" 
            element={
              <ProtectedRoute>
                <LikedPlugins />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy Routes - from Version_1 */}
          <Route 
            path="/plugin/new/success" 
            element={
              <ProtectedRoute>
                <PluginSubmissionSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit" 
            element={
              <ProtectedRoute>
                <DeveloperConsole />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect legacy routes to new developer console route */}
          <Route 
            path="/plugins/new" 
            element={<Navigate to="/developer-console/new" replace />}
          />
          <Route 
            path="/plugin/new" 
            element={<Navigate to="/developer-console/new" replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;