// Child Profile Loader (Production Optimized)
// Dynamically loads child data based on URL parameter
(function() {
    'use strict';

    // API Configuration
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://igfm-cms-backend.onrender.com/api';

    // Cache DOM elements
    let loadingEl, errorEl, profileEl, storyEl, sponsorshipEl;

    // Get child ID from URL parameter
    function getChildIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Load child data
    async function loadChildProfile() {
        const childId = getChildIdFromURL();
        
        if (!childId) {
            showError();
            return;
        }
        
        // Cache DOM elements
        loadingEl = document.getElementById('loading');
        errorEl = document.getElementById('error-message');
        profileEl = document.getElementById('child-profile');
        storyEl = document.getElementById('child-story-section');
        sponsorshipEl = document.getElementById('sponsorship-section');
        
        // Show loading indicator
        if (loadingEl) loadingEl.style.display = 'block';
        
        try {
            // Fetch children data from API
            const response = await fetch(`${API_URL}/children`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch children data`);
            }
            
            const data = await response.json();
            const child = data.children.find(c => c.id === childId);
            
            if (!child) {
                showError();
                return;
            }
            
            // Display child data
            displayChildProfile(child);
            
        } catch (error) {
            console.error('Error loading child profile:', error);
            showError();
        } finally {
            if (loadingEl) loadingEl.style.display = 'none';
        }
    }
    }
}

// Display child profile data
function displayChildProfile(child) {
    // Update page title and meta description
    document.getElementById('page-title').textContent = `Sponsor ${child.name} - IGFM`;
    document.getElementById('page-description').content = `Sponsor ${child.name}, a ${child.age}-year-old ${child.gender.toLowerCase()} from ${child.location}. Transform their life through education, healthcare, and spiritual care.`;
    
    // Update profile header
    document.getElementById('child-image').src = `all_children_images/${child.image || 'placeholder-child.jpg'}`;
    document.getElementById('child-image').alt = child.name;
    document.getElementById('child-name').textContent = child.name;
    document.getElementById('child-birthday').textContent = `${child.birthday} (Age ${child.age})`;
    document.getElementById('child-gender').textContent = child.gender;
    document.getElementById('child-nationality').textContent = child.nationality;
    document.getElementById('child-location').textContent = child.location;
    
    // Update gender icon
    const genderIcon = document.getElementById('gender-icon');
    if (child.gender === 'Female') {
        genderIcon.className = 'fas fa-venus';
    } else {
        genderIcon.className = 'fas fa-mars';
    }
    
    // Update story section
    const firstName = child.name.split(' ')[child.name.split(' ').length - 1]; // Get first name
    document.getElementById('story-title').textContent = `${firstName}'s Story`;
    
    const storyDiv = document.getElementById('child-story');
    storyDiv.innerHTML = '';
    child.story.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        storyDiv.appendChild(p);
    });
    
    // Update CTA section
    document.getElementById('cta-title').textContent = `Will You Help ${firstName} Continue This Journey?`;
    
    let ctaText = `Your sponsorship will provide ${firstName} with continued education, healthcare, nutrition, and spiritual mentorship as ${child.gender === 'Male' ? 'he' : 'she'} grows into the future God has planned for ${child.gender === 'Male' ? 'him' : 'her'}.`;
    
    if (child.dream) {
        ctaText = `Your generous sponsorship will help ${firstName} pursue ${child.gender === 'Male' ? 'his' : 'her'} dream of becoming a ${child.dream} and open new opportunities to grow spiritually, mentally, and physically.`;
    }
    
    document.getElementById('cta-text').textContent = ctaText;
    
    // Update sponsorship section
    document.getElementById('sponsor-title').textContent = `Sponsor ${firstName} Today`;
    document.getElementById('contact-child-name').textContent = firstName;
    
    // Show all sections
    document.getElementById('child-profile').style.display = 'block';
    document.getElementById('child-story-section').style.display = 'block';
    document.getElementById('sponsorship-section').style.display = 'block';
}

    // Show error message
    function showError() {
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'block';
        if (profileEl) profileEl.style.display = 'none';
        if (storyEl) storyEl.style.display = 'none';
        if (sponsorshipEl) sponsorshipEl.style.display = 'none';
    }

    // Load child profile when page loads
    document.addEventListener('DOMContentLoaded', loadChildProfile);
})();
