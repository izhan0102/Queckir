// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeHeaderScroll();
    initializeSmoothScroll();
    initializeSkillBars();
});

// Mobile menu functionality
function initializeMobileMenu() {
    const menuBtn = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
}

// Header scroll behavior
function initializeHeaderScroll() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY) {
            // Scrolling down
            header.classList.add('header-hidden');
            header.classList.remove('header-visible');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => observer.observe(bar));
}

document.addEventListener('DOMContentLoaded', () => {
    // Create smooth scroll indicator
    const smoothScroll = document.createElement('div');
    smoothScroll.className = 'smooth-scroll';
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    smoothScroll.appendChild(scrollProgress);
    document.body.appendChild(smoothScroll);

    // Variables for scroll handling
    let lastScrollTop = 0;
    let scrollTimeout;
    let isScrolling = false;

    // Handle scroll effects
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        // Update scroll progress
        scrollProgress.style.height = `${scrollPercent}%`;

        // Header effects
        const header = document.querySelector('header');
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.85)';
            header.style.backdropFilter = 'blur(10px)';
        }

        // Wind scroll effect
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('scrolling');
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('scrolling');
            document.body.classList.add('scroll-stop');
            setTimeout(() => {
                document.body.classList.remove('scroll-stop');
            }, 200);
        }, 150);

        lastScrollTop = scrollTop;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .hero-content, .cta').forEach(el => {
        observer.observe(el);
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Subtle parallax effect for geometric patterns
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelector('.hero::before').style.transform = 
            `translate(${moveX}px, ${moveY}px)`;
    });
}); 