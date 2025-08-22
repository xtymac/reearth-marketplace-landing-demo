// Plugin Submission Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Form elements
  const form = document.getElementById('pluginSubmissionForm');
  const loginNotice = document.getElementById('loginNotice');
  const formFields = document.getElementById('formFields');
  const submitButton = form.querySelector('.submit-button');
  const buttonText = submitButton.querySelector('.button-text');
  const loadingSpinner = submitButton.querySelector('.loading-spinner');
  
  // File upload elements
  const fileUploadArea = document.getElementById('fileUploadArea');
  const fileInput = document.getElementById('pluginFile');
  const fileInfo = document.getElementById('fileInfo');
  
  // Image upload elements
  const imageUploadArea = document.getElementById('imageUploadArea');
  const imageInput = document.getElementById('pluginImages');
  const imageUploadContent = document.getElementById('imageUploadContent');
  const uploadedImagesGrid = document.getElementById('uploadedImagesGrid');
  
  // Form inputs
  const workspaceSelect = document.getElementById('workspace');
  const pluginNameInput = document.getElementById('pluginName');
  const descriptionInput = document.getElementById('description');
  const tagsInput = document.getElementById('tags');
  const projectTypeInputs = document.querySelectorAll('input[name="projectType"]');
  
  // Preview elements
  const pluginPreview = document.getElementById('pluginPreview');
  const previewName = document.getElementById('previewName');
  const previewType = document.getElementById('previewType');
  const previewDescription = document.getElementById('previewDescription');
  const previewTags = document.getElementById('previewTags');
  const previewFileName = document.getElementById('previewFileName');
  const previewFileSize = document.getElementById('previewFileSize');
  
  // Modal elements
  const confirmationModal = document.getElementById('confirmationModal');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorMessages = document.getElementById('errorMessages');
  const errorText = document.getElementById('errorText');
  const closeError = document.getElementById('closeError');
  const returnToWorkspace = document.getElementById('returnToWorkspace');
  const submitAnother = document.getElementById('submitAnother');
  
  // Login button
  const loginButton = loginNotice.querySelector('.login-button');
  
  // State variables
  let isLoggedIn = false;
  let selectedFile = null;
  let uploadedImages = [];
  let coverImageIndex = 0;
  
  // Initialize
  init();
  
  function init() {
    // Check login status (simulate login check)
    checkLoginStatus();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial form validation
    validateForm();
    
    // Initialize images grid
    renderUploadedImages();
  }
  
  function checkLoginStatus() {
    // Simulate login check - in real app, this would check authentication
    // For demo purposes, user can click login to simulate being logged in
    const isAuthenticated = localStorage.getItem('userLoggedIn') === 'true';
    
    if (isAuthenticated) {
      showForm();
    } else {
      showLoginNotice();
    }
  }
  
  function showLoginNotice() {
    loginNotice.style.display = 'flex';
    formFields.style.display = 'none';
    isLoggedIn = false;
  }
  
  function showForm() {
    loginNotice.style.display = 'none';
    formFields.style.display = 'block';
    
    // Show development resources section
    const developmentResources = document.getElementById('developmentResources');
    if (developmentResources) {
      developmentResources.style.display = 'block';
    }
    
    isLoggedIn = true;
    validateForm();
  }
  
  function setupEventListeners() {
    // Login button
    loginButton.addEventListener('click', handleLogin);
    
    // Form inputs for validation and preview
    workspaceSelect.addEventListener('change', validateForm);
    pluginNameInput.addEventListener('input', handleInputChange);
    descriptionInput.addEventListener('input', handleInputChange);
    tagsInput.addEventListener('input', handleInputChange);
    projectTypeInputs.forEach(input => {
      input.addEventListener('change', handleInputChange);
    });
    
    // File upload
    fileInput.addEventListener('change', handleFileSelect);
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleFileDrop);
    
    // Image upload
    imageInput.addEventListener('change', handleMultipleImageSelect);
    imageUploadArea.addEventListener('dragover', handleImageDragOver);
    imageUploadArea.addEventListener('dragleave', handleImageDragLeave);
    imageUploadArea.addEventListener('drop', handleImageDrop);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Modal buttons
    returnToWorkspace.addEventListener('click', handleReturnToWorkspace);
    submitAnother.addEventListener('click', handleSubmitAnother);
    closeError.addEventListener('click', hideError);
    
    // Close modal on backdrop click
    confirmationModal.addEventListener('click', function(e) {
      if (e.target === confirmationModal) {
        hideModal();
      }
    });
  }
  
  function handleLogin() {
    // Simulate login process
    showLoading('Logging in...');
    
    setTimeout(() => {
      localStorage.setItem('userLoggedIn', 'true');
      hideLoading();
      showForm();
      showSuccess('Login successful! You can now submit your plugin.');
    }, 1500);
  }
  
  function handleInputChange() {
    validateForm();
    updatePreview();
  }
  
  function validateForm() {
    if (!isLoggedIn) {
      submitButton.disabled = true;
      return;
    }
    
    const workspace = workspaceSelect.value.trim();
    const pluginName = pluginNameInput.value.trim();
    const description = descriptionInput.value.trim();
    const hasFile = selectedFile !== null;
    const hasImages = uploadedImages.length > 0;
    
    const isValid = workspace && pluginName && description && hasFile && hasImages;
    submitButton.disabled = !isValid;
  }
  
  function updatePreview() {
    const pluginName = pluginNameInput.value.trim();
    const description = descriptionInput.value.trim();
    const tags = tagsInput.value.trim();
    const projectType = document.querySelector('input[name="projectType"]:checked')?.value || 'visualizer';
    
    if (pluginName || description || tags || selectedFile) {
      // Update preview content
      previewName.textContent = pluginName || 'Plugin Name';
      previewDescription.textContent = description || 'Plugin description will appear here';
      previewType.textContent = projectType.charAt(0).toUpperCase() + projectType.slice(1);
      
      // Update tags
      previewTags.innerHTML = '';
      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        tagArray.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.className = 'preview-tag';
          tagElement.textContent = tag;
          previewTags.appendChild(tagElement);
        });
      }
      
      // Update file info
      if (selectedFile) {
        previewFileName.textContent = selectedFile.name;
        previewFileSize.textContent = formatFileSize(selectedFile.size);
      } else {
        previewFileName.textContent = 'No file selected';
        previewFileSize.textContent = '';
      }
      
      pluginPreview.style.display = 'block';
    } else {
      pluginPreview.style.display = 'none';
    }
  }
  
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
  }
  
  function handleDragLeave(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
  }
  
  function handleFileDrop(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }
  
  function processFile(file) {
    // Validate file type
    const allowedTypes = ['.zip', '.tar', '.tar.gz'];
    const fileName = file.name.toLowerCase();
    const isValidType = allowedTypes.some(type => fileName.endsWith(type));
    
    if (!isValidType) {
      showError('Please select a valid file type (ZIP, TAR, or TAR.GZ)');
      return;
    }
    
    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      showError('File size must be less than 50MB');
      return;
    }
    
    selectedFile = file;
    
    // Show file info
    showFileInfo(file);
    
    // Update form validation and preview
    validateForm();
    updatePreview();
  }
  
  function showFileInfo(file) {
    fileInfo.innerHTML = `
      <div class="file-info-icon">📁</div>
      <div class="file-info-details">
        <h4>${file.name}</h4>
        <p>Size: ${formatFileSize(file.size)} • Type: ${getFileType(file.name)}</p>
      </div>
    `;
    fileInfo.style.display = 'flex';
  }
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function getFileType(filename) {
    const ext = filename.toLowerCase();
    if (ext.endsWith('.zip')) return 'ZIP Archive';
    if (ext.endsWith('.tar.gz')) return 'TAR.GZ Archive';
    if (ext.endsWith('.tar')) return 'TAR Archive';
    return 'Archive';
  }

  // Multiple Image upload functions
  function handleMultipleImageSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processMultipleImages(files);
    }
  }

  function handleImageDragOver(e) {
    e.preventDefault();
    imageUploadArea.classList.add('dragover');
  }

  function handleImageDragLeave(e) {
    e.preventDefault();
    imageUploadArea.classList.remove('dragover');
  }

  function handleImageDrop(e) {
    e.preventDefault();
    imageUploadArea.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processMultipleImages(files);
    }
  }

  function processMultipleImages(files) {
    const validImages = [];
    let errors = [];

    // Validate each file
    files.forEach((file, index) => {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File "${file.name}" is not a valid image type`);
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        errors.push(`File "${file.name}" is too large (max 5MB)`);
        return;
      }

      validImages.push(file);
    });

    // Show errors if any
    if (errors.length > 0) {
      showError(errors.join('\n'));
    }

    // Process valid images
    if (validImages.length > 0) {
      validImages.forEach(file => {
        addImageToUploadedList(file);
      });
    }

    // Clear input
    imageInput.value = '';
  }

  function addImageToUploadedList(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const tempImg = new Image();
      tempImg.onload = function() {
        const imageData = {
          file: file,
          src: e.target.result,
          width: tempImg.width,
          height: tempImg.height,
          name: file.name,
          size: file.size,
          id: Date.now() + Math.random() // unique ID
        };

        // Add to uploaded images array
        uploadedImages.push(imageData);
        
        // If this is the first image, make it the cover
        if (uploadedImages.length === 1) {
          coverImageIndex = 0;
        }

        // Check dimensions and show warning
        const isRecommendedSize = tempImg.width === 1280 && tempImg.height === 800;
        if (!isRecommendedSize) {
          const aspectRatio = tempImg.width / tempImg.height;
          const recommendedAspectRatio = 1280 / 800;
          
          if (Math.abs(aspectRatio - recommendedAspectRatio) > 0.1) {
            console.warn(`Image "${file.name}" doesn't match recommended 16:10 aspect ratio`);
          }
        }

        // Render the uploaded images grid
        renderUploadedImages();
        
        // Update form validation
        validateForm();
      };
      tempImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function renderUploadedImages() {
    if (uploadedImages.length === 0) {
      uploadedImagesGrid.innerHTML = '<div class="no-images-message">No images uploaded yet</div>';
      return;
    }

    // Create summary
    const totalSize = uploadedImages.reduce((sum, img) => sum + img.size, 0);
    const summaryHTML = `
      <div class="images-summary">
        <span class="images-count">${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} uploaded</span>
        <span class="images-size">Total size: ${formatFileSize(totalSize)}</span>
      </div>
    `;

    // Create image grid
    const imagesHTML = uploadedImages.map((image, index) => `
      <div class="uploaded-image-item ${index === coverImageIndex ? 'is-cover' : ''}" data-image-id="${image.id}">
        <img src="${image.src}" alt="${image.name}" />
        <div class="uploaded-image-overlay">
          <div class="uploaded-image-info">
            <span>${image.name}</span>
            <span>${formatFileSize(image.size)}</span>
            <span>${image.width} × ${image.height}px</span>
          </div>
          <div class="uploaded-image-actions">
            ${index !== coverImageIndex ? `
              <button type="button" class="image-action-btn make-cover" onclick="makeCoverImage(${index})" title="Make cover image">
                ★
              </button>
            ` : ''}
            <button type="button" class="image-action-btn delete" onclick="removeUploadedImage(${index})" title="Delete image">
              ×
            </button>
          </div>
        </div>
      </div>
    `).join('');

    uploadedImagesGrid.innerHTML = summaryHTML + imagesHTML;
  }

  function makeCoverImage(index) {
    if (index >= 0 && index < uploadedImages.length) {
      coverImageIndex = index;
      renderUploadedImages();
    }
  }

  function removeUploadedImage(index) {
    if (index >= 0 && index < uploadedImages.length) {
      uploadedImages.splice(index, 1);
      
      // Adjust cover image index if needed
      if (coverImageIndex >= index && coverImageIndex > 0) {
        coverImageIndex--;
      } else if (uploadedImages.length === 0) {
        coverImageIndex = 0;
      } else if (coverImageIndex >= uploadedImages.length) {
        coverImageIndex = uploadedImages.length - 1;
      }
      
      renderUploadedImages();
      validateForm();
    }
  }

  // Make functions global so they can be called from HTML
  window.makeCoverImage = makeCoverImage;
  window.removeUploadedImage = removeUploadedImage;
  
  function handleSubmit(e) {
    e.preventDefault();
    
    if (!isLoggedIn) {
      showError('You must be logged in to submit a plugin');
      return;
    }
    
    if (submitButton.disabled) {
      return;
    }
    
    // Show loading state
    showSubmissionLoading();
    
    // Simulate API call
    setTimeout(() => {
      hideSubmissionLoading();
      hideLoading();
      showModal();
    }, 3000);
  }
  
  function showSubmissionLoading() {
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';
    loadingOverlay.style.display = 'flex';
  }
  
  function hideSubmissionLoading() {
    submitButton.disabled = false;
    buttonText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
    loadingOverlay.style.display = 'none';
  }
  
  function showLoading(message = 'Loading...') {
    const loadingContent = document.querySelector('.loading-content p');
    if (loadingContent) {
      loadingContent.textContent = message;
    }
    loadingOverlay.style.display = 'flex';
  }
  
  function hideLoading() {
    loadingOverlay.style.display = 'none';
  }
  
  function showModal() {
    confirmationModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  function hideModal() {
    confirmationModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  function showError(message) {
    errorText.textContent = message;
    errorMessages.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideError();
    }, 5000);
  }
  
  function hideError() {
    errorMessages.style.display = 'none';
  }
  
  function showSuccess(message) {
    // Create a temporary success message (you could style this differently)
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      z-index: 9999;
      max-width: 400px;
      font-family: 'Noto Sans JP';
      font-size: 14px;
    `;
    successElement.textContent = message;
    
    document.body.appendChild(successElement);
    
    // Remove after 3 seconds
    setTimeout(() => {
      successElement.remove();
    }, 3000);
  }
  
  function handleReturnToWorkspace() {
    hideModal();
    // In a real app, this would navigate to the workspace
    window.location.href = '#workspace';
  }
  
  function handleSubmitAnother() {
    hideModal();
    resetForm();
  }
  
  function resetForm() {
    // Reset form fields
    form.reset();
    
    // Reset file selection
    selectedFile = null;
    fileInfo.style.display = 'none';
    
    // Reset image selection
    uploadedImages = [];
    coverImageIndex = 0;
    renderUploadedImages();
    
    // Reset preview
    pluginPreview.style.display = 'none';
    
    // Re-validate form
    validateForm();
  }
  
  // Utility function to simulate API calls
  function simulateAPICall(endpoint, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
          resolve({
            success: true,
            message: 'Plugin submitted successfully',
            pluginId: Math.random().toString(36).substr(2, 9)
          });
        } else {
          reject({
            success: false,
            message: 'Failed to submit plugin. Please try again.'
          });
        }
      }, 2000 + Math.random() * 2000); // 2-4 seconds delay
    });
  }
  
  // Language toggle functionality (if needed)
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    option.addEventListener('click', function() {
      langOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      // In a real app, this would trigger language change
    });
  });
  
  // Form field error handling
  function addFieldError(field, message) {
    removeFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
      color: #dc3545;
      font-size: 12px;
      margin-top: 0.25rem;
      font-family: 'Noto Sans JP';
    `;
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#dc3545';
  }
  
  function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    field.style.borderColor = '';
  }
  
  // Advanced form validation
  function validateField(field) {
    const value = field.value.trim();
    
    switch (field.id) {
      case 'pluginName':
        if (!value) {
          addFieldError(field, 'Plugin name is required');
          return false;
        } else if (value.length < 3) {
          addFieldError(field, 'Plugin name must be at least 3 characters');
          return false;
        } else if (value.length > 50) {
          addFieldError(field, 'Plugin name must be less than 50 characters');
          return false;
        }
        break;
        
      case 'description':
        if (!value) {
          addFieldError(field, 'Description is required');
          return false;
        } else if (value.length < 10) {
          addFieldError(field, 'Description must be at least 10 characters');
          return false;
        } else if (value.length > 500) {
          addFieldError(field, 'Description must be less than 500 characters');
          return false;
        }
        break;
        
      case 'tags':
        if (value) {
          const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
          if (tags.length > 10) {
            addFieldError(field, 'Maximum 10 tags allowed');
            return false;
          }
          for (let tag of tags) {
            if (tag.length > 20) {
              addFieldError(field, 'Each tag must be less than 20 characters');
              return false;
            }
          }
        }
        break;
    }
    
    removeFieldError(field);
    return true;
  }
  
  // Add real-time validation
  [pluginNameInput, descriptionInput, tagsInput].forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });
});