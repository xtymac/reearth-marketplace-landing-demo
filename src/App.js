import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Marketplace from './components/Marketplace';
import PluginDetail from './components/PluginDetail';
import Login from './components/Login';
import PluginUpload from './components/PluginUpload';
import PluginEdit from './components/PluginEdit';
import Dashboard from './components/Dashboard';
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
            path="/plugin/:id/edit" 
            element={
              <ProtectedRoute>
                <PluginEdit />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;