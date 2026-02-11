/**
 * Sponsorship Page Dynamic Loader
 * Loads sponsorship benefits and payment platforms from CMS
 */

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://gidudu-server.onrender.com';

/**
 * Load and render sponsorship data
 */
async function loadSponsorshipData() {
    try {
        const response = await fetch(`${API_URL}/api/sponsorship`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update header section
        updateHeaderSection(data.header);
        
        // Render benefits
        renderBenefits(data.benefits);
        
        // Update call to action section
        updateCallToAction(data.callToAction);
        
        // Render payment platforms
        renderPaymentPlatforms(data.paymentPlatforms);
        
    } catch (error) {
        console.error('Error loading sponsorship data:', error);
        showError('Unable to load sponsorship information. Please refresh the page.');
    }
}

/**
 * Update header section with dynamic content
 */
function updateHeaderSection(header) {
    const sectionTag = document.querySelector('.sponsorship-intro .section-tag');
    const title = document.querySelector('.sponsorship-intro .section-header h2');
    const description = document.querySelector('.sponsorship-intro .lead');
    
    if (sectionTag && header.sectionTag) {
        sectionTag.textContent = header.sectionTag;
    }
    
    if (title && header.title) {
        title.textContent = header.title;
    }
    
    if (description && header.description) {
        description.textContent = header.description;
    }
}

/**
 * Render sponsorship benefits dynamically
 */
function renderBenefits(benefits) {
    const container = document.querySelector('.sponsorship-benefits');
    
    if (!container) {
        console.error('Benefits container not found');
        return;
    }
    
    // Filter active benefits and sort by order
    const activeBenefits = benefits
        .filter(benefit => benefit.active)
        .sort((a, b) => a.order - b.order);
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create benefit cards
    activeBenefits.forEach(benefit => {
        const card = document.createElement('div');
        card.className = 'benefit-card';
        card.innerHTML = `
            <i class="${benefit.icon}"></i>
            <h3>${benefit.title}</h3>
            <p>${benefit.description}</p>
        `;
        container.appendChild(card);
    });
}

/**
 * Update call to action section
 */
function updateCallToAction(cta) {
    const title = document.querySelector('.cta-content h2');
    const description = document.querySelector('.cta-content > p');
    const paymentTitle = document.querySelector('.donate-options h3');
    const followUpMessage = document.querySelector('.cta-content p[style*="margin-top: 40px"]');
    
    if (title && cta.title) {
        title.textContent = cta.title;
    }
    
    if (description && cta.description) {
        description.textContent = cta.description;
    }
    
    if (paymentTitle && cta.paymentSectionTitle) {
        paymentTitle.textContent = cta.paymentSectionTitle;
    }
    
    if (followUpMessage && cta.followUpMessage) {
        followUpMessage.innerHTML = cta.followUpMessage;
    }
}

/**
 * Render payment platforms dynamically
 */
function renderPaymentPlatforms(platforms) {
    const container = document.querySelector('.payment-platforms');
    
    if (!container) {
        console.error('Payment platforms container not found');
        return;
    }
    
    // Filter active platforms and sort by order
    const activePlatforms = platforms
        .filter(platform => platform.active)
        .sort((a, b) => a.order - b.order);
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create platform buttons
    activePlatforms.forEach(platform => {
        const button = document.createElement('a');
        button.href = platform.url;
        button.target = '_blank';
        button.className = 'platform-btn';
        button.innerHTML = `<i class="${platform.icon}"></i> ${platform.name}`;
        container.appendChild(button);
    });
}

/**
 * Show error message to user
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        border: 1px solid #f5c6cb;
    `;
    errorDiv.textContent = message;
    
    const container = document.querySelector('.sponsorship-intro .container');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSponsorshipData);
} else {
    loadSponsorshipData();
}
