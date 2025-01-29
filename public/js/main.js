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

    // Header scroll behavior
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    let scrollDelta = 5; // Minimum scroll difference to trigger header movement

    function onScroll() {
        if (frameId) {
            return;
        }

        frameId = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const difference = Math.abs(currentScrollY - lastScrollY);
            
            // Only trigger header movement if scroll difference is significant
            if (difference > scrollDelta) {
                if (currentScrollY > lastScrollY && currentScrollY > 70) {
                    // Scrolling down
                    if (!isScrollingDown) {
                        header.classList.add('header-hidden');
                        header.classList.remove('header-visible');
                        isScrollingDown = true;
                    }
                } else if (currentScrollY < lastScrollY || currentScrollY <= 70) {
                    // Scrolling up or at top
                    if (isScrollingDown) {
                        header.classList.remove('header-hidden');
                        header.classList.add('header-visible');
                        isScrollingDown = false;
                    }
                }
            }

            lastScrollY = currentScrollY;
            frameId = null;
        });
    }

    // Debounced scroll event with higher delay for smoother transitions
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                onScroll();
                scrollTimeout = null;
            }, 16); // Approximately 60fps
        }
    }, { passive: true });

    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
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

    // Animate skill bars on scroll
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.querySelector('.skill-level');
                skillLevel.style.width = skillLevel.getAttribute('data-width') || skillLevel.style.width;
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });
}); 