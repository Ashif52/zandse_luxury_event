/**
 * ZANDSE — EVENT PAGES SHARED ENGINE
 * Cinematic scroll-driven interactions for all event pages
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================
       1. PRELOADER
       ======================================== */
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loading-progress');

    if (!preloader) {
        initAllAnimations();
    } else {
        let progress = 0;
        const preloadInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 12) + 5;
            if (progress > 100) progress = 100;
            if (progressBar) progressBar.style.width = `${progress}%`;

            if (progress === 100) {
                clearInterval(preloadInterval);
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        initAllAnimations();
                    }, 1000);
                }, 400);
            }
        }, 80);
    }

    /* ========================================
       2. CUSTOM CURSOR
       ======================================== */
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (window.innerWidth > 768 && cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        const hoverTargets = document.querySelectorAll(
            'a, button, .carousel-card, .package-card, .gallery-item, .theme-pill, .faq-question'
        );
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ========================================
       3. MAGNETIC BUTTONS
       ======================================== */
    const magneticEls = document.querySelectorAll('.magnetic-el');
    magneticEls.forEach(el => {
        el.addEventListener('mousemove', function (e) {
            const pos = this.getBoundingClientRect();
            const mx = e.clientX - pos.left - pos.width / 2;
            const my = e.clientY - pos.top - pos.height / 2;
            this.style.transform = `translate(${mx * 0.2}px, ${my * 0.2}px)`;
        });
        el.addEventListener('mouseleave', function () {
            this.style.transform = `translate(0px, 0px)`;
        });
    });

    /* ========================================
       4. NAVBAR SCROLL + MOBILE MENU
       ======================================== */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
        if (scrollProgress) {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress.style.width = ((winScroll / height) * 100) + '%';
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => mobileMenu.classList.toggle('active'));
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('active'));
        });
    }

    /* ========================================
       5. SCROLL-DRIVEN ANIMATIONS (IntersectionObserver)
       ======================================== */
    function initAllAnimations() {
        const revealElements = document.querySelectorAll(
            '.reveal-fade-up, .reveal-slide-in, .reveal-scale-in, .reveal-mask'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.12
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));

        // Stagger children
        const staggerContainers = document.querySelectorAll('.stagger-children');
        const staggerObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add('active');
                        }, i * 120);
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        staggerContainers.forEach(el => staggerObserver.observe(el));

        // Init split text
        initSplitText();

        // Init counters
        initCounters();
    }

    /* ========================================
       6. TEXT SPLITTING
       ======================================== */
    function initSplitText() {
        const splitTextElements = document.querySelectorAll('.split-text');

        splitTextElements.forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';

            // Handle text with gold-word spans
            const original = el.getAttribute('data-text') || text;
            let charIndex = 0;

            for (let i = 0; i < original.length; i++) {
                const span = document.createElement('span');
                span.classList.add('char');
                span.textContent = original[i] === ' ' ? '\u00A0' : original[i];
                span.style.transitionDelay = `${charIndex * 0.03}s`;
                el.appendChild(span);
                charIndex++;
            }

            // Trigger animation after small delay
            setTimeout(() => {
                el.classList.add('animated');
            }, 600);
        });
    }

    /* ========================================
       7. COUNTER ANIMATION
       ======================================== */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');

        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    const duration = 2000;
                    const start = 0;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease-out quad
                        const eased = 1 - (1 - progress) * (1 - progress);
                        const current = Math.floor(eased * (target - start) + start);

                        el.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = target + suffix;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    /* ========================================
       8. PARALLAX ENGINE
       ======================================== */
    const parallaxLayers = document.querySelectorAll('[data-speed]');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.3;
            const rect = layer.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (scrolled - layer.offsetTop) * speed;
                layer.style.transform = `translateY(${yPos}px)`;
            }
        });

        // Hero background parallax
        const heroOverlayBg = document.querySelector('.page-hero-bg');
        if (heroOverlayBg && scrolled < window.innerHeight) {
            heroOverlayBg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
        }
    });

    /* ========================================
       9. HORIZONTAL SCROLL CAROUSEL
       ======================================== */
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
        const carousel = wrapper.querySelector('.services-carousel');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');

        if (!carousel) return;

        const scrollAmount = 400;

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        // Mouse wheel horizontal scroll
        carousel.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                carousel.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' });
            }
        }, { passive: false });
    });

    /* ========================================
       10. 3D TILT FOR CARDS
       ======================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* ========================================
       11. FAQ ACCORDION
       ======================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(fi => {
                fi.classList.remove('active');
                fi.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Open clicked (if it wasn't already active)
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ========================================
       12. GALLERY LIGHTBOX
       ======================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (lightbox && lightboxImg && img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /* ========================================
       13. TESTIMONIALS AUTO-SLIDER
       ======================================== */
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');
    const slideDots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function updateTestimonialSlider() {
        if (!testimonialTrack) return;
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        slideDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            updateTestimonialSlider();
        });
    }
    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
            updateTestimonialSlider();
        });
    }

    slideDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentSlide = parseInt(e.target.getAttribute('data-index'));
            updateTestimonialSlider();
        });
    });

    // Auto-advance every 5 seconds
    if (testimonialSlides.length > 0) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            updateTestimonialSlider();
        }, 5000);
    }

    /* ========================================
       14. CANVAS PARTICLE SYSTEM (GOLDEN DUST)
       ======================================== */
    function initParticles(canvasId, particleCount) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4 - 0.15,
                    alpha: Math.random() * 0.5 + 0.1
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // Init for hero and footer canvases
    initParticles('particleCanvas', 120);
    initParticles('footerParticleCanvas', 80);

    /* ========================================
       15. CONTACT FORM VALIDATION
       ======================================== */
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let hasError = false;
            const inputs = contactForm.querySelectorAll('.form-control[required]');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    hasError = true;
                    input.closest('.form-group').classList.add('error-shake');
                    setTimeout(() => input.closest('.form-group').classList.remove('error-shake'), 400);
                }
            });

            if (hasError) {
                formMessage.textContent = 'Please fill out all required fields.';
                formMessage.className = 'form-message msg-error';
            } else {
                const btnSpan = contactForm.querySelector('.submit-btn span');
                const originalText = btnSpan.textContent;
                btnSpan.textContent = 'Sending...';

                setTimeout(() => {
                    formMessage.textContent = 'Thank you for your inquiry. Our concierge will contact you shortly.';
                    formMessage.className = 'form-message msg-success';
                    contactForm.reset();
                    btnSpan.textContent = originalText;
                }, 1500);
            }
        });
    }

    /* ========================================
       16. SMOOTH SCROLL FOR ANCHOR LINKS
       ======================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
