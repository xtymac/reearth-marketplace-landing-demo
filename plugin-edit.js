// Plugin Edit Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror for markdown editing
    let markdownEditor = null;
    
    // Initialize markdown editor
    function initializeMarkdownEditor() {
        const textarea = document.getElementById('overviewMarkdown');
        if (textarea && typeof CodeMirror !== 'undefined') {
            markdownEditor = CodeMirror.fromTextArea(textarea, {
                mode: 'markdown',
                theme: 'github',
                lineNumbers: true,
                lineWrapping: true,
                autoCloseBrackets: true,
                matchBrackets: true,
                extraKeys: {
                    'Ctrl-Space': 'autocomplete'
                }
            });
            
            // Update preview when editor content changes
            markdownEditor.on('change', updateMarkdownPreview);
            
            // Initial preview update
            setTimeout(updateMarkdownPreview, 100);
        }
    }
    
    // Update markdown preview
    function updateMarkdownPreview() {
        const previewElement = document.getElementById('markdownPreview');
        if (previewElement && typeof marked !== 'undefined') {
            let content = '';
            if (markdownEditor) {
                content = markdownEditor.getValue();
            } else {
                const textarea = document.getElementById('overviewMarkdown');
                content = textarea ? textarea.value : '';
            }
            
            try {
                previewElement.innerHTML = marked.parse(content);
            } catch (error) {
                previewElement.innerHTML = '<p>Error rendering markdown preview</p>';
                console.error('Markdown parsing error:', error);
            }
        }
    }
    
    // Tab switching functionality
    function initializeEditorTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const editorContent = document.querySelector('.editor-content');
        const editorPane = document.getElementById('editorPane');
        const previewPane = document.getElementById('previewPane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update content display
                editorContent.classList.remove('split-view');
                editorPane.classList.remove('active');
                previewPane.classList.remove('active');
                
                switch(tab) {
                    case 'editor':
                        editorPane.classList.add('active');
                        if (markdownEditor) {
                            setTimeout(() => markdownEditor.refresh(), 10);
                        }
                        break;
                    case 'preview':
                        previewPane.classList.add('active');
                        updateMarkdownPreview();
                        break;
                    case 'split':
                        editorContent.classList.add('split-view');
                        editorPane.classList.add('active');
                        previewPane.classList.add('active');
                        updateMarkdownPreview();
                        if (markdownEditor) {
                            setTimeout(() => markdownEditor.refresh(), 10);
                        }
                        break;
                }
            });
        });
    }
    
    // Status toggle functionality
    function initializeStatusToggle() {
        const statusToggle = document.getElementById('statusToggle');
        const statusCard = document.getElementById('statusCard');
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (statusToggle && statusCard) {
            statusToggle.addEventListener('change', function() {
                const isPublic = this.checked;
                
                if (isPublic) {
                    // Show publish confirmation modal
                    showPublishModal();
                    
                    // Revert toggle until confirmed
                    this.checked = false;
                } else {
                    updateStatusDisplay(false);
                }
            });
        }
    }
    
    // Update status display
    function updateStatusDisplay(isPublic) {
        const statusCard = document.getElementById('statusCard');
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        const statusToggle = document.getElementById('statusToggle');
        
        if (isPublic) {
            statusCard.className = 'status-card public';
            statusCard.querySelector('.status-icon').textContent = '🌐';
            statusCard.querySelector('h3').textContent = 'Public Mode';
            statusCard.querySelector('p').textContent = 'Your plugin is published and visible to all users in the marketplace.';
            statusDot.className = 'status-dot public';
            statusText.textContent = 'Public';
            statusToggle.checked = true;
        } else {
            statusCard.className = 'status-card draft';
            statusCard.querySelector('.status-icon').textContent = '📝';
            statusCard.querySelector('h3').textContent = 'Draft Mode';
            statusCard.querySelector('p').textContent = 'Your plugin is currently in draft mode. Make your changes and publish when ready.';
            statusDot.className = 'status-dot draft';
            statusText.textContent = 'Draft';
            statusToggle.checked = false;
        }
    }
    
    // Show publish confirmation modal
    function showPublishModal() {
        const modal = document.getElementById('publishModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    // Hide publish modal
    function hidePublishModal() {
        const modal = document.getElementById('publishModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Image upload functionality
    function initializeImageUpload() {
        const imageInput = document.getElementById('pluginImages');
        const chooseFileBtn = document.getElementById('chooseFileBtn');
        const fileStatus = document.getElementById('fileStatus');
        const thumbnailsContainer = document.getElementById('imageThumbnails');
        
        // Handle choose file button click
        if (chooseFileBtn && imageInput) {
            chooseFileBtn.addEventListener('click', function() {
                imageInput.click();
            });
        }
        
        // Handle file selection
        if (imageInput) {
            imageInput.addEventListener('change', function() {
                const files = Array.from(this.files);
                if (files.length > 0) {
                    updateFileStatus(files.length);
                    files.forEach(file => {
                        if (file.type.startsWith('image/')) {
                            addImageThumbnail(file, thumbnailsContainer);
                        }
                    });
                }
            });
        }
        
        // Initialize existing thumbnail actions
        initializeThumbnailActions();
        
        // Update file status based on existing thumbnails
        if (thumbnailsContainer) {
            const existingCount = thumbnailsContainer.querySelectorAll('.thumbnail-item').length;
            updateFileStatus(existingCount);
        }
    }
    
    // Update file status text
    function updateFileStatus(fileCount) {
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) {
            if (fileCount === 1) {
                fileStatus.textContent = '1 file chosen';
            } else if (fileCount > 1) {
                fileStatus.textContent = `${fileCount} files chosen`;
            } else {
                fileStatus.textContent = 'No file chosen';
            }
        }
    }
    
    // Add image thumbnail
    function addImageThumbnail(file, container) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const thumbnailId = Date.now() + Math.random();
            const thumbnailItem = document.createElement('div');
            thumbnailItem.className = 'thumbnail-item';
            thumbnailItem.setAttribute('data-image-id', thumbnailId);
            
            thumbnailItem.innerHTML = `
                <img src="${e.target.result}" alt="Plugin Screenshot">
                <div class="thumbnail-overlay">
                    <button type="button" class="thumbnail-action set-primary" title="Set as Primary">⭐</button>
                    <button type="button" class="thumbnail-action remove" title="Remove">×</button>
                </div>
            `;
            
            // Add event listeners
            const primaryBtn = thumbnailItem.querySelector('.set-primary');
            const removeBtn = thumbnailItem.querySelector('.remove');
            
            primaryBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                setPrimaryImage(thumbnailItem);
            });
            
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                removeThumbnail(thumbnailItem);
            });
            
            container.appendChild(thumbnailItem);
        };
        reader.readAsDataURL(file);
    }
    
    // Initialize thumbnail actions for existing images
    function initializeThumbnailActions() {
        const thumbnailItems = document.querySelectorAll('.thumbnail-item');
        
        thumbnailItems.forEach(item => {
            const primaryBtn = item.querySelector('.set-primary');
            const removeBtn = item.querySelector('.remove');
            
            if (primaryBtn) {
                primaryBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    setPrimaryImage(item);
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    removeThumbnail(item);
                });
            }
        });
    }
    
    // Set primary image
    function setPrimaryImage(selectedItem) {
        const container = document.getElementById('imageThumbnails');
        
        // Remove primary status from all thumbnails
        container.querySelectorAll('.thumbnail-item').forEach(item => {
            item.classList.remove('primary-thumbnail');
            const existingIndicator = item.querySelector('.primary-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
        });
        
        // Set selected item as primary
        selectedItem.classList.add('primary-thumbnail');
        const primaryIndicator = document.createElement('div');
        primaryIndicator.className = 'primary-indicator';
        primaryIndicator.textContent = 'Primary';
        selectedItem.appendChild(primaryIndicator);
        
        updateFileStatus(container.querySelectorAll('.thumbnail-item').length);
    }
    
    // Remove thumbnail
    function removeThumbnail(thumbnailItem) {
        const container = document.getElementById('imageThumbnails');
        const wasPrimary = thumbnailItem.classList.contains('primary-thumbnail');
        
        thumbnailItem.remove();
        
        const remainingThumbnails = container.querySelectorAll('.thumbnail-item');
        updateFileStatus(remainingThumbnails.length);
        
        // If we removed the primary image, set the first remaining image as primary
        if (wasPrimary && remainingThumbnails.length > 0) {
            setPrimaryImage(remainingThumbnails[0]);
        }
    }
    
    
    // Version management functionality
    function initializeVersionManagement() {
        const fileInput = document.getElementById('pluginFile');
        const versionInput = document.getElementById('newVersion');
        const releaseNotesInput = document.getElementById('releaseNotes');
        const removeFileBtn = document.querySelector('.remove-file-btn');
        
        // Handle new version file upload
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    showNewFileInfo(file);
                    updatePreviewWithNewVersion();
                }
            });
        }
        
        // Handle version number input
        if (versionInput) {
            versionInput.addEventListener('input', function() {
                updatePreviewWithNewVersion();
                validateVersionNumber(this.value);
            });
        }
        
        // Handle release notes input
        if (releaseNotesInput) {
            releaseNotesInput.addEventListener('input', updatePreviewWithNewVersion);
        }
        
        // Handle remove file button
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', function() {
                clearNewFileInfo();
                updatePreviewWithNewVersion();
            });
        }
        
        // Initialize version action buttons
        initializeVersionActions();
    }
    
    // Show new file information
    function showNewFileInfo(file) {
        const fileInfo = document.getElementById('newFileInfo');
        const fileName = document.getElementById('newFileName');
        const fileSize = document.getElementById('newFileSize');
        const fileDate = document.getElementById('newFileDate');
        
        if (fileInfo && fileName && fileSize && fileDate) {
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            fileDate.textContent = 'Selected: ' + new Date().toLocaleDateString();
            fileInfo.style.display = 'flex';
        }
    }
    
    // Clear new file information
    function clearNewFileInfo() {
        const fileInfo = document.getElementById('newFileInfo');
        const fileInput = document.getElementById('pluginFile');
        
        if (fileInfo) {
            fileInfo.style.display = 'none';
        }
        
        if (fileInput) {
            fileInput.value = '';
        }
    }
    
    // Validate version number
    function validateVersionNumber(version) {
        const versionInput = document.getElementById('newVersion');
        const versionRegex = /^\d+\.\d+\.\d+$/;
        
        if (versionInput) {
            if (version && !versionRegex.test(version)) {
                versionInput.style.borderColor = '#ef4444';
                versionInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else {
                versionInput.style.borderColor = '#e0e0e0';
                versionInput.style.boxShadow = 'none';
            }
        }
    }
    
    // Update preview with new version information
    function updatePreviewWithNewVersion() {
        const previewNewVersion = document.getElementById('previewNewVersion');
        const newVersionNumber = document.getElementById('newVersionNumber');
        const versionInput = document.getElementById('newVersion');
        const fileInput = document.getElementById('pluginFile');
        
        if (previewNewVersion && newVersionNumber && versionInput) {
            const hasVersion = versionInput.value.trim();
            const hasFile = fileInput && fileInput.files.length > 0;
            
            if (hasVersion || hasFile) {
                previewNewVersion.style.display = 'block';
                newVersionNumber.textContent = versionInput.value || 'pending...';
                
                if (hasFile) {
                    newVersionNumber.textContent += ` (${fileInput.files[0].name})`;
                }
            } else {
                previewNewVersion.style.display = 'none';
            }
        }
    }
    
    // Initialize version action buttons
    function initializeVersionActions() {
        const downloadBtns = document.querySelectorAll('.download-btn');
        const rollbackBtns = document.querySelectorAll('.rollback-btn');
        
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const versionItem = this.closest('.version-item');
                const fileName = versionItem.querySelector('.file-name').textContent;
                showSuccessMessage(`Downloading ${fileName}...`);
                // In a real app, this would trigger the actual download
            });
        });
        
        rollbackBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const versionItem = this.closest('.version-item');
                const versionNumber = versionItem.querySelector('.version-number').textContent;
                
                if (confirm(`Are you sure you want to rollback to ${versionNumber}? This will make it the current version.`)) {
                    showRollbackModal(versionNumber);
                }
            });
        });
    }
    
    // Show rollback confirmation modal
    function showRollbackModal(version) {
        // Create a simple rollback modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Rollback to ${version}</h3>
                </div>
                <div class="modal-body">
                    <div class="warning-icon">⚠️</div>
                    <p>This will make ${version} the current published version. Users will immediately see this version in the marketplace.</p>
                    <p><strong>This action cannot be undone.</strong></p>
                </div>
                <div class="modal-actions">
                    <button class="primary-button confirm-rollback">Confirm Rollback</button>
                    <button class="secondary-button cancel-rollback">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle modal actions
        const confirmBtn = modal.querySelector('.confirm-rollback');
        const cancelBtn = modal.querySelector('.cancel-rollback');
        
        confirmBtn.addEventListener('click', function() {
            showSuccessMessage(`Successfully rolled back to ${version}`);
            modal.remove();
        });
        
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Update file information display
    function updateFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileName = fileInfo.querySelector('.file-name');
        const fileSize = fileInfo.querySelector('.file-size');
        const fileDate = fileInfo.querySelector('.file-date');
        
        if (fileName && fileSize && fileDate) {
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            fileDate.textContent = 'Last updated: ' + new Date().toLocaleDateString();
        }
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Form validation and preview updates
    function initializeFormValidation() {
        const form = document.getElementById('pluginEditForm');
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', updatePreview);
            input.addEventListener('change', updatePreview);
        });
        
        // Initial preview update
        updatePreview();
    }
    
    // Update plugin preview
    function updatePreview() {
        const previewName = document.getElementById('previewName');
        const previewDescription = document.getElementById('previewDescription');
        const previewTags = document.getElementById('previewTags');
        const previewFileName = document.getElementById('previewFileName');
        const previewFileSize = document.getElementById('previewFileSize');
        const previewType = document.getElementById('previewType');
        
        // Update name
        const nameInput = document.getElementById('pluginName');
        if (previewName && nameInput) {
            previewName.textContent = nameInput.value || 'Plugin Name';
        }
        
        // Update description
        const descInput = document.getElementById('description');
        if (previewDescription && descInput) {
            previewDescription.textContent = descInput.value || 'Plugin description will appear here';
        }
        
        // Update tags
        const tagsInput = document.getElementById('tags');
        if (previewTags && tagsInput) {
            const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            previewTags.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        }
        
        // Set fixed project type for visualizer
        if (previewType) {
            previewType.textContent = 'Visualizer';
        }
    }
    
    // Modal functionality
    function initializeModals() {
        // Publish modal
        const publishModal = document.getElementById('publishModal');
        const confirmPublishBtn = document.getElementById('confirmPublish');
        const cancelPublishBtn = document.getElementById('cancelPublish');
        
        if (confirmPublishBtn) {
            confirmPublishBtn.addEventListener('click', function() {
                updateStatusDisplay(true);
                hidePublishModal();
                showSuccessMessage('Plugin published successfully!');
            });
        }
        
        if (cancelPublishBtn) {
            cancelPublishBtn.addEventListener('click', hidePublishModal);
        }
        
        // Confirmation modal
        const confirmationModal = document.getElementById('confirmationModal');
        const viewPluginBtn = document.getElementById('viewPlugin');
        const backToEditBtn = document.getElementById('backToEdit');
        
        if (viewPluginBtn) {
            viewPluginBtn.addEventListener('click', function() {
                window.location.href = 'plugin-detail.html';
            });
        }
        
        if (backToEditBtn) {
            backToEditBtn.addEventListener('click', function() {
                confirmationModal.style.display = 'none';
            });
        }
        
        // Close modals when clicking outside
        [publishModal, confirmationModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            }
        });
    }
    
    // Form submission
    function initializeFormSubmission() {
        const form = document.getElementById('pluginEditForm');
        const submitBtn = form.querySelector('.submit-button');
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(false);
            });
        }
        
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', function() {
                handleFormSubmission(true);
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                    window.location.href = 'workspace-plugins.html';
                }
            });
        }
    }
    
    // Handle form submission
    function handleFormSubmission(isDraft) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const confirmationModal = document.getElementById('confirmationModal');
        
        // Show loading
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Simulate API call
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            
            if (isDraft) {
                showSuccessMessage('Plugin saved as draft successfully!');
            } else {
                if (confirmationModal) {
                    confirmationModal.style.display = 'flex';
                }
            }
        }, 2000);
    }
    
    // Show success message
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <div>${message}</div>
                <button class="close-success">×</button>
            </div>
        `;
        
        successDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #10b981;
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            z-index: 9999;
            max-width: 400px;
        `;
        
        const successContent = successDiv.querySelector('.success-content');
        successContent.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
        `;
        
        const closeBtn = successDiv.querySelector('.close-success');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        `;
        
        closeBtn.addEventListener('click', () => successDiv.remove());
        
        document.body.appendChild(successDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
    
    // Error handling
    function showError(message) {
        const errorContainer = document.getElementById('errorMessages');
        const errorText = document.getElementById('errorText');
        
        if (errorContainer && errorText) {
            errorText.textContent = message;
            errorContainer.style.display = 'block';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        }
    }
    
    // Close error message
    const closeErrorBtn = document.getElementById('closeError');
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', function() {
            const errorContainer = document.getElementById('errorMessages');
            if (errorContainer) {
                errorContainer.style.display = 'none';
            }
        });
    }
    
    // Initialize all functionality
    function initialize() {
        try {
            initializeMarkdownEditor();
            initializeEditorTabs();
            initializeStatusToggle();
            initializeImageUpload();
            initializeVersionManagement();
            initializeFormValidation();
            initializeModals();
            initializeFormSubmission();
        } catch (error) {
            console.error('Initialization error:', error);
            showError('An error occurred while initializing the page. Please refresh and try again.');
        }
    }
    
    // Start initialization
    initialize();
    
    // Handle textarea fallback if CodeMirror fails to load
    setTimeout(() => {
        if (!markdownEditor) {
            const textarea = document.getElementById('overviewMarkdown');
            if (textarea) {
                textarea.addEventListener('input', updateMarkdownPreview);
                updateMarkdownPreview();
            }
        }
    }, 1000);
});