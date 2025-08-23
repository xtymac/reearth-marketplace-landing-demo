// Search Results Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function () {
  // Initialize search term from URL parameters
  initializeFromURL();

  // Initialize all functionality
  initializeSearchFunctionality();
  initializePlatformFilters();
  initializeSortFunctionality();
  initializeCardInteractions();
  initializeLoadMore();
  updateResultsDisplay();
});

// Initialize search term from URL parameters
function initializeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('q');

  if (searchTerm) {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = searchTerm;

      // Update results count
      const resultsCount = document.querySelector('.results-count');
      const totalCards = document.querySelectorAll('.result-card').length;
      resultsCount.textContent = `${totalCards} results found for "${searchTerm}"`;

      // Perform initial search highlighting
      updateSearchResults(searchTerm);
    }
  }
}

// Make updateSearchResults available globally
function updateSearchResults(searchTerm) {
  const allCards = document.querySelectorAll('.result-card');
  let foundCount = 0;

  allCards.forEach((card) => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    const author =
      card.querySelector('.card-author')?.textContent.toLowerCase() || '';
    const description =
      card.querySelector('.card-description')?.textContent.toLowerCase() || '';

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      author.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase());

    if (matchesSearch && !card.classList.contains('filtered-out')) {
      card.style.border = '2px solid #64b4ea';
      card.style.boxShadow = '0 8px 32px rgba(100, 180, 234, 0.3)';
      foundCount++;
    } else {
      card.style.border = '';
      card.style.boxShadow = '';
    }
  });

  if (foundCount === 0) {
    showEmptyState();
  } else {
    hideEmptyState();
  }

  return foundCount;
}

// Search functionality
function initializeSearchFunctionality() {
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');

  function performSearch() {
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
      // Update URL and results
      const foundCount = updateSearchResults(searchTerm);
      updateResultsCount(searchTerm);

      // Scroll to first match if found
      if (foundCount > 0) {
        const firstMatch = document.querySelector(
          '.result-card[style*="border"]'
        );
        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else {
      // Show all results if search is empty
      showAllResults();
    }
  }

  function updateResultsCount(searchTerm) {
    const resultsCount = document.querySelector('.results-count');
    const visibleCards = document.querySelectorAll(
      '.result-card:not(.filtered-out)'
    ).length;
    resultsCount.textContent = `${visibleCards} results found for "${searchTerm}"`;
  }

  function showAllResults() {
    const allCards = document.querySelectorAll('.result-card');
    allCards.forEach((card) => {
      card.style.border = '';
      card.style.boxShadow = '';
    });

    const resultsCount = document.querySelector('.results-count');
    const totalCards = allCards.length;
    resultsCount.textContent = `${totalCards} results found`;
    hideEmptyState();
  }

  // Event listeners
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    // Clear search highlights when input is cleared
    searchInput.addEventListener('input', function () {
      if (this.value.trim() === '') {
        showAllResults();
      }
    });
  }
}

// Platform filter functionality
function initializePlatformFilters() {
  const filterCheckboxes = document.querySelectorAll(
    '.filter-checkbox input[type="checkbox"]'
  );

  function updateFilterResults() {
    const selectedPlatforms = Array.from(filterCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    const allCards = document.querySelectorAll('.result-card');
    let visibleCount = 0;

    allCards.forEach((card) => {
      const cardPlatforms = card.getAttribute('data-platforms').split(' ');

      // Show card if no filters selected (show all) or if card matches any selected platform
      const shouldShow =
        selectedPlatforms.length === 0 ||
        selectedPlatforms.some((platform) => cardPlatforms.includes(platform));

      if (shouldShow) {
        card.classList.remove('filtered-out');
        visibleCount++;
      } else {
        card.classList.add('filtered-out');
      }
    });

    // Update results count
    updateFilteredResultsCount(visibleCount);

    // Show/hide empty state
    if (visibleCount === 0 && selectedPlatforms.length > 0) {
      showEmptyState();
    } else {
      hideEmptyState();
    }
  }

  function updateFilteredResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    const searchTerm = document.querySelector('.search-input').value.trim();
    if (searchTerm) {
      resultsCount.textContent = `${count} results found for "${searchTerm}"`;
    } else {
      resultsCount.textContent = `${count} results found`;
    }
  }

  // Add event listeners to checkboxes
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', updateFilterResults);
  });

  // Global function for clearing filters
  window.clearAllFilters = function () {
    filterCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    updateFilterResults();
  };
}

// Sort functionality
function initializeSortFunctionality() {
  const sortSelect = document.getElementById('sortSelect');

  function sortResults(sortBy) {
    const resultsGrid = document.querySelector('.results-grid');
    const cards = Array.from(resultsGrid.querySelectorAll('.result-card'));

    cards.sort((a, b) => {
      switch (sortBy) {
        case 'relevancy':
          return (
            parseInt(b.getAttribute('data-relevancy')) -
            parseInt(a.getAttribute('data-relevancy'))
          );

        case 'likes':
          return (
            parseInt(b.getAttribute('data-likes')) -
            parseInt(a.getAttribute('data-likes'))
          );

        case 'downloads':
          return (
            parseInt(b.getAttribute('data-downloads')) -
            parseInt(a.getAttribute('data-downloads'))
          );

        case 'newest':
          return (
            new Date(b.getAttribute('data-date')) -
            new Date(a.getAttribute('data-date'))
          );

        case 'name':
          const nameA = a
            .querySelector('.card-title')
            .textContent.toLowerCase();
          const nameB = b
            .querySelector('.card-title')
            .textContent.toLowerCase();
          return nameA.localeCompare(nameB);

        default:
          return 0;
      }
    });

    // Re-append sorted cards
    cards.forEach((card) => resultsGrid.appendChild(card));

    // Add sorting animation
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('sort-animation');
    });

    setTimeout(() => {
      cards.forEach((card) => {
        card.classList.remove('sort-animation');
      });
    }, 600);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      sortResults(this.value);
    });
  }
}

// Card interactions
function initializeCardInteractions() {
  const resultCards = document.querySelectorAll('.result-card');

  resultCards.forEach((card) => {
    // Card click interaction
    card.addEventListener('click', function (e) {
      // Don't trigger if clicking on buttons
      if (
        e.target.classList.contains('btn-primary') ||
        e.target.classList.contains('btn-secondary') ||
        e.target.classList.contains('heart-icon')
      ) {
        return;
      }

      const cardTitle = card.querySelector('.card-title').textContent;
      console.log('Card clicked:', cardTitle);

      // Add subtle click animation
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });

    // Heart icon interaction
    const heartIcon = card.querySelector('.heart-icon');
    if (heartIcon) {
      heartIcon.addEventListener('click', function (e) {
        e.stopPropagation();

        if (this.textContent === '♡') {
          this.textContent = '♥';
          this.style.color = '#FF6B6B';

          // Update likes count
          const likesCount = card.querySelector('.likes-count');
          const currentLikes = parseInt(
            likesCount.textContent.replace('k', '000').replace('.', '')
          );
          const newLikes = currentLikes + 1;
          likesCount.textContent = formatCount(newLikes);

          // Update data attribute for sorting
          card.setAttribute('data-likes', newLikes);
        } else {
          this.textContent = '♡';
          this.style.color = '#999';

          // Update likes count
          const likesCount = card.querySelector('.likes-count');
          const currentLikes = parseInt(
            likesCount.textContent.replace('k', '000').replace('.', '')
          );
          const newLikes = Math.max(0, currentLikes - 1);
          likesCount.textContent = formatCount(newLikes);

          // Update data attribute for sorting
          card.setAttribute('data-likes', newLikes);
        }

        console.log(
          'Heart clicked for:',
          card.querySelector('.card-title').textContent
        );
      });
    }

    // Install button interaction
    const installBtn = card.querySelector('.btn-primary');
    if (installBtn) {
      installBtn.addEventListener('click', function (e) {
        e.stopPropagation();

        const cardTitle = card.querySelector('.card-title').textContent;

        // Change button state
        this.textContent = 'Installing...';
        this.disabled = true;
        this.style.background = '#95a5a6';

        setTimeout(() => {
          this.textContent = 'Installed ✓';
          this.style.background = '#27ae60';

          // Update download count
          const downloadCount = card.querySelector('.download-count');
          const currentDownloads = parseInt(
            downloadCount.textContent.replace('k', '000').replace('.', '')
          );
          const newDownloads = currentDownloads + 1;
          downloadCount.textContent = formatCount(newDownloads);

          // Update data attribute for sorting
          card.setAttribute('data-downloads', newDownloads);

          setTimeout(() => {
            this.textContent = 'Install';
            this.disabled = false;
            this.style.background = '#64b4ea';
          }, 2000);
        }, 1500);

        console.log('Install clicked for:', cardTitle);
      });
    }

    // Learn More button interaction
    const learnMoreBtn = card.querySelector('.btn-secondary');
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const cardTitle = card.querySelector('.card-title').textContent;
        console.log('Learn More clicked for:', cardTitle);

        // Simulate navigation
        alert(
          `Learn More: ${cardTitle}\n\nThis would typically open a detailed page about the plugin.`
        );
      });
    }
  });
}

// Load More functionality
function initializeLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  const resultsInfo = document.querySelector('.results-info');

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      // Simulate loading more results
      this.textContent = 'Loading...';
      this.disabled = true;

      setTimeout(() => {
        // Update results info
        const currentCount = parseInt(resultsInfo.textContent.match(/\d+/)[0]);
        const totalCount = parseInt(resultsInfo.textContent.match(/\d+/g)[1]);
        const newCount = Math.min(currentCount + 6, totalCount);

        resultsInfo.textContent = `Showing ${newCount} of ${totalCount} results`;

        // Re-enable button
        this.textContent = 'Load More Results';
        this.disabled = false;

        // Hide button if all results are shown
        if (newCount >= totalCount) {
          this.style.display = 'none';
          resultsInfo.textContent = `Showing all ${totalCount} results`;
        }
      }, 1000);

      console.log('Load More clicked');
    });
  }
}

// Helper functions
function showEmptyState() {
  const emptyState = document.getElementById('emptyState');
  if (emptyState) {
    emptyState.style.display = 'block';
  }
}

function hideEmptyState() {
  const emptyState = document.getElementById('emptyState');
  if (emptyState) {
    emptyState.style.display = 'none';
  }
}

function formatCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

function updateResultsDisplay() {
  // Initialize with current search term if any
  const searchInput = document.querySelector('.search-input');
  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.trim();
    const resultsCount = document.querySelector('.results-count');
    const visibleCards = document.querySelectorAll(
      '.result-card:not(.filtered-out)'
    ).length;
    resultsCount.textContent = `${visibleCards} results found for "${searchTerm}"`;
  }
}

// Add CSS for sort animation
const style = document.createElement('style');
style.textContent = `
  .sort-animation {
    animation: sortFadeIn 0.6s ease-out;
  }
  
  @keyframes sortFadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Language toggle functionality (inherited from main script)
document.addEventListener('DOMContentLoaded', function () {
  const langOptions = document.querySelectorAll('.lang-option');

  langOptions.forEach((option) => {
    option.addEventListener('click', function () {
      langOptions.forEach((opt) => opt.classList.remove('active'));
      this.classList.add('active');
      console.log('Language switched to:', this.textContent);
    });
  });
});
