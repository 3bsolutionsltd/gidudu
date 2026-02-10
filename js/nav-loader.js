/**
 * Centralized Navigation Loader - Production Optimized
 * @version 1.0.0
 */
(function() {
'use strict';

// Navigation HTML template
const navigationHTML = `<nav class="navbar" id="navbar"><div class="container nav-container"><ul class="nav-menu" id="nav-menu">
<li><a href="index.html" class="nav-link" data-page="home">Home</a></li><li class="dropdown"><a href="#" class="nav-link">About <i class="fas fa-chevron-down"></i></a><ul class="dropdown-menu"><li><a href="about.html" data-page="about">About Us</a></li><li><a href="faith.html" data-page="faith">Our Faith</a></li></ul></li><li class="dropdown"><a href="#" class="nav-link">Ministries <i class="fas fa-chevron-down"></i></a><ul class="dropdown-menu"><li><a href="berakhah-childcare.html" data-page="berakhah-childcare">Berakhah Childcare</a></li><li><a href="berakhah-choir.html" data-page="berakhah-choir">Berakhah Children's Choir</a></li><li><a href="church-prison.html" data-page="church-prison">Church @ the Prison</a></li><li><a href="church-planting.html" data-page="church-planting">Church Planting</a></li><li><a href="https://call2prayer.church" target="_blank" rel="noopener noreferrer">Call2Prayer</a></li><li><a href="pastors-network.html" data-page="pastors-network">Pastors' Network Uganda</a></li><li><a href="school-outreaches.html" data-page="school-outreaches">School Outreaches</a></li><li><a href="safe-water.html" data-page="safe-water">Safe Water</a></li><li><a href="church-construction.html" data-page="church-construction">Church Construction</a></li><li><a href="youth-ministries.html" data-page="youth-ministries">Youth Ministries</a></li><li><a href="mens-ministries.html" data-page="mens-ministries">Men's Ministries</a></li><li><a href="womens-ministries.html" data-page="womens-ministries">Women's Ministries</a></li></ul></li><li><a href="hospital.html" class="nav-link" data-page="hospital">Hospital</a></li><li><a href="stories.html" class="nav-link" data-page="stories">Stories</a></li><li class="dropdown"><a href="#" class="nav-link">Get Involved <i class="fas fa-chevron-down"></i></a><ul class="dropdown-menu"><li><a href="sponsor.html" data-page="sponsor">Sponsor</a></li><li><a href="volunteers.html" data-page="volunteers">Volunteers</a></li><li><a href="partner.html" data-page="partner">Partner With Us</a></li><li><a href="ambassadors.html" data-page="ambassadors">Ambassadors</a></li><li><a href="mission-trips.html" data-page="mission-trips">Mission Trips</a></li></ul></li><li><a href="index.html#contact" class="nav-link">Contact</a></li><li><a href="index.html#donate" class="btn btn-primary">Donate</a></li></ul><div class="hamburger" id="hamburger"><span></span><span></span><span></span></div></div></nav>`;

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
 * Initialize dropdown functionality with event delegation
 */
function initializeDropdowns() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;

    // Use event delegation for better performance
    navMenu.addEventListener('click', (e) => {
        const dropdownLink = e.target.closest('.dropdown > .nav-link');
        if (dropdownLink && window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = dropdownLink.parentElement;
            dropdown.classList.toggle('active');
        }
    }, { passive: false });

    // Close dropdowns when clicking outside (debounced)
    let closeTimer;
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
            }, 10);
        }
    });
}

// Defer navigation load slightly to prioritize critical rendering
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(loadNavigation);
    });
} else {
    requestAnimationFrame(loadNavigation);
}

})();
