// Language translations
const translations = {
    en: {},
    ta: {}
};

// Initialize translations from data attributes
function initializeTranslations() {
    document.querySelectorAll('[data-en]').forEach(element => {
        const key = element.getAttribute('data-en');
        const taValue = element.getAttribute('data-ta');
        if (!translations.en[key]) {
            translations.en[key] = key;
        }
        if (taValue && !translations.ta[key]) {
            translations.ta[key] = taValue;
        }
    });
}

// Current language state
let currentLang = 'en';

// Language toggle functionality
function initLanguageToggle() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            if (lang !== currentLang) {
                switchLanguage(lang);
            }
        });
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(button => {
        const btnLang = button.getAttribute('data-lang');
        if (btnLang === lang) {
            button.classList.add('active');
            button.setAttribute('aria-checked', 'true');
        } else {
            button.classList.remove('active');
            button.setAttribute('aria-checked', 'false');
        }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        const enText = element.getAttribute('data-en');
        const taText = element.getAttribute('data-ta');
        
        if (lang === 'ta' && taText) {
            element.textContent = taText;
        } else {
            element.textContent = enText;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Store preference
    localStorage.setItem('preferredLanguage', lang);
}

// Load preferred language
function loadPreferredLanguage() {
    const preferredLang = localStorage.getItem('preferredLanguage');
    if (preferredLang && (preferredLang === 'en' || preferredLang === 'ta')) {
        switchLanguage(preferredLang);
    }
}

// Mobile navigation toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Sticky header
function initStickyHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Timeline navigation
function initTimeline() {
    const timelineContainer = document.querySelector('.timeline-container');
    const timeline = document.getElementById('timeline');
    const navLeft = document.querySelector('.timeline-nav-left');
    const navRight = document.querySelector('.timeline-nav-right');
    
    if (!timelineContainer || !timeline || !navLeft || !navRight) return;
    
    const scrollAmount = 340; // Width of timeline item + gap
    
    function updateNavButtons() {
        const scrollLeft = timelineContainer.scrollLeft;
        const maxScroll = timelineContainer.scrollWidth - timelineContainer.clientWidth;
        
        navLeft.disabled = scrollLeft <= 0;
        navRight.disabled = scrollLeft >= maxScroll - 1;
    }
    
    navLeft.addEventListener('click', () => {
        timelineContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    navRight.addEventListener('click', () => {
        timelineContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update button states on scroll
    timelineContainer.addEventListener('scroll', updateNavButtons);
    
    // Initial state
    updateNavButtons();
    
    // Update on resize
    window.addEventListener('resize', updateNavButtons);
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    timelineContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    timelineContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left
                timelineContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                // Swipe right
                timelineContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    // Keyboard navigation
    timelineContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navLeft.click();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navRight.click();
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#donate' || href === '#events' || href === '#get-involved') {
                // These are CTAs that might need custom handling
                // For now, let them scroll normally
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
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
    
    // Observe cards and sections
    const animatedElements = document.querySelectorAll('.mission-card, .event-card, .resource-card, .volunteer-area, .timeline-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form validation (for membership form if needed)
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    field.setAttribute('aria-invalid', 'true');
                } else {
                    field.classList.remove('error');
                    field.setAttribute('aria-invalid', 'false');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    });
}

// Accessibility: Skip to main content
function initSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Handle external links
function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        // Add screen reader text for external links
        if (!link.querySelector('.sr-only')) {
            const srText = document.createElement('span');
            srText.className = 'sr-only';
            srText.textContent = ' (opens in new window)';
            link.appendChild(srText);
        }
    });
}

// Add screen reader only class to CSS
function addSROnlyStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(style);
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add screen reader styles
    addSROnlyStyles();
    
    // Initialize translations
    initializeTranslations();
    
    // Load preferred language
    loadPreferredLanguage();
    
    // Initialize language toggle
    initLanguageToggle();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize sticky header
    initStickyHeader();
    
    // Initialize timeline
    initTimeline();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize skip link
    initSkipLink();
    
    // Initialize external links
    initExternalLinks();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or auto-playing content
    } else {
        // Resume animations or auto-playing content
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate any layout-dependent features
        const event = new Event('resize-end');
        window.dispatchEvent(event);
    }, 250);
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });
});

// Console message
console.log('%c🌟 NYTDC Website', 'font-size: 20px; font-weight: bold; color: #c71843;');
console.log('%cBuilding community, celebrating heritage', 'font-size: 14px; color: #666;');
