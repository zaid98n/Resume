/* ============================================
   ZAID NEZAM — PORTFOLIO SCRIPTS
   Fluid, smooth, and polished interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initCursorGlow();
    initNavbar();
    initMobileNav();
    initRevealAnimations();
    initCounterAnimations();
    initParallaxShapes();
    initMagneticButtons();
    initSkillTagWave();
    initPageLoadAnimation();
});

/* ============================================
   CUSTOM SMOOTH SCROLL (Lerp-based)
   ============================================ */
function initSmoothScroll() {
    // Handle ALL anchor links — this fixes the "Get In Touch" button
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();

        const offset = 80;
        const start = window.scrollY;
        const end = target.getBoundingClientRect().top + window.scrollY - offset;
        const distance = end - start;
        const duration = Math.min(1200, Math.max(600, Math.abs(distance) * 0.5));
        let startTime = null;

        function easeOutQuint(t) {
            return 1 - Math.pow(1 - t, 5);
        }

        function step(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuint(progress);

            window.scrollTo(0, start + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    });
}

/* ============================================
   CURSOR GLOW EFFECT (smoother lerp)
   ============================================ */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 768) return;

    let mouseX = -500, mouseY = -500;
    let glowX = -500, glowY = -500;
    let isVisible = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            glow.style.opacity = '1';
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        glow.style.opacity = '0';
    });

    function animate() {
        // Smoother lerp factor
        const lerpFactor = 0.06;
        glowX += (mouseX - glowX) * lerpFactor;
        glowY += (mouseY - glowY) * lerpFactor;
        glow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   NAVBAR — Smooth show/hide on scroll
   ============================================ */
function initNavbar() {
    const nav = document.getElementById('navbar');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                // Hide nav on fast scroll down, show on scroll up
                if (currentScroll > 400) {
                    if (currentScroll > lastScroll + 5) {
                        nav.classList.add('nav-hidden');
                    } else if (currentScroll < lastScroll - 5) {
                        nav.classList.remove('nav-hidden');
                    }
                } else {
                    nav.classList.remove('nav-hidden');
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Active section highlighting
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('nav-link--active',
                        link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
}

/* ============================================
   MOBILE NAVIGATION — with smooth overlay
   ============================================ */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.contains('open');
        toggle.classList.toggle('active');
        links.classList.toggle('open');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu on link click with a slight delay for feel
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                toggle.classList.remove('active');
                links.classList.remove('open');
                document.body.style.overflow = '';
            }, 150);
        });
    });
}

/* ============================================
   SCROLL REVEAL — Staggered, fluid animations
   ============================================ */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger siblings for a wave effect
                const parent = entry.target.parentElement;
                const siblings = parent ? parent.querySelectorAll('.reveal') : [];
                let delay = 0;

                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) {
                        delay = i * 80; // 80ms stagger between siblings
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Math.min(delay, 400)); // Cap max delay

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATIONS — Smoother easing
   ============================================ */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.hero-stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2200;
    const startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.round(eased * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   PARALLAX BACKGROUND SHAPES
   ============================================ */
function initParallaxShapes() {
    if (window.innerWidth < 768) return;

    const shapes = document.querySelectorAll('.shape');
    let scrollY = 0;
    let targetScrollY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    function updateParallax() {
        scrollY += (targetScrollY - scrollY) * 0.1;

        shapes.forEach((shape, i) => {
            const speed = 0.02 + (i * 0.015);
            const yOffset = scrollY * speed;
            shape.style.transform = `translateY(${-yOffset}px)`;
        });

        if (Math.abs(targetScrollY - scrollY) > 0.5) {
            requestAnimationFrame(updateParallax);
        } else {
            ticking = false;
        }
    }
}

/* ============================================
   MAGNETIC BUTTONS — Subtle pull effect
   ============================================ */
function initMagneticButtons() {
    if (window.innerWidth < 768) return;

    const buttons = document.querySelectorAll('.btn, .contact-card');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => {
                btn.style.transition = '';
            }, 500);
        });
    });
}

/* ============================================
   SKILL TAG WAVE — Sequential glow on scroll
   ============================================ */
function initSkillTagWave() {
    const skillCategories = document.querySelectorAll('.skill-category');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.skill-tag');
                tags.forEach((tag, i) => {
                    setTimeout(() => {
                        tag.classList.add('skill-tag--pop');
                    }, i * 60);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillCategories.forEach(cat => observer.observe(cat));
}

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */
function initPageLoadAnimation() {
    // Small delay so the browser can paint first
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');

        // Trigger hero reveals with cascade
        const heroReveals = document.querySelectorAll('.hero .reveal');
        heroReveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 200 + i * 120);
        });
    });
}
