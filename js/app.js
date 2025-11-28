/**
 * Ayman Customs Clearance & Transportation
 * Main Application Script (Arabic / RTL)
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounters();
    initTestimonialSlider();
    initContactForm();
});

/**
 * 1. Sticky Header
 * Shrinks header on scroll > 100px
 */
function initStickyHeader() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    });
}

/**
 * 2. Mobile Menu
 * Toggles navigation and handles focus trap
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isMenuOpen);

        if (isMenuOpen) {
            body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            body.style.overflow = '';
        }
    }

    toggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !nav.contains(e.target) && !toggle.contains(e.target)) {
            toggleMenu();
        }
    });

    // Focus Trap (Simple version)
    nav.addEventListener('keydown', (e) => {
        if (!isMenuOpen) return;

        const focusableElements = nav.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

/**
 * 3. Smooth Scroll
 * Handles anchor links with header offset
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

/**
 * 4. Scroll Animations
 * Uses Intersection Observer to trigger fade-in effects
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * 5. Animated Counters
 * Counts up numbers when scrolled into view
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200; // The lower the slower

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');

                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * 6. Testimonial Slider
 * Auto-rotating slider (RTL Adjusted)
 */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const slideCount = slides.length;
    const intervalTime = 5000;
    let slideInterval;

    function updateSlider() {
        // RTL Logic: Positive translateX to move track right (revealing left items)
        track.style.transform = `translateX(${currentSlide * 100}%)`;

        // Update active classes
        slides.forEach((slide, index) => {
            if (index === currentSlide) slide.classList.add('active');
            else slide.classList.remove('active');
        });

        dots.forEach((dot, index) => {
            if (index === currentSlide) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Event Listeners for Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Start Auto Play
    slideInterval = setInterval(nextSlide, intervalTime);
}

