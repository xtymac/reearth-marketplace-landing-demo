// Workspace Plugin Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const searchInput = document.querySelector('.search-input');
  const sortSelect = document.querySelector('.sort-select');
  const pluginCards = document.querySelectorAll('.plugin-card');
  const editButtons = document.querySelectorAll('.edit-button');
  
  // Initialize
  init();
  
  function init() {
    setupEventListeners();
    setupSearchFunctionality();
    setupSortFunctionality();
  }
  
  function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Sort functionality
    sortSelect.addEventListener('change', handleSort);
    
    // Edit button functionality
    editButtons.forEach(button => {
      button.addEventListener('click', handleEdit);
    });
    
    // Language toggle functionality
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', function() {
        langOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  function setupSearchFunctionality() {
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
      searchButton.addEventListener('click', function() {
        handleSearch();
      });
    }
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  function setupSortFunctionality() {
    // Add any initial sort logic here if needed
  }
  
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const pluginsGrid = document.querySelector('.plugins-grid');
    const pluginCards = document.querySelectorAll('.plugin-card');
    
    let visibleCount = 0;
    
    pluginCards.forEach(card => {
      const title = card.querySelector('.plugin-type').textContent.toLowerCase();
      const description = card.querySelector('.plugin-description p').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => 
        tag.textContent.toLowerCase()
      ).join(' ');
      
      const searchableText = `${title} ${description} ${tags}`;
      const isMatch = searchTerm === '' || searchableText.includes(searchTerm);
      
      if (isMatch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Show/hide empty state
    handleEmptyState(visibleCount === 0 && searchTerm !== '');
  }
  
  function handleSort() {
    const sortValue = sortSelect.value;
    const pluginsGrid = document.querySelector('.plugins-grid');
    const pluginCards = Array.from(document.querySelectorAll('.plugin-card'));
    
    // Sort the cards based on the selected option
    pluginCards.sort((a, b) => {
      switch (sortValue) {
        case 'name':
          const nameA = a.querySelector('.plugin-type').textContent.trim();
          const nameB = b.querySelector('.plugin-type').textContent.trim();
          return nameA.localeCompare(nameB);
          
        case 'date-uploaded':
          // For demo purposes, we'll use a random sort
          // In a real app, you'd sort by actual upload dates
          return Math.random() - 0.5;
          
        case 'status':
          // Sort by status (for demo, all are active)
          return 0;
          
        case 'last-modified':
          // For demo purposes, reverse alphabetical
          const modA = a.querySelector('.plugin-type').textContent.trim();
          const modB = b.querySelector('.plugin-type').textContent.trim();
          return modB.localeCompare(modA);
          
        default:
          return 0;
      }
    });
    
    // Re-append the sorted cards
    pluginCards.forEach(card => {
      pluginsGrid.appendChild(card);
    });
    
    // Add subtle animation
    pluginCards.forEach((card, index) => {
      card.style.animation = 'none';
      card.offsetHeight; // Trigger reflow
      card.style.animation = `fadeInUp 0.3s ease ${index * 0.05}s both`;
    });
  }
  
  function handleEdit(event) {
    const button = event.target;
    const card = button.closest('.plugin-card');
    const pluginName = card.querySelector('.plugin-type').textContent.trim();
    
    // For demo purposes, show an alert
    // In a real application, this would navigate to an edit page
    showEditModal(pluginName, card);
  }
  
  function showEditModal(pluginName, card) {
    // Create a simple modal for demo purposes
    const modal = document.createElement('div');
    modal.className = 'edit-modal-overlay';
    modal.innerHTML = `
      <div class="edit-modal">
        <div class="edit-modal-header">
          <h3>Edit Plugin: ${pluginName}</h3>
          <button class="close-modal">×</button>
        </div>
        <div class="edit-modal-body">
          <p>This would open the plugin editor where you can:</p>
          <ul>
            <li>Update plugin information</li>
            <li>Modify description and tags</li>
            <li>Upload new images</li>
            <li>Update plugin files</li>
            <li>Manage plugin settings</li>
          </ul>
        </div>
        <div class="edit-modal-actions">
          <button class="cancel-button">Cancel</button>
          <button class="edit-plugin-button">Edit Plugin</button>
        </div>
      </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
      .edit-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
      }
      
      .edit-modal {
        background: white;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease;
      }
      
      .edit-modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .edit-modal-header h3 {
        margin: 0;
        color: #374151;
        font-family: 'Noto Sans JP';
        font-size: 18px;
        font-weight: 600;
      }
      
      .close-modal {
        background: none;
        border: none;
        font-size: 24px;
        color: #6b7280;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }
      
      .close-modal:hover {
        background: #f3f4f6;
        color: #374151;
      }
      
      .edit-modal-body {
        padding: 1.5rem;
      }
      
      .edit-modal-body p {
        color: #6b7280;
        font-family: 'Noto Sans JP';
        font-size: 14px;
        margin-bottom: 1rem;
      }
      
      .edit-modal-body ul {
        color: #6b7280;
        font-family: 'Noto Sans JP';
        font-size: 14px;
        margin: 0;
        padding-left: 1.5rem;
      }
      
      .edit-modal-body li {
        margin-bottom: 0.5rem;
      }
      
      .edit-modal-actions {
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
      
      .cancel-button, .edit-plugin-button {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-family: 'Noto Sans JP';
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
      }
      
      .cancel-button {
        background: #f3f4f6;
        color: #374151;
      }
      
      .cancel-button:hover {
        background: #e5e7eb;
      }
      
      .edit-plugin-button {
        background: #2563eb;
        color: white;
        box-shadow: 0 1px 2px rgba(37, 99, 235, 0.1);
      }
      
      .edit-plugin-button:hover {
        background: #1d4ed8;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    
    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);
    
    // Handle modal close
    const closeModal = () => {
      modal.remove();
      modalStyles.remove();
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.cancel-button').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Handle edit plugin button
    modal.querySelector('.edit-plugin-button').addEventListener('click', () => {
      // In a real app, this would navigate to the plugin editor
      alert(`Navigating to edit page for: ${pluginName}`);
      closeModal();
    });
  }
  
  function handleEmptyState(show) {
    let emptyState = document.querySelector('.empty-state');
    
    if (show && !emptyState) {
      // Create empty state
      emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <div class="empty-state-content">
          <div class="empty-state-icon">🔍</div>
          <h3>No plugins found</h3>
          <p>Try adjusting your search term to see more results.</p>
          <button class="clear-search-button">Clear Search</button>
        </div>
      `;
      
      // Add empty state styles
      const emptyStateStyles = document.createElement('style');
      emptyStateStyles.textContent = `
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .empty-state h3 {
          color: #374151;
          font-family: 'Noto Sans JP';
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          color: #6b7280;
          font-family: 'Noto Sans JP';
          font-size: 14px;
          margin-bottom: 1.5rem;
        }
        
        .clear-search-button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-family: 'Noto Sans JP';
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .clear-search-button:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
      `;
      
      document.head.appendChild(emptyStateStyles);
      document.querySelector('.plugins-grid').appendChild(emptyState);
      
      // Handle clear search
      emptyState.querySelector('.clear-search-button').addEventListener('click', () => {
        searchInput.value = '';
        handleSearch();
      });
    } else if (!show && emptyState) {
      emptyState.remove();
    }
  }
  
  // Add CSS animations
  const animationStyles = document.createElement('style');
  animationStyles.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(animationStyles);
});