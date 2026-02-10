/**
 * Sponsor Page - Dynamic Children Loading
 * Loads children from server/data/children.json and provides filtering/pagination
 */

let allChildren = [];
let filteredChildren = [];
let currentPage = 1;
const childrenPerPage = 12;

// Load children data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadChildren();
    setupEventListeners();
});

async function loadChildren() {
    try {
        const response = await fetch('server/data/children.json');
        const data = await response.json();
        allChildren = data.children || [];
        
        // Sort children by name
        allChildren.sort((a, b) => a.name.localeCompare(b.name));
        
        filteredChildren = [...allChildren];
        displayChildren();
        updateStats();
    } catch (error) {
        console.error('Error loading children:', error);
        document.getElementById('children-grid').innerHTML = 
            '<p style="grid-column: 1/-1; text-align: center; color: #666;">Unable to load children. Please try again later.</p>';
    }
}

function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Gender filter
    const genderFilter = document.getElementById('gender-filter');
    if (genderFilter) {
        genderFilter.addEventListener('change', handleFilter);
    }
    
    // Age filter
    const ageFilter = document.getElementById('age-filter');
    if (ageFilter) {
        ageFilter.addEventListener('change', handleFilter);
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    filteredChildren = allChildren.filter(child => {
        return child.name.toLowerCase().includes(searchTerm);
    });
    
    applyFilters();
}

function handleFilter() {
    const genderFilter = document.getElementById('gender-filter')?.value;
    const ageFilter = document.getElementById('age-filter')?.value;
    
    filteredChildren = allChildren.filter(child => {
        let matches = true;
        
        // Gender filter
        if (genderFilter && genderFilter !== 'all') {
            matches = matches && child.gender.toLowerCase() === genderFilter.toLowerCase();
        }
        
        // Age filter
        if (ageFilter && ageFilter !== 'all') {
            const age = child.age;
            if (ageFilter === '5-10') {
                matches = matches && age >= 5 && age <= 10;
            } else if (ageFilter === '11-15') {
                matches = matches && age >= 11 && age <= 15;
            } else if (ageFilter === '16+') {
                matches = matches && age >= 16;
            }
        }
        
        return matches;
    });
    
    // Apply search if there's text in search box
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filteredChildren = filteredChildren.filter(child => 
            child.name.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayChildren();
    updateStats();
}

function applyFilters() {
    handleFilter();
}

function displayChildren() {
    const grid = document.getElementById('children-grid');
    if (!grid) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * childrenPerPage;
    const endIndex = startIndex + childrenPerPage;
    const childrenToShow = filteredChildren.slice(startIndex, endIndex);
    
    // Clear grid
    grid.innerHTML = '';
    
    if (childrenToShow.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 3rem;">No children found matching your criteria.</p>';
        updatePagination();
        return;
    }
    
    // Create child cards
    childrenToShow.forEach(child => {
        const card = createChildCard(child);
        grid.appendChild(card);
    });
    
    updatePagination();
}

function createChildCard(child) {
    const card = document.createElement('div');
    card.className = 'child-card';
    
    const birthYear = child.birthday ? new Date(child.birthday).getFullYear() : 'Unknown';
    const genderIcon = child.gender === 'Male' ? 'mars' : 'venus';
    const imagePath = child.image ? `all_children_images/${child.image}` : 'images/placeholder-child.jpg';
    
    // Get first paragraph of story or truncate
    let shortStory = '';
    if (child.story && child.story.length > 0) {
        shortStory = child.story[0].substring(0, 120) + '...';
    } else {
        shortStory = `${child.name} is waiting for a sponsor to provide education, healthcare, and hope for a brighter future.`;
    }
    
    card.innerHTML = `
        <div class="child-image">
            <img src="${imagePath}" alt="${child.name}" loading="lazy" onerror="this.src='images/placeholder-child.jpg'">
            <div class="child-overlay">
                <a href="child.html?id=${child.id}" class="btn btn-primary">View Profile</a>
            </div>
        </div>
        <div class="child-info">
            <h3>${child.name}</h3>
            <div class="child-details">
                <span><i class="fas fa-birthday-cake"></i> ${birthYear}</span>
                <span><i class="fas fa-${genderIcon}"></i> ${child.gender}</span>
                <span><i class="fas fa-map-marker-alt"></i> Age ${child.age}</span>
            </div>
            <p>${shortStory}</p>
            <a href="child.html?id=${child.id}" class="btn btn-outline">Sponsor ${child.name.split(' ')[0]}</a>
        </div>
    `;
    
    return card;
}

function updatePagination() {
    const paginationContainer = document.getElementById('pagination-controls');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredChildren.length / childrenPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})" class="page-btn"><i class="fas fa-chevron-left"></i> Previous</button>`;
    }
    
    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)" class="page-num">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button onclick="changePage(${i})" class="page-num ${activeClass}">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages})" class="page-num">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})" class="page-btn">Next <i class="fas fa-chevron-right"></i></button>`;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    displayChildren();
    
    // Scroll to top of children section
    const childrenSection = document.querySelector('.children-section');
    if (childrenSection) {
        childrenSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateStats() {
    const statsContainer = document.getElementById('children-stats');
    if (statsContainer) {
        const total = filteredChildren.length;
        const totalAll = allChildren.length;
        
        if (total === totalAll) {
            statsContainer.innerHTML = `<p>Showing all <strong>${total}</strong> children</p>`;
        } else {
            statsContainer.innerHTML = `<p>Showing <strong>${total}</strong> of <strong>${totalAll}</strong> children</p>`;
        }
    }
}

// Utility: Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make changePage globally accessible
window.changePage = changePage;
