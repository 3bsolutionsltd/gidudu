// Ambassador Loader Script
document.addEventListener('DOMContentLoaded', async function() {
    const ambassadorsGrid = document.getElementById('ambassadors-grid');
    
    if (!ambassadorsGrid) return;

    try {
        // Check if running locally or on production
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiUrl = isLocal ? 'http://localhost:3000' : 'https://api.gidudu.org';
        
        // Fetch ambassadors data
        const response = await fetch(`${apiUrl}/api/ambassadors`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch ambassadors');
        }
        
        const ambassadors = await response.json();
        
        // Clear loading message
        ambassadorsGrid.innerHTML = '';
        
        // Display ambassadors
        if (ambassadors && ambassadors.length > 0) {
            ambassadors.forEach(ambassador => {
                const ambassadorCard = createAmbassadorCard(ambassador);
                ambassadorsGrid.appendChild(ambassadorCard);
            });
        } else {
            ambassadorsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No ambassadors found at this time.</p>';
        }
    } catch (error) {
        console.error('Error loading ambassadors:', error);
        ambassadorsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p>Unable to load ambassadors at this time. Please try again later.</p>
            </div>
        `;
    }
});

function createAmbassadorCard(ambassador) {
    const card = document.createElement('div');
    card.className = 'ambassador-card';
    
    // Determine color based on index for gradient variety
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ];
    const gradient = colors[ambassador.id % colors.length];
    
    card.innerHTML = `
        <div class="ambassador-header" style="background: ${gradient}">
            <h3>${ambassador.name}</h3>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${ambassador.location}</p>
        </div>
        <div class="ambassador-image">
            <img src="${ambassador.image}" alt="${ambassador.name}" loading="lazy" onerror="this.src='images/igfm-logo.png'">
        </div>
        <div class="ambassador-content">
            <p>${ambassador.bio}</p>
            ${ambassador.quote ? `<div class="ambassador-quote">"${ambassador.quote}"</div>` : ''}
        </div>
    `;
    
    return card;
}
