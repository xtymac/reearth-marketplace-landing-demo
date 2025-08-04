import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Marketplace from './components/Marketplace';
import PluginDetail from './components/PluginDetail';
import './index.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/plugin/:id" element={<PluginDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;