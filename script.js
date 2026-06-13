/**
 * ZANDSE LUXURY EVENT PLANNING - SCRIPTS
 * Advanced Vanilla JS for interactive experiences
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Preloader --- */
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loading-progress');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress > 100) progress = 100;
        progressBar.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    initAnimations(); // Trigger initial animations
                }, 1000);
            }, 500);
        }
    }, 100);

    /* --- 2. Custom Cursor --- */
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Slight delay for follower
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        const hoverElements = document.querySelectorAll('a, button, .portfolio-card, .service-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* --- 3. Magnetic Magnetic Buttons --- */
    const magneticEls = document.querySelectorAll('.magnetic-el');
    magneticEls.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const pos = this.getBoundingClientRect();
            const mx = e.clientX - pos.left - pos.width/2;
            const my = e.clientY - pos.top - pos.height/2;
            this.style.transform = `translate(${mx * 0.2}px, ${my * 0.2}px)`;
        });
        el.addEventListener('mouseleave', function() {
            this.style.transform = `translate(0px, 0px)`;
        });
    });

    /* --- 4. Navbar Scroll & Mobile Menu --- */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        // Navbar bg
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

    /* --- 5. Intersection Observer (Scroll Reveal) --- */
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-slide-in, .reveal-scale-in, .reveal-mask');
    
    // We defer observing until preloader finishes (see initAnimations)
    function initAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* --- 6. Parallax engine & 3D Tilt --- */
    const parallaxBg = document.querySelector('.parallax-bg');
    const parallaxImg = document.querySelector('.parallax-img');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Simple bg parallax
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
        
        // Image parallax
        if (parallaxImg) {
            const imgTop = parallaxImg.getBoundingClientRect().top;
            if (imgTop < window.innerHeight && imgTop > -parallaxImg.clientHeight) {
                parallaxImg.style.transform = `translateY(${(imgTop - window.innerHeight/2) * -0.1}px)`;
            }
        }
    });

    // 3D Tilt for Service Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* --- 7. Timeline Progress --- */
    const timelineProgress = document.getElementById('timelineProgress');
    const timeline = document.querySelector('.timeline');
    
    if (timeline && timelineProgress) {
        window.addEventListener('scroll', () => {
            const timelineRect = timeline.getBoundingClientRect();
            const viewportHalf = window.innerHeight / 2;
            
            if (timelineRect.top < viewportHalf) {
                let percentage = ((viewportHalf - timelineRect.top) / timelineRect.height) * 100;
                percentage = Math.max(0, Math.min(100, percentage));
                timelineProgress.style.height = `${percentage}%`;
            }
        });
    }

    /* --- 8. Portfolio Filter --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            masonryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(`filter-${filter}`)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400); // match transition duration
                }
            });
        });
    });

    /* --- 9. Testimonials Slider --- */
    const track = document.getElementById('testimonialTrack');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const nextBtn = document.getElementById('nextSlide');
    const prevBtn = document.getElementById('prevSlide');
    const dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentSlide = parseInt(e.target.getAttribute('data-index'));
                updateSlider();
            });
        });

        // Auto slide
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 6000);
    }

    /* --- 10. Contact Form Validation --- */
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
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
                // Simulate AJAX send
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

    /* --- 11. Canvas Particle System (Golden Dust) --- */
    function initParticles(canvasId, particleCount, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5 + -0.2, // slight upward drift
                    alpha: Math.random() * 0.5 + 0.1
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap around
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`; // Golden color
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // Init for Hero and Footer
    initParticles('particleCanvas', 150, '#D4AF37');
    initParticles('footerParticleCanvas', 100, '#D4AF37');

});
