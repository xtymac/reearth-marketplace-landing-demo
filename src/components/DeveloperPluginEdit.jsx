import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardNav from './DashboardNav';
import { getCurrentUser } from '../services/authService';
import { getPluginById } from '../services/pluginService';
import '../PluginEdit.css';

function DeveloperPluginEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [plugin, setPlugin] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [visibility, setVisibility] = useState('public');
  const [showNewVersionEditor, setShowNewVersionEditor] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('local'); // 'local' or 'github'
  const [newVersionData, setNewVersionData] = useState({
    file: null,
    githubUrl: '',
    version: '',
    releaseNotes: '',
    labels: []
  });
  const sectionRefs = useRef({});
  const observerRef = useRef(null);
  const editContentRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '',
    tags: [],
    workspace: 'workspace-1'
  });

  const workspaces = [
    { id: 'workspace-1', name: 'Eukarya Inc.' },
    { id: 'workspace-2', name: 'Fukuyama Consultants' },
    { id: 'workspace-3', name: 'MIERUNE Inc.' },
    { id: 'workspace-4', name: 'AERO ASAHI' },
    { id: 'workspace-5', name: 'C DESIGN' },
    { id: 'workspace-6', name: 'Geolonia' },
    { id: 'workspace-7', name: 'Weather Data Co.' },
    { id: 'workspace-8', name: 'USIC Inc.' }
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    const pluginData = getPluginById(parseInt(id));
    if (pluginData) {
      setPlugin(pluginData);
      setFormData({
        title: pluginData.title,
        description: pluginData.description,
        version: pluginData.version,
        tags: pluginData.tags || [],
        workspace: pluginData.workspace || 'workspace-1'
      });
      setVisibility(pluginData.visibility || 'public');
    }
  }, [id, navigate]);

  // Smooth scroll to section within editor container
  const scrollToSection = (sectionId) => {
    const section = sectionRefs.current[sectionId];
    const container = editContentRef.current;
    
    if (section && container) {
      // Calculate offset for sticky header (24px padding + some buffer)
      const headerOffset = 32;
      const sectionTop = section.offsetTop - headerOffset;
      
      // Smooth scroll within the editor container
      container.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
      
      // Update active tab immediately for responsive feedback
      setActiveTab(sectionId);
      
      // Focus on section heading for accessibility after scroll completes
      setTimeout(() => {
        const heading = section.querySelector('.section-heading');
        if (heading) {
          heading.focus();
        }
      }, 300); // Wait for smooth scroll to complete
    }
  };

  // Setup scrollspy with IntersectionObserver
  useEffect(() => {
    const sections = ['general', 'readme', 'version', 'danger'];
    const container = editContentRef.current;
    
    if (!container) return;
    
    // Create observer with editor container as root
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the most visible section based on intersection ratio
        let mostVisible = null;
        let maxRatio = 0;
        
        // Check each entry to find the most visible one
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry;
          }
        });
        
        // If no section is intersecting significantly, find the closest to top
        if (!mostVisible || maxRatio < 0.1) {
          let closestEntry = null;
          let minDistance = Infinity;
          
          entries.forEach(entry => {
            const rect = entry.boundingClientRect;
            const containerRect = container.getBoundingClientRect();
            const distance = Math.abs(rect.top - containerRect.top);
            
            if (distance < minDistance) {
              minDistance = distance;
              closestEntry = entry;
            }
          });
          
          mostVisible = closestEntry;
        }
        
        if (mostVisible && mostVisible.target.id) {
          const sectionId = mostVisible.target.id.replace('section-', '');
          if (sections.includes(sectionId)) {
            setActiveTab(sectionId);
          }
        }
      },
      {
        root: container, // Use editor container as root
        rootMargin: '-32px 0px -60% 0px', // Account for header and prioritize top sections
        threshold: [0, 0.1, 0.3, 0.7] // Multiple thresholds for reliable detection
      }
    );

    // Observe all sections
    sections.forEach(section => {
      const element = sectionRefs.current[section];
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [plugin]); // Re-run when plugin loads

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const updatedPlugin = {
      ...plugin,
      ...formData,
      visibility,
      lastModified: new Date().toISOString()
    };
    
    console.log('Saving plugin:', updatedPlugin);
    navigate('/developer-portal');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) {
      console.log('Deleting plugin:', plugin.id);
      navigate('/developer-portal');
    }
  };

  const handleNewVersionInputChange = (e) => {
    const { name, value } = e.target;
    setNewVersionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setNewVersionData(prev => ({
      ...prev,
      file: file
    }));
  };

  const toggleVersionLabel = (label) => {
    setNewVersionData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  const handleSaveNewVersion = () => {
    // Basic form validation
    const isLocalUpload = uploadMethod === 'local';
    const hasFile = isLocalUpload ? newVersionData.file : newVersionData.githubUrl.trim();
    
    if (!hasFile) {
      alert(isLocalUpload ? 'Please select a file to upload.' : 'Please enter a GitHub repository URL.');
      return;
    }
    
    if (uploadMethod === 'github' && !newVersionData.githubUrl.match(/^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/)) {
      alert('Please enter a valid GitHub repository URL.');
      return;
    }
    
    if (!newVersionData.version.trim()) {
      alert('Please enter a version number.');
      return;
    }
    
    if (!newVersionData.releaseNotes.trim()) {
      alert('Please enter release notes describing what changed in this version.');
      return;
    }
    
    console.log('Saving new version:', newVersionData);
    alert('New version saved successfully!');
    
    // Here you would implement the actual save logic
    setShowNewVersionEditor(false);
    // Reset form
    setNewVersionData({
      file: null,
      githubUrl: '',
      version: '',
      releaseNotes: '',
      labels: []
    });
  };

  const handleCancelNewVersion = () => {
    setShowNewVersionEditor(false);
    setNewVersionData({
      file: null,
      githubUrl: '',
      version: '',
      releaseNotes: '',
      labels: []
    });
  };

  const handleDeleteNewVersion = () => {
    if (window.confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
      console.log('Deleting version');
      setShowNewVersionEditor(false);
    }
  };

  if (!plugin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <DashboardNav />
      
      <div className="dashboard-content">
        <div className="plugin-edit-header">
          <div className="breadcrumb">
            <Link to="/developer-portal">Developer Portal</Link>
            <span className="separator">›</span>
            <span>{plugin.title}</span>
          </div>
          <h1 className="dashboard-title">Edit Plugin</h1>
        </div>

        <div className="plugin-edit-container">
          <div className="edit-sidebar">
            <div className="sidebar-section">
              <h3>Plugin Settings</h3>
              <nav className="sidebar-nav">
                <button
                  className={`sidebar-item ${activeTab === 'general' ? 'active' : ''}`}
                  onClick={() => scrollToSection('general')}
                  aria-current={activeTab === 'general' ? 'page' : undefined}
                >
                  General
                </button>
                <button
                  className={`sidebar-item ${activeTab === 'readme' ? 'active' : ''}`}
                  onClick={() => scrollToSection('readme')}
                  aria-current={activeTab === 'readme' ? 'page' : undefined}
                >
                  README
                </button>
                <button
                  className={`sidebar-item ${activeTab === 'version' ? 'active' : ''}`}
                  onClick={() => scrollToSection('version')}
                  aria-current={activeTab === 'version' ? 'page' : undefined}
                >
                  Version History
                </button>
                <button
                  className={`sidebar-item ${activeTab === 'danger' ? 'active' : ''}`}
                  onClick={() => scrollToSection('danger')}
                  aria-current={activeTab === 'danger' ? 'page' : undefined}
                >
                  Danger Zone
                </button>
              </nav>
            </div>

            <div className="visibility-settings">
              <h3>Visibility Status</h3>
              <div className="visibility-toggle-group">
                <button
                  className={`visibility-btn ${visibility === 'draft' ? 'active' : ''}`}
                  onClick={() => setVisibility('draft')}
                >
                  Draft
                </button>
                <button
                  className={`visibility-btn ${visibility === 'private' ? 'active' : ''}`}
                  onClick={() => setVisibility('private')}
                >
                  Private
                </button>
                <button
                  className={`visibility-btn ${visibility === 'public' ? 'active' : ''}`}
                  onClick={() => setVisibility('public')}
                >
                  Public
                </button>
              </div>
              <p className="visibility-description">
                {visibility === 'draft' && 'Not visible to others'}
                {visibility === 'private' && 'Visible only to workspace members'}
                {visibility === 'public' && 'Visible in the Marketplace'}
              </p>
            </div>
          </div>

          <div className="edit-content" ref={editContentRef}>
            <div className="tab-content" id="section-general" ref={el => sectionRefs.current['general'] = el}>
              <h2 className="section-heading" tabIndex="-1">General Settings</h2>
              <div className="divider"></div>

              <div className="form-group">
                <label htmlFor="workspace">Workspace</label>
                <select
                  id="workspace"
                  name="workspace"
                  value={formData.workspace}
                  onChange={handleInputChange}
                >
                  {workspaces.map(workspace => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title">Plugin Name</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="version">Version</label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>

            <div className="tab-content" id="section-readme" ref={el => sectionRefs.current['readme'] = el}>
              <h2 className="section-heading" tabIndex="-1">README</h2>
              <div className="divider"></div>
              <p>Edit your plugin's documentation here.</p>
              <textarea
                className="readme-editor"
                placeholder="Enter your README content in Markdown format..."
                rows="15"
              />
              <div className="form-actions">
                <button className="btn-save" onClick={handleSave}>
                  Save README
                </button>
              </div>
            </div>

            <div className="tab-content" id="section-version" ref={el => sectionRefs.current['version'] = el}>
              <div className="section-header">
                <h2 className="section-heading" tabIndex="-1">Version History</h2>
                <button 
                  className="btn-new-version"
                  onClick={() => setShowNewVersionEditor(!showNewVersionEditor)}
                >
                  New version
                </button>
              </div>
              <div className="divider"></div>
              
              <div className="version-list">
                {/* New Version Card - appears at top when editing */}
                {showNewVersionEditor && (
                  <div className="version-card new-version-card">
                    <h3 className="version-card-title">Upload a new version</h3>
                    
                    <div className="version-form-group">
                      <label className="version-form-label">Plugin File <span className="required">*</span></label>
                      <div className="upload-method-tabs">
                        <button 
                          className={`upload-tab ${uploadMethod === 'local' ? 'active' : ''}`}
                          onClick={() => setUploadMethod('local')}
                        >
                          Upload from local
                        </button>
                        <button 
                          className={`upload-tab ${uploadMethod === 'github' ? 'active' : ''}`}
                          onClick={() => setUploadMethod('github')}
                        >
                          GitHub
                        </button>
                      </div>
                      
                      {uploadMethod === 'local' ? (
                        <div className="file-upload-area">
                          <input
                            type="file"
                            id="plugin-file"
                            accept=".zip"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="plugin-file" className="file-upload-label">
                            <div className="upload-icon">📁</div>
                            <div className="upload-text">
                              {newVersionData.file ? newVersionData.file.name : 'Click or drag file to this area to upload'}
                            </div>
                            <div className="upload-subtext">ZIP file up to 50MB</div>
                          </label>
                          {newVersionData.file && (
                            <div className="file-attached">
                              📎 {newVersionData.file.name}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="github-input">
                          <input
                            type="url"
                            name="githubUrl"
                            value={newVersionData.githubUrl}
                            onChange={handleNewVersionInputChange}
                            placeholder="https://github.com/username/repository"
                            className="github-url-input"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="version-form-group">
                      <label htmlFor="new-version" className="version-form-label">Version</label>
                      <input
                        type="text"
                        id="new-version"
                        name="version"
                        value={newVersionData.version || 'Version 1.0.0'}
                        onChange={handleNewVersionInputChange}
                        placeholder="Version 1.0.0"
                        className="version-input-field"
                        readOnly
                      />
                      <p className="version-note">
                        Version numbers are automatically loaded from the plugin's YML file — see <a href="#" className="doc-link">documentation</a> for details.
                      </p>
                    </div>
                    
                    <div className="version-form-group">
                      <label htmlFor="release-notes" className="version-form-label">Release Notes</label>
                      <textarea
                        id="release-notes"
                        name="releaseNotes"
                        value={newVersionData.releaseNotes}
                        onChange={handleNewVersionInputChange}
                        placeholder="Type your message"
                        rows="4"
                        className="release-notes-textarea"
                      />
                      <p className="release-notes-description">
                        Describe what changed in this version for users
                      </p>
                    </div>
                    
                    <div className="version-form-group">
                      <label className="version-form-label">Version Labels</label>
                      <div className="version-labels">
                        {[{ name: 'Bug Fix', color: 'red' }, { name: 'New Feature', color: 'green' }, { name: 'Doc Update', color: 'blue' }, { name: 'UI Update', color: 'purple' }].map(label => (
                          <button
                            key={label.name}
                            className={`version-label version-label-${label.color} ${newVersionData.labels.includes(label.name) ? 'selected' : ''}`}
                            onClick={() => toggleVersionLabel(label.name)}
                          >
                            {label.name}
                            {newVersionData.labels.includes(label.name) && <span className="label-remove">×</span>}
                          </button>
                        ))}
                      </div>
                      <p className="labels-description">
                        Choose labels to describe this update (e.g., bug fix, new feature).
                      </p>
                    </div>
                    
                    <div className="new-version-actions">
                      <button className="btn-save-version" onClick={handleSaveNewVersion}>
                        Save
                      </button>
                      <button className="btn-cancel-version" onClick={handleCancelNewVersion}>
                        Cancel
                      </button>
                      <button className="btn-delete-version" onClick={handleDeleteNewVersion}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Existing Version Cards */}
                <div className="version-card existing-version-card">
                  <h3 className="version-card-title">{formData.version}</h3>
                  <p className="version-date">Current version - {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="tab-content" id="section-danger" ref={el => sectionRefs.current['danger'] = el}>
              <h2 className="section-heading" tabIndex="-1">Danger Zone</h2>
              <div className="divider"></div>
              <div className="danger-zone">
                <h3>Delete this plugin</h3>
                <p>Once you delete a plugin, there is no going back. Please be certain.</p>
                <button className="btn-danger" onClick={handleDelete}>
                  Delete Plugin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperPluginEdit;