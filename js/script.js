// Hero Video Autoplay
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        console.log('Video element found:', heroVideo);
        
        // Set video properties
        heroVideo.muted = true;
        heroVideo.volume = 0;
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');
        
        // Try to play immediately
        const playPromise = heroVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video is playing successfully!');
            }).catch(error => {
                console.error('Autoplay failed:', error);
                console.log('Trying to play on user interaction...');
                
                // Fallback: play on any user interaction
                const playOnInteraction = () => {
                    heroVideo.play()
                        .then(() => console.log('Video started after user interaction'))
                        .catch(err => console.error('Play still failed:', err));
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                };
                
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('touchstart', playOnInteraction);
            });
        }
        
        // Log video events for debugging
        heroVideo.addEventListener('loadeddata', () => console.log('Video data loaded'));
        heroVideo.addEventListener('canplay', () => console.log('Video can play'));
        heroVideo.addEventListener('playing', () => console.log('Video is playing'));
        heroVideo.addEventListener('error', (e) => console.error('Video error:', e));
    } else {
        console.error('Video element not found!');
    }
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
document.querySelectorAll('.program-card, .impact-card, .donate-card, .benefit').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to your backend
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Sponsorship form handling
const sponsorshipForm = document.getElementById('sponsorshipForm');

if (sponsorshipForm) {
    // Automatically populate child's name from profile
    const profileDetails = document.querySelector('.profile-details');
    const childNameInput = document.getElementById('childNameInput');
    const formTitle = document.getElementById('formTitle');
    const messageLabel = document.querySelector('label[for="comment"]');
    const messagePlaceholder = document.getElementById('comment');
    
    if (profileDetails && childNameInput) {
        const childName = profileDetails.getAttribute('data-child-name') || 
                         profileDetails.querySelector('h1')?.textContent.trim() || 
                         '';
        
        // Set the hidden input value
        childNameInput.value = childName;
        
        // Update form title dynamically
        if (formTitle && childName) {
            formTitle.textContent = `Sponsor ${childName}`;
        }
        
        // Update message label and placeholder
        const firstName = childName.split(' ')[0];
        if (messageLabel && firstName) {
            messageLabel.textContent = `Message to ${firstName} (Optional)`;
        }
        if (messagePlaceholder && firstName) {
            messagePlaceholder.placeholder = `Send a message of encouragement to ${firstName}...`;
        }
    }
    
    // Handle custom amount toggle
    const donationAmountSelect = document.getElementById('donationAmount');
    const customAmountGroup = document.getElementById('customAmountGroup');
    const customAmountInput = document.getElementById('customAmount');
    
    if (donationAmountSelect && customAmountGroup) {
        donationAmountSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customAmountGroup.style.display = 'block';
                customAmountInput.required = true;
            } else {
                customAmountGroup.style.display = 'none';
                customAmountInput.required = false;
                customAmountInput.value = '';
            }
        });
    }
    
    sponsorshipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(sponsorshipForm);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        if (!data.firstName || !data.lastName || !data.email || !data.phone || 
            !data.address || !data.city || !data.state || !data.zipCode || 
            !data.country || !data.donationAmount || !data.paymentMethod) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate custom amount if selected
        if (data.donationAmount === 'custom') {
            if (!data.customAmount || parseFloat(data.customAmount) < 35) {
                alert('Please enter a custom amount of at least $35.');
                return;
            }
        }
        
        // Get the sponsorship amount
        const amount = data.donationAmount === 'custom' ? data.customAmount : data.donationAmount;
        
        // Here you would normally send the data to your backend
        console.log('Sponsorship form submitted:', data);
        
        // Show success message with child's name
        const childName = data.childName || 'this child';
        alert(`Thank you for choosing to sponsor ${childName} with $${amount}/month!\n\nOur team will contact you within 24 hours at ${data.email} to finalize your sponsorship and payment setup.\n\nWe're excited to have you join our mission!`);
        
        // Reset form
        sponsorshipForm.reset();
        if (customAmountGroup) {
            customAmountGroup.style.display = 'none';
        }
    });
}

// Counter animation for impact numbers
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }
    }, 16);
}

// Trigger counter animation when impact section is visible
const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.impact-number');
            numbers.forEach(number => {
                const target = parseInt(number.textContent.replace(/[^0-9]/g, ''));
                animateCounter(number, target);
            });
            impactObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const impactSection = document.querySelector('.impact');
if (impactSection) {
    impactObserver.observe(impactSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Add year to footer
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
}
