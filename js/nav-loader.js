/**
 * Centralized Navigation Loader
 * Loads consistent navigation across all pages
 */

// Navigation HTML template
const navigationHTML = `
    <nav class="navbar" id="navbar">
        <div class="container nav-container">
            <div class="logo">
                <a href="index.html">
                    <h2>IGFM</h2>
                    <span>International Great Faith Ministries</span>
                </a>
            </div>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="index.html" class="nav-link" data-page="home">Home</a></li>
                <li><a href="about.html" class="nav-link" data-page="about">About</a></li>
                <li class="dropdown">
                    <a href="#" class="nav-link">Ministries <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="faith.html" data-page="faith">Our Faith</a></li>
                        <li><a href="hospital.html" data-page="hospital">Berakhah Hospital</a></li>
                        <li><a href="https://call2prayer.church" target="_blank" rel="noopener noreferrer">Call to Prayer</a></li>
                    </ul>
                </li>
                <li><a href="stories.html" class="nav-link" data-page="stories">Stories</a></li>
                <li class="dropdown">
                    <a href="#" class="nav-link">Get Involved <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="sponsor.html" data-page="sponsor">Sponsor a Child</a></li>
                        <li><a href="partner.html" data-page="partner">Partner With Us</a></li>
                    </ul>
                </li>
                <li><a href="index.html#contact" class="nav-link">Contact</a></li>
                <li><a href="index.html#donate" class="btn btn-primary">Donate</a></li>
            </ul>
            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
`;

/**
 * Load navigation into the page
 */
function loadNavigation() {
    // Find the navigation placeholder or replace existing nav
    const navPlaceholder = document.getElementById('nav-placeholder');
    const existingNav = document.querySelector('nav.navbar');
    
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navigationHTML;
    } else if (existingNav) {
        existingNav.outerHTML = navigationHTML;
    } else {
        // Insert at the beginning of body if no placeholder exists
        document.body.insertAdjacentHTML('afterbegin', navigationHTML);
    }
    
    // Set active link based on current page
    setActiveNavLink();
    
    // Initialize dropdown functionality only (hamburger and scroll handled by script.js)
    initializeDropdowns();
}

/**
 * Set active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a[data-page]');
    
    // Remove all active classes first
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Set active class on current page
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Check dropdown items
    dropdownLinks.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
            // Also highlight the parent dropdown
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector('.nav-link');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });
    
    // Special handling for home page
    if (currentPage === 'home' || currentPage === 'index') {
        const homeLink = document.querySelector('.nav-link[data-page="home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

/**
 * Get current page name from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page === 'index' ? 'home' : page;
}

/**
 * Initialize dropdown functionality for mobile
 */
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    // Dropdown functionality for mobile
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        
        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
                // On mobile, toggle dropdown
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// Load navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
    // DOM already loaded
    loadNavigation();
}
