// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Language toggle functionality
  const langOptions = document.querySelectorAll('.lang-option');

  langOptions.forEach((option) => {
    option.addEventListener('click', function () {
      // Remove active class from all options
      langOptions.forEach((opt) => opt.classList.remove('active'));

      // Add active class to clicked option
      this.classList.add('active');

      // Here you would typically implement actual language switching logic
      console.log('Language switched to:', this.textContent);
    });
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  });

  // Add scroll effect to navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
  });

  // Add transition to navbar for smooth animation
  navbar.style.transition = 'transform 0.3s ease-in-out';
});

// Start button functionality
document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.querySelector('.start-button');

  if (startButton) {
    startButton.addEventListener('click', function () {
      // Add your start button functionality here
      console.log('Start button clicked!');
      // For example, you could redirect to a signup page or show a modal
      alert('Welcome to Re:Earth! Ready to start your journey?');
    });
  }
});

// Search functionality
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');

  function performSearch() {
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
      console.log('Searching for:', searchTerm);
      // Add your search functionality here
      // For example, you could make an API call or filter results
      alert(`Searching for: ${searchTerm}`);
    } else {
      alert('Please enter a search term');
    }
  }

  // Search button click event
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }

  // Enter key press event
  if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    // Clear search when input is focused
    searchInput.addEventListener('focus', function () {
      this.select();
    });
  }
});

// Featured cards functionality
document.addEventListener('DOMContentLoaded', function () {
  const featuredCards = document.querySelectorAll('.featured-card');
  const cardLinks = document.querySelectorAll('.card-link');

  // Add click handlers to featured cards
  featuredCards.forEach((card) => {
    card.addEventListener('click', function (e) {
      // Don't trigger if clicking on the "詳しく見る" link
      if (e.target.classList.contains('card-link')) {
        return;
      }

      // Add card interaction logic here
      console.log('Card clicked:', card);

      // Example: Add a subtle animation on click
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });

  // Handle "詳しく見る" link clicks
  cardLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.featured-card');
      const cardTitle = card.querySelector('.card-title').textContent;

      console.log('Learn more clicked for:', cardTitle);
      // Add your navigation logic here
      alert(`詳しく見る: ${cardTitle}`);
    });
  });
});

// Plugin cards functionality
document.addEventListener('DOMContentLoaded', function () {
  const pluginCards = document.querySelectorAll('.plugin-card');

  // Add click handlers to plugin cards
  pluginCards.forEach((card) => {
    card.addEventListener('click', function (e) {
      // Add card interaction logic here
      console.log('Plugin card clicked:', card);

      const cardTitle = card.querySelector('.card-title').textContent;
      const cardAuthor = card.querySelector('.card-author').textContent;

      // Example: Add a subtle animation on click
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);

      // Log card details
      console.log('Plugin clicked:', cardTitle, 'by', cardAuthor);
    });

    // Handle heart icon clicks for likes
    const heartIcon = card.querySelector('.heart-icon');
    if (heartIcon) {
      heartIcon.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent card click

        // Toggle heart state
        if (this.textContent === '♡') {
          this.textContent = '♥';
          this.style.color = '#FF6B6B';
        } else {
          this.textContent = '♡';
          this.style.color = '#999';
        }

        console.log(
          'Heart clicked for:',
          card.querySelector('.card-title').textContent
        );
      });
    }
  });
});

// Featured section horizontal scroll functionality
document.addEventListener('DOMContentLoaded', function () {
  const scrollLeftIndicator = document.querySelector(
    '.scroll-indicator.scroll-left'
  );
  const scrollRightIndicator = document.querySelector(
    '.scroll-indicator.scroll-right'
  );
  const featuredGrid = document.querySelector('.featured-grid');
  const featuredContainer = document.querySelector(
    '.featured-section .container'
  );

  function updateScrollIndicators() {
    if (!featuredGrid) return;

    const scrollLeft = featuredGrid.scrollLeft;
    const maxScrollLeft = featuredGrid.scrollWidth - featuredGrid.clientWidth;
    const isAtStart = scrollLeft <= 10;
    const isAtEnd = scrollLeft >= maxScrollLeft - 10;

    // Show/hide left indicator
    if (scrollLeftIndicator) {
      if (isAtStart) {
        scrollLeftIndicator.classList.remove('visible');
      } else {
        scrollLeftIndicator.classList.add('visible');
      }
    }

    // Show/hide right indicator
    if (scrollRightIndicator) {
      if (isAtEnd) {
        scrollRightIndicator.classList.remove('visible');
      } else {
        scrollRightIndicator.classList.add('visible');
      }
    }

    // Show/hide left gradient
    if (featuredContainer) {
      if (isAtStart) {
        featuredContainer.classList.remove('show-left-gradient');
      } else {
        featuredContainer.classList.add('show-left-gradient');
      }
    }
  }

  if (featuredGrid) {
    // Initial check
    updateScrollIndicators();

    // Left scroll indicator click
    if (scrollLeftIndicator) {
      scrollLeftIndicator.addEventListener('click', function () {
        const cardWidth = 350; // Card width
        const gap = 32; // 2rem gap in pixels
        const scrollAmount = cardWidth + gap;

        featuredGrid.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth',
        });

        // Add animation
        this.style.transform = 'translateY(-50%) scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
      });
    }

    // Right scroll indicator click
    if (scrollRightIndicator) {
      scrollRightIndicator.addEventListener('click', function () {
        const cardWidth = 350; // Card width
        const gap = 32; // 2rem gap in pixels
        const scrollAmount = cardWidth + gap;

        featuredGrid.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });

        // Add animation
        this.style.transform = 'translateY(-50%) scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
      });
    }

    // Update indicators on scroll
    featuredGrid.addEventListener('scroll', updateScrollIndicators);

    // Update indicators on resize
    window.addEventListener('resize', updateScrollIndicators);
  }
});
