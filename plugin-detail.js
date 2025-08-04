// Plugin Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Image gallery functionality
  initializeImageGallery();
  
  // Install button functionality
  initializeInstallButton();
  
  // Download button functionality
  initializeDownloadButton();
  
  // Like button functionality
  initializeLikeButton();
  
  // Header search functionality
  initializeHeaderSearch();
  
  // Change log toggle functionality
  initializeChangeLogToggle();
});

// Image Gallery
function initializeImageGallery() {
  const mainImage = document.querySelector('.plugin-main-image img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (!mainImage || !thumbnails.length) return;
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Remove active class from all thumbnails
      thumbnails.forEach(thumb => thumb.classList.remove('active'));
      
      // Add active class to clicked thumbnail
      this.classList.add('active');
      
      // Update main image source
      mainImage.src = this.src;
      mainImage.alt = this.alt;
    });
  });
}

// Install Button
function initializeInstallButton() {
  const installButton = document.querySelector('.install-button');
  
  if (!installButton) return;
  
  installButton.addEventListener('click', function() {
    const originalText = this.innerHTML;
    
    // Show loading state
    this.innerHTML = '<span class="install-icon">⟳</span> Installing...';
    this.disabled = true;
    this.style.background = '#ccc';
    
    // Simulate installation process
    setTimeout(() => {
      this.innerHTML = '<span class="install-icon">✓</span> Installed';
      this.style.background = '#28a745';
      
      // Reset after 2 seconds
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
        this.style.background = '#0066cc';
      }, 2000);
    }, 1500);
  });
}

// Download Button
function initializeDownloadButton() {
  const downloadButton = document.querySelector('.download-button');
  
  if (!downloadButton) return;
  
  downloadButton.addEventListener('click', function() {
    const originalText = this.innerHTML;
    const pluginTitle = document.querySelector('.plugin-title').textContent;
    const version = document.querySelector('.metadata-value').textContent; // Gets the version
    
    // Show downloading state
    this.innerHTML = '<span class="download-icon">⬇</span> Downloading...';
    this.disabled = true;
    this.style.background = '#6c757d';
    
    // Simulate download process
    setTimeout(() => {
      // Create a mock download
      const fileName = `${pluginTitle.replace(/\s+/g, '_')}_v${version}.zip`;
      
      // In a real implementation, this would trigger an actual file download
      // For demo purposes, we'll show success state
      this.innerHTML = '<span class="download-icon">✓</span> Downloaded';
      this.style.background = '#28a745';
      
      // Simulate file download (in real app, you'd use actual file URL)
      simulateFileDownload(fileName);
      
      // Update download count in metadata
      updateDownloadCount();
      
      // Reset button after 3 seconds
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
        this.style.background = '#28a745';
      }, 3000);
    }, 1500);
  });
}

// Simulate file download (replace with actual download URL in production)
function simulateFileDownload(fileName) {
  // In production, you would use something like:
  // const link = document.createElement('a');
  // link.href = 'path/to/actual/plugin/file.zip';
  // link.download = fileName;
  // link.click();
  
  // For demo, we'll just show a notification
  console.log(`Downloading: ${fileName}`);
  
  // Optional: Show a toast notification
  showDownloadNotification(fileName);
}

// Show download notification
function showDownloadNotification(fileName) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-weight: 500;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  notification.textContent = `Download started: ${fileName}`;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}

// Update download count in metadata
function updateDownloadCount() {
  const metadataItems = document.querySelectorAll('.metadata-item');
  
  metadataItems.forEach(item => {
    const label = item.querySelector('.metadata-label');
    if (label && label.textContent === 'Downloads:') {
      const valueElement = item.querySelector('.metadata-value');
      if (valueElement) {
        // Parse current count and increment
        const currentCount = parseInt(valueElement.textContent.replace(/,/g, ''));
        const newCount = currentCount + 1;
        
        // Format with comma separator for thousands
        const formattedCount = newCount.toLocaleString();
        valueElement.textContent = formattedCount;
        
        // Add a subtle highlight animation
        valueElement.style.transition = 'all 0.3s ease';
        valueElement.style.background = '#d4edda';
        valueElement.style.color = '#28a745';
        valueElement.style.padding = '2px 6px';
        valueElement.style.borderRadius = '4px';
        
        // Reset styles after animation
        setTimeout(() => {
          valueElement.style.background = 'transparent';
          valueElement.style.color = '#333';
          valueElement.style.padding = '0';
        }, 1500);
      }
    }
  });
}

// Like Button
function initializeLikeButton() {
  const likeButton = document.querySelector('.like-button');
  
  if (!likeButton) return;
  
  let isLiked = false;
  
  likeButton.addEventListener('click', function() {
    const heartIcon = this.querySelector('.heart-icon');
    const likeCount = this.querySelector('.like-count');
    let currentCount = parseInt(likeCount.textContent);
    
    if (!isLiked) {
      // Like the plugin
      heartIcon.textContent = '♥';
      likeCount.textContent = currentCount + 1;
      this.classList.add('liked');
      isLiked = true;
      
      // Add a subtle animation
      this.style.transform = 'scale(1.05)';
      setTimeout(() => {
        this.style.transform = 'translateY(-1px)';
      }, 150);
      
    } else {
      // Unlike the plugin
      heartIcon.textContent = '♡';
      likeCount.textContent = currentCount - 1;
      this.classList.remove('liked');
      isLiked = false;
      
      // Reset animation
      this.style.transform = 'none';
    }
  });
  
  // Add hover effect for heart icon
  likeButton.addEventListener('mouseenter', function() {
    const heartIcon = this.querySelector('.heart-icon');
    if (!isLiked) {
      heartIcon.style.transform = 'scale(1.2)';
    }
  });
  
  likeButton.addEventListener('mouseleave', function() {
    const heartIcon = this.querySelector('.heart-icon');
    heartIcon.style.transform = 'scale(1)';
  });
}

// Header Search
function initializeHeaderSearch() {
  const searchInput = document.querySelector('.header-search-input');
  const searchButton = document.querySelector('.header-search-button');
  
  if (!searchInput || !searchButton) return;
  
  // Search on button click
  searchButton.addEventListener('click', function() {
    performSearch();
  });
  
  // Search on Enter key press
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Auto-complete suggestions (optional enhancement)
  searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    if (query.length > 2) {
      // In a real app, you might show search suggestions here
      // showSearchSuggestions(query);
    }
  });
}

// Perform search function
function performSearch() {
  const searchInput = document.querySelector('.header-search-input');
  const query = searchInput.value.trim();
  
  if (!query) {
    searchInput.focus();
    return;
  }
  
  // In a real application, you would redirect to search results page
  // For demo purposes, we'll redirect to the main marketplace with search parameter
  const searchUrl = `index.html?search=${encodeURIComponent(query)}`;
  
  // Show loading state
  const searchButton = document.querySelector('.header-search-button');
  const originalIcon = searchButton.innerHTML;
  searchButton.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid #ccc; border-top: 2px solid #0066cc; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
  
  // Add spinning animation style
  if (!document.getElementById('spin-style')) {
    const style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Simulate search delay then redirect
  setTimeout(() => {
    window.location.href = searchUrl;
  }, 800);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add scroll-based header background (if needed)
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.backdropFilter = 'blur(10px)';
    header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'transparent';
    header.style.backdropFilter = 'none';
    header.style.borderBottom = 'none';
  }
});

// Change Log Toggle Functionality
function initializeChangeLogToggle() {
  const toggleButton = document.querySelector('.changelog-toggle');
  const changelogItems = document.querySelectorAll('.changelog-item');
  
  if (!toggleButton || !changelogItems.length) return;
  
  // Initially hide older versions (show only first 3)
  const initialVisibleCount = 3;
  let isExpanded = false;
  
  // Hide versions beyond the initial visible count
  function updateVisibility() {
    changelogItems.forEach((item, index) => {
      if (!isExpanded && index >= initialVisibleCount) {
        item.style.display = 'none';
      } else {
        item.style.display = 'block';
      }
    });
  }
  
  // Initialize visibility
  updateVisibility();
  
  // Toggle button click handler
  toggleButton.addEventListener('click', function() {
    isExpanded = !isExpanded;
    
    // Update button state
    this.setAttribute('data-expanded', isExpanded.toString());
    
    // Update button text
    const toggleText = this.querySelector('.toggle-text');
    if (isExpanded) {
      toggleText.textContent = 'Show Fewer';
    } else {
      toggleText.textContent = 'Show More';
    }
    
    // Animate the visibility change
    if (isExpanded) {
      // Show hidden items with animation
      changelogItems.forEach((item, index) => {
        if (index >= initialVisibleCount) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'translateY(-10px)';
          
          // Stagger the animation for a nice effect
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, (index - initialVisibleCount) * 100);
        }
      });
    } else {
      // Hide items with animation
      changelogItems.forEach((item, index) => {
        if (index >= initialVisibleCount) {
          item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          item.style.opacity = '0';
          item.style.transform = 'translateY(-10px)';
          
          // Hide after animation completes
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    }
    
    // Add button press animation
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
  });
  
  // Add hover effect for better UX
  toggleButton.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-1px)';
  });
  
  toggleButton.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
}