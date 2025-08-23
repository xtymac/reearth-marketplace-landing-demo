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
        const previewBtn = document.getElementById('previewBtn');
        
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
        
        if (previewBtn) {
            previewBtn.addEventListener('click', function() {
                // Navigate to plugin detail page with preview parameter
                window.location.href = 'plugin-detail.html?preview=1';
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
    
    // Changelog Editor Functionality
    function initializeChangelogEditor() {
        const toggleBtn = document.getElementById('toggleChangelogEditor');
        const changelogEditor = document.getElementById('changelogEditor');
        const changelogTabBtns = document.querySelectorAll('.changelog-editor-tabs .tab-btn');
        const changelogEditorPane = document.getElementById('changelogEditorPane');
        const changelogPreviewPane = document.getElementById('changelogPreviewPane');
        const changelogNotesTextarea = document.getElementById('changelogNotes');
        const changelogPreview = document.getElementById('changelogNotesPreview');

        // Initialize changelog data structure
        let changelogData = loadChangelogData();
        let currentEditingVersion = null;

        // Toggle changelog editor visibility
        if (toggleBtn && changelogEditor) {
            toggleBtn.addEventListener('click', function() {
                const isVisible = changelogEditor.style.display !== 'none';
                changelogEditor.style.display = isVisible ? 'none' : 'block';
                
                const toggleText = toggleBtn.querySelector('.toggle-text');
                const toggleIcon = toggleBtn.querySelector('.toggle-icon');
                
                if (isVisible) {
                    toggleText.textContent = 'Edit Changelog';
                    toggleIcon.textContent = '📝';
                } else {
                    toggleText.textContent = 'Hide Editor';
                    toggleIcon.textContent = '✖️';
                    // Set today's date as default
                    const dateInput = document.getElementById('changelogDate');
                    if (dateInput && !dateInput.value) {
                        dateInput.value = new Date().toISOString().split('T')[0];
                    }
                }
            });
        }

        // Changelog editor tabs
        changelogTabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                
                // Update active tab
                changelogTabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update content display
                changelogEditorPane.classList.remove('active');
                changelogPreviewPane.classList.remove('active');
                
                if (tab === 'editor') {
                    changelogEditorPane.classList.add('active');
                } else if (tab === 'preview') {
                    changelogPreviewPane.classList.add('active');
                    updateChangelogPreview();
                }
            });
        });

        // Update changelog preview
        if (changelogNotesTextarea) {
            changelogNotesTextarea.addEventListener('input', updateChangelogPreview);
        }

        function updateChangelogPreview() {
            if (changelogPreview && typeof marked !== 'undefined') {
                const content = changelogNotesTextarea.value || '';
                try {
                    changelogPreview.innerHTML = marked.parse(content);
                } catch (error) {
                    changelogPreview.innerHTML = '<p>Error rendering preview</p>';
                }
            }
        }

        // Initialize form actions
        initializeChangelogFormActions();
        initializeChangelogTools();
        initializeExpandableNotes();
        initializeEditChangelogButtons();
    }

    function initializeChangelogFormActions() {
        const addBtn = document.getElementById('addChangelogEntry');
        const updateBtn = document.getElementById('updateChangelogEntry');
        const cancelBtn = document.getElementById('cancelEditChangelog');
        const clearBtn = document.getElementById('clearChangelogForm');

        if (addBtn) {
            addBtn.addEventListener('click', addChangelogEntry);
        }

        if (updateBtn) {
            updateBtn.addEventListener('click', updateChangelogEntry);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', cancelChangelogEdit);
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', clearChangelogForm);
        }
    }

    function initializeChangelogTools() {
        const exportMarkdownBtn = document.getElementById('exportMarkdown');
        const exportJsonBtn = document.getElementById('exportJson');
        const generateChangelogBtn = document.getElementById('generateChangelog');
        const importChangelogBtn = document.getElementById('importChangelog');
        const importFileInput = document.getElementById('importChangelogFile');

        if (exportMarkdownBtn) {
            exportMarkdownBtn.addEventListener('click', exportChangelogAsMarkdown);
        }

        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', exportChangelogAsJson);
        }

        if (generateChangelogBtn) {
            generateChangelogBtn.addEventListener('click', generateChangelogFromGit);
        }

        if (importChangelogBtn) {
            importChangelogBtn.addEventListener('click', () => importFileInput.click());
        }

        if (importFileInput) {
            importFileInput.addEventListener('change', importChangelogFile);
        }
    }

    function initializeExpandableNotes() {
        const expandBtns = document.querySelectorAll('.expand-notes-btn');
        
        expandBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const version = this.getAttribute('data-version');
                const versionItem = document.querySelector(`[data-version="${version}"]`);
                const detailedNotes = versionItem.querySelector('.notes-detailed');
                const isExpanded = detailedNotes.style.display !== 'none';
                
                detailedNotes.style.display = isExpanded ? 'none' : 'block';
                this.textContent = isExpanded ? 'Show Details' : 'Hide Details';
            });
        });
    }

    function initializeEditChangelogButtons() {
        const editBtns = document.querySelectorAll('.edit-changelog-btn');
        
        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const version = this.getAttribute('data-version');
                editChangelogEntry(version);
            });
        });
    }

    function loadChangelogData() {
        // In a real app, this would load from an API or local storage
        return {
            '1.2.0': {
                version: '1.2.0',
                date: '2024-01-15',
                type: 'minor',
                notes: `## What's New
- Enhanced rendering engine with 40% better performance
- New advanced material system with PBR support
- Improved LOD (Level of Detail) management for large scenes
- Added real-time shadow mapping

## Bug Fixes
- Fixed memory leak in texture management
- Resolved camera controls on touch devices
- Fixed rendering artifacts on AMD graphics cards

## Breaking Changes
- Updated material configuration format (migration guide available)`
            },
            '1.1.0': {
                version: '1.1.0',
                date: '2023-12-10',
                type: 'minor',
                notes: `## Improvements
- Fixed rendering performance issues on older hardware
- Added new material options for realistic surfaces
- Improved compatibility with latest browsers
- Enhanced error handling and user feedback

## Bug Fixes
- Resolved texture loading issues in Safari
- Fixed coordinate system inconsistencies`
            },
            '1.0.0': {
                version: '1.0.0',
                date: '2023-11-15',
                type: 'major',
                notes: `## Features
- Core 3D building visualization engine
- Basic material support for buildings
- WebGL-based rendering system
- Integration with Re:Earth Visualizer
- Support for common 3D model formats

## Initial Capabilities
- Real-time 3D building rendering
- Camera controls and navigation
- Basic lighting system`
            }
        };
    }

    function addChangelogEntry() {
        const versionInput = document.getElementById('changelogVersion');
        const dateInput = document.getElementById('changelogDate');
        const typeInput = document.getElementById('changelogType');
        const notesInput = document.getElementById('changelogNotes');

        const version = versionInput.value.trim();
        const date = dateInput.value;
        const type = typeInput.value;
        const notes = notesInput.value.trim();

        if (!version || !date || !notes) {
            showError('Please fill in all required fields (Version, Date, and Release Notes)');
            return;
        }

        // Validate semantic versioning
        const versionRegex = /^\d+\.\d+\.\d+$/;
        if (!versionRegex.test(version)) {
            showError('Please use semantic versioning format (e.g., 1.2.3)');
            return;
        }

        // Add to version history
        addVersionToHistory(version, date, type, notes);
        
        clearChangelogForm();
        showSuccessMessage(`Version ${version} added to changelog successfully!`);
    }

    function updateChangelogEntry() {
        if (!currentEditingVersion) return;

        const versionInput = document.getElementById('changelogVersion');
        const dateInput = document.getElementById('changelogDate');
        const typeInput = document.getElementById('changelogType');
        const notesInput = document.getElementById('changelogNotes');

        const version = versionInput.value.trim();
        const date = dateInput.value;
        const type = typeInput.value;
        const notes = notesInput.value.trim();

        // Update the version in the display
        updateVersionInHistory(currentEditingVersion, version, date, type, notes);
        
        clearChangelogForm();
        cancelChangelogEdit();
        showSuccessMessage(`Version ${version} updated successfully!`);
    }

    function editChangelogEntry(version) {
        const changelogData = loadChangelogData();
        const versionData = changelogData[version];
        
        if (!versionData) return;

        // Fill form with existing data
        document.getElementById('changelogVersion').value = versionData.version;
        document.getElementById('changelogDate').value = versionData.date;
        document.getElementById('changelogType').value = versionData.type;
        document.getElementById('changelogNotes').value = versionData.notes;

        // Show/hide appropriate buttons
        document.getElementById('addChangelogEntry').style.display = 'none';
        document.getElementById('updateChangelogEntry').style.display = 'inline-block';
        document.getElementById('cancelEditChangelog').style.display = 'inline-block';

        // Store current editing version
        currentEditingVersion = version;

        // Show editor if hidden
        const changelogEditor = document.getElementById('changelogEditor');
        if (changelogEditor.style.display === 'none') {
            document.getElementById('toggleChangelogEditor').click();
        }

        showSuccessMessage(`Editing version ${version}. Make your changes and click Update.`);
    }

    function cancelChangelogEdit() {
        currentEditingVersion = null;
        
        // Show/hide appropriate buttons
        document.getElementById('addChangelogEntry').style.display = 'inline-block';
        document.getElementById('updateChangelogEntry').style.display = 'none';
        document.getElementById('cancelEditChangelog').style.display = 'none';
        
        clearChangelogForm();
    }

    function clearChangelogForm() {
        document.getElementById('changelogVersion').value = '';
        document.getElementById('changelogDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('changelogType').value = 'minor';
        document.getElementById('changelogNotes').value = '';
        
        // Clear preview
        const preview = document.getElementById('changelogNotesPreview');
        if (preview) preview.innerHTML = '';
    }

    function addVersionToHistory(version, date, type, notes) {
        const versionList = document.getElementById('versionHistoryList');
        
        // Create new version item
        const versionItem = document.createElement('div');
        versionItem.className = 'version-item';
        versionItem.setAttribute('data-version', version);
        
        const summary = extractSummaryFromNotes(notes);
        
        versionItem.innerHTML = `
            <div class="version-info">
                <div class="version-header">
                    <span class="version-number">v${version}</span>
                    <span class="version-status">New</span>
                    <span class="version-type-badge ${type}">${capitalizeFirst(type)}</span>
                </div>
                <div class="version-details">
                    <span class="file-name">plugin-v${version}.zip</span>
                    <span class="file-size">Pending upload</span>
                    <span class="file-date">Created: ${new Date(date).toLocaleDateString()}</span>
                </div>
                <div class="version-notes">
                    <div class="notes-header">
                        <strong>Release Notes:</strong>
                        <button class="expand-notes-btn" data-version="${version}">Show Details</button>
                    </div>
                    <div class="notes-summary">${summary}</div>
                    <div class="notes-detailed" style="display: none;">
                        <div class="changelog-content">
                            ${marked.parse(notes)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="version-actions">
                <button type="button" class="version-action-btn edit-changelog-btn" title="Edit Changelog" data-version="${version}">✏️</button>
            </div>
        `;
        
        // Insert at the beginning (after current version if exists)
        const currentVersionItem = versionList.querySelector('.current-version-item');
        if (currentVersionItem) {
            versionList.insertBefore(versionItem, currentVersionItem.nextSibling);
        } else {
            versionList.insertBefore(versionItem, versionList.firstChild);
        }
        
        // Initialize event listeners for the new item
        const expandBtn = versionItem.querySelector('.expand-notes-btn');
        const editBtn = versionItem.querySelector('.edit-changelog-btn');
        
        expandBtn.addEventListener('click', function() {
            const detailedNotes = versionItem.querySelector('.notes-detailed');
            const isExpanded = detailedNotes.style.display !== 'none';
            
            detailedNotes.style.display = isExpanded ? 'none' : 'block';
            this.textContent = isExpanded ? 'Show Details' : 'Hide Details';
        });
        
        editBtn.addEventListener('click', function() {
            editChangelogEntry(version);
        });
    }

    function updateVersionInHistory(oldVersion, newVersion, date, type, notes) {
        const versionItem = document.querySelector(`[data-version="${oldVersion}"]`);
        if (!versionItem) return;

        const summary = extractSummaryFromNotes(notes);
        
        // Update version number
        versionItem.setAttribute('data-version', newVersion);
        versionItem.querySelector('.version-number').textContent = `v${newVersion}`;
        versionItem.querySelector('.version-type-badge').textContent = capitalizeFirst(type);
        versionItem.querySelector('.version-type-badge').className = `version-type-badge ${type}`;
        
        // Update details
        versionItem.querySelector('.file-name').textContent = `plugin-v${newVersion}.zip`;
        versionItem.querySelector('.file-date').textContent = `Updated: ${new Date(date).toLocaleDateString()}`;
        
        // Update notes
        versionItem.querySelector('.notes-summary').textContent = summary;
        versionItem.querySelector('.changelog-content').innerHTML = marked.parse(notes);
        
        // Update expand button data attribute
        versionItem.querySelector('.expand-notes-btn').setAttribute('data-version', newVersion);
        versionItem.querySelector('.edit-changelog-btn').setAttribute('data-version', newVersion);
    }

    function extractSummaryFromNotes(notes) {
        // Extract first line or first bullet point as summary
        const lines = notes.split('\n').filter(line => line.trim());
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('- ') || line.startsWith('* ')) {
                return line.substring(2).trim();
            } else if (line && !line.startsWith('#')) {
                return line;
            }
        }
        return 'Version update with various improvements and fixes.';
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function exportChangelogAsMarkdown() {
        const changelogData = loadChangelogData();
        let markdown = '# Changelog\n\nAll notable changes to this plugin will be documented here.\n\n';
        
        // Sort versions in descending order
        const sortedVersions = Object.keys(changelogData).sort((a, b) => {
            const aVersion = a.split('.').map(Number);
            const bVersion = b.split('.').map(Number);
            
            for (let i = 0; i < Math.max(aVersion.length, bVersion.length); i++) {
                const aNum = aVersion[i] || 0;
                const bNum = bVersion[i] || 0;
                if (aNum !== bNum) return bNum - aNum;
            }
            return 0;
        });
        
        sortedVersions.forEach(version => {
            const data = changelogData[version];
            markdown += `## [${version}] - ${data.date}\n\n${data.notes}\n\n`;
        });
        
        downloadFile(`changelog.md`, markdown, 'text/markdown');
        showSuccessMessage('Changelog exported as Markdown!');
    }

    function exportChangelogAsJson() {
        const changelogData = loadChangelogData();
        const jsonData = JSON.stringify(changelogData, null, 2);
        
        downloadFile(`changelog.json`, jsonData, 'application/json');
        showSuccessMessage('Changelog exported as JSON!');
    }

    function generateChangelogFromGit() {
        // In a real implementation, this would call a Git API
        const mockGitData = [
            'v1.2.0: Enhanced rendering engine and performance improvements',
            'v1.1.0: Bug fixes and browser compatibility updates',
            'v1.0.0: Initial release'
        ];
        
        const generatedChangelog = mockGitData.join('\n');
        document.getElementById('changelogNotes').value = generatedChangelog;
        
        showSuccessMessage('Generated changelog from Git history! Review and edit as needed.');
    }

    function importChangelogFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            
            try {
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(content);
                    // Process JSON changelog data
                    showSuccessMessage('JSON changelog imported successfully!');
                } else {
                    // Process as markdown/text
                    document.getElementById('changelogNotes').value = content;
                    showSuccessMessage('Changelog file imported successfully!');
                }
            } catch (error) {
                showError('Error parsing changelog file. Please check the format.');
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    function downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Initialize all functionality
    function initialize() {
        try {
            initializeMarkdownEditor();
            initializeEditorTabs();
            initializeStatusToggle();
            initializeImageUpload();
            initializeVersionManagement();
            initializeChangelogEditor(); // Add changelog editor initialization
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