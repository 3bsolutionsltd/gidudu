// CMS Content Loader
// This script fetches dynamic content from the backend CMS

// Use environment-aware API URL
const CMS_API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://igfm-cms-backend.onrender.com/api';

const CMS_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://igfm-cms-backend.onrender.com';

// Helper function to get full URL for media files
function getMediaURL(src) {
    if (src.startsWith('http')) return src;
    return CMS_BASE_URL + (src.startsWith('/') ? src : '/' + src);
}

// Load hero slideshow slides
async function loadHeroSlides() {
    try {
        const response = await fetch(`${CMS_API_URL}/hero`);
        if (!response.ok) {
            console.warn('Failed to fetch hero slides, using default');
            return;
        }

        const data = await response.json();
        const activeSlides = data.slides.filter(slide => slide.active);

        if (activeSlides.length === 0) {
            console.warn('No active slides found');
            return;
        }

        // Get hero section
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Remove existing video/image
        const existingMedia = heroSection.querySelector('.hero-video, .hero-slideshow');
        if (existingMedia) {
            existingMedia.remove();
        }

        if (activeSlides.length === 1) {
            // Single slide - create video or image element
            const slide = activeSlides[0];
            if (slide.type === 'video') {
                const video = document.createElement('video');
                video.className = 'hero-video';
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.preload = 'auto';
                
                const source = document.createElement('source');
                source.src = getMediaURL(slide.src);
                source.type = 'video/mp4';
                video.appendChild(source);

                heroSection.insertBefore(video, heroSection.firstChild);
            } else {
                const img = document.createElement('img');
                img.className = 'hero-video'; // Reuse same class for styling
                img.src = getMediaURL(slide.src);
                img.alt = slide.title || 'Hero image';
                heroSection.insertBefore(img, heroSection.firstChild);
            }

            // Update hero content if title/subtitle exist
            if (slide.title) {
                const heroTitle = document.querySelector('.hero-title');
                if (heroTitle) heroTitle.textContent = slide.title;
            }
            if (slide.subtitle) {
                const heroSubtitle = document.querySelector('.hero-subtitle');
                if (heroSubtitle) heroSubtitle.textContent = slide.subtitle;
            }
        } else {
            // Multiple slides - create slideshow
            const slideshow = document.createElement('div');
            slideshow.className = 'hero-slideshow';
            
            activeSlides.forEach((slide, index) => {
                const slideDiv = document.createElement('div');
                slideDiv.className = 'hero-slide' + (index === 0 ? ' active' : '');
                
                if (slide.type === 'video') {
                    const video = document.createElement('video');
                    video.autoplay = index === 0;
                    video.muted = true;
                    video.loop = true;
                    video.playsInline = true;
                    video.preload = 'auto';
                    
                    const source = document.createElement('source');
                    source.src = getMediaURL(slide.src);
                    source.type = 'video/mp4';
                    video.appendChild(source);
                    
                    slideDiv.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = getMediaURL(slide.src);
                    img.alt = slide.title || 'Hero slide';
                    slideDiv.appendChild(img);
                }

                // Add text overlay if title/subtitle exist
                if (slide.title || slide.subtitle) {
                    const textOverlay = document.createElement('div');
                    textOverlay.className = 'slide-text-overlay';
                    if (slide.title) {
                        const title = document.createElement('h2');
                        title.textContent = slide.title;
                        textOverlay.appendChild(title);
                    }
                    if (slide.subtitle) {
                        const subtitle = document.createElement('p');
                        subtitle.textContent = slide.subtitle;
                        textOverlay.appendChild(subtitle);
                    }
                    slideDiv.appendChild(textOverlay);
                }

                slideshow.appendChild(slideDiv);
            });

            heroSection.insertBefore(slideshow, heroSection.firstChild);

            // Add slideshow navigation
            if (activeSlides.length > 1) {
                addSlideshowControls(slideshow, activeSlides.length);
                startSlideshow(slideshow);
            }
        }

    } catch (error) {
        console.error('Error loading hero slides:', error);
        // Keep default video if loading fails
    }
}

function addSlideshowControls(slideshow, slideCount) {
    const controls = document.createElement('div');
    controls.className = 'slideshow-controls';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slideshow-btn prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.onclick = () => changeSlide(-1);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slideshow-btn next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.onclick = () => changeSlide(1);
    
    // Dots
    const dots = document.createElement('div');
    dots.className = 'slideshow-dots';
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(i);
        dots.appendChild(dot);
    }
    
    controls.appendChild(prevBtn);
    controls.appendChild(dots);
    controls.appendChild(nextBtn);
    
    slideshow.parentElement.appendChild(controls);
}

let currentSlide = 0;
let slideshowInterval;

function startSlideshow(slideshow) {
    slideshowInterval = setInterval(() => {
        changeSlide(1);
    }, 7000); // Change slide every 7 seconds
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slideshow-dots .dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Pause and play videos
    const currentVideo = slides[currentSlide].querySelector('video');
    if (currentVideo) {
        currentVideo.play();
    }
    
    // Reset interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => changeSlide(1), 7000);
    }
}

function goToSlide(index) {
    const diff = index - currentSlide;
    changeSlide(diff);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHeroSlides();
});
