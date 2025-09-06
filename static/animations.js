// ============================================================================
// CYFOX WEBSITE ANIMATIONS AND VISUAL EFFECTS
// Matrix Rain, Geometric Patterns, Cursor Effects, and Form Handling
// ============================================================================

// Custom Cursor Effects
function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .team-card, input, textarea, select');

    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Matrix Rain Background Effect
function initializeMatrixRain() {
    const matrixCanvas = document.getElementById('matrixCanvas');
    if (!matrixCanvas) return;

    const matrixCtx = matrixCanvas.getContext('2d');

    function resizeMatrix() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }

    resizeMatrix();

    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    let columns = Math.floor(matrixCanvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    function drawMatrix() {
        // Semi-transparent background for trail effect
        matrixCtx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        matrixCtx.fillStyle = '#00ff41';
        matrixCtx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Start matrix rain animation
    const matrixInterval = setInterval(drawMatrix, 35);

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeMatrix();
        columns = Math.floor(matrixCanvas.width / fontSize);
        drops = new Array(columns).fill(1);
    });

    return matrixInterval;
}

// Geometric Background Patterns
function initializeGeometricBackground() {
    const geometricCanvas = document.getElementById('geometricCanvas');
    if (!geometricCanvas) return;

    const geometricCtx = geometricCanvas.getContext('2d');

    function resizeGeometric() {
        geometricCanvas.width = window.innerWidth;
        geometricCanvas.height = window.innerHeight;
    }

    resizeGeometric();

    let time = 0;

    function drawGeometric() {
        geometricCtx.clearRect(0, 0, geometricCanvas.width, geometricCanvas.height);

        const centerX = geometricCanvas.width / 2;
        const centerY = geometricCanvas.height / 2;

        // Draw mathematical patterns
        for (let i = 0; i < 8; i++) {
            const angle = (time + i * Math.PI / 4) * 0.01;
            const radius = 100 + Math.sin(time * 0.02 + i) * 50;

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Draw dots
            geometricCtx.beginPath();
            geometricCtx.arc(x, y, 2, 0, Math.PI * 2);
            geometricCtx.fillStyle = `hsl(${120 + i * 30}, 100%, 50%)`;
            geometricCtx.fill();

            // Connect points with lines
            if (i > 0) {
                const prevAngle = (time + (i-1) * Math.PI / 4) * 0.01;
                const prevRadius = 100 + Math.sin(time * 0.02 + (i-1)) * 50;
                const prevX = centerX + Math.cos(prevAngle) * prevRadius;
                const prevY = centerY + Math.sin(prevAngle) * prevRadius;

                geometricCtx.beginPath();
                geometricCtx.moveTo(prevX, prevY);
                geometricCtx.lineTo(x, y);
                geometricCtx.strokeStyle = `rgba(0, 255, 65, ${0.1 + Math.sin(time * 0.01) * 0.05})`;
                geometricCtx.lineWidth = 1;
                geometricCtx.stroke();
            }
        }

        time++;
        requestAnimationFrame(drawGeometric);
    }

    drawGeometric();

    // Handle window resize
    window.addEventListener('resize', resizeGeometric);
}

// Particle System for Additional Effects
function initializeParticles() {
    // Create particle canvas
    const particleCanvas = document.createElement('canvas');
    particleCanvas.className = 'particles';
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.zIndex = '-1';
    document.body.appendChild(particleCanvas);

    const particleCtx = particleCanvas.getContext('2d');

    function resizeParticles() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    resizeParticles();

    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.life = Math.random() * 100 + 100;
            this.maxLife = this.life;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;

            if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;

            if (this.life <= 0) {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.life = this.maxLife;
            }
        }

        draw() {
            const alpha = this.life / this.maxLife;
            particleCtx.save();
            particleCtx.globalAlpha = alpha * 0.5;
            particleCtx.beginPath();
            particleCtx.arc(this.x, this.y, 1, 0, Math.PI * 2);
            particleCtx.fillStyle = '#00ff41';
            particleCtx.fill();
            particleCtx.restore();
        }
    }

    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();

            // Connect nearby particles
            for (let j = index + 1; j < particles.length; j++) {
                const dx = particle.x - particles[j].x;
                const dy = particle.y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    particleCtx.save();
                    particleCtx.globalAlpha = (100 - distance) / 100 * 0.1;
                    particleCtx.beginPath();
                    particleCtx.moveTo(particle.x, particle.y);
                    particleCtx.lineTo(particles[j].x, particles[j].y);
                    particleCtx.strokeStyle = '#00ff41';
                    particleCtx.lineWidth = 1;
                    particleCtx.stroke();
                    particleCtx.restore();
                }
            }
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Handle window resize
    window.addEventListener('resize', resizeParticles);
}

// Team Slider Animation
function initializeTeamSlider() {
    const slider = document.querySelector('.team-slider');
    const cards = document.querySelectorAll('.team-card');

    if (!slider || !cards.length) return;

    // Clone cards for infinite scroll effect
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        slider.appendChild(clone);
    });
}

// Interactive Mouse Trail Effect
function initializeMouseTrail() {
    const trail = [];
    const maxTrailLength = 20;

    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

        if (trail.length > maxTrailLength) {
            trail.shift();
        }
    });

    function drawTrail() {
        const trailCanvas = document.createElement('canvas');
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
        trailCanvas.style.position = 'fixed';
        trailCanvas.style.top = '0';
        trailCanvas.style.left = '0';
        trailCanvas.style.pointerEvents = 'none';
        trailCanvas.style.zIndex = '9998';
        document.body.appendChild(trailCanvas);

        const trailCtx = trailCanvas.getContext('2d');

        function animateTrail() {
            trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

            const now = Date.now();
            for (let i = 0; i < trail.length - 1; i++) {
                const point = trail[i];
                const age = now - point.time;
                const alpha = Math.max(0, 1 - age / 1000);

                if (alpha > 0) {
                    trailCtx.save();
                    trailCtx.globalAlpha = alpha * 0.3;
                    trailCtx.beginPath();
                    trailCtx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                    trailCtx.fillStyle = '#00ff41';
                    trailCtx.fill();
                    trailCtx.restore();
                }
            }

            // Clean up old points
            const cutoff = now - 1000;
            while (trail.length > 0 && trail[0].time < cutoff) {
                trail.shift();
            }

            requestAnimationFrame(animateTrail);
        }

        animateTrail();
    }

    drawTrail();
}

// Form Handling with Enhanced Animation
function initializeFormHandling() {
    const form = document.getElementById('membershipForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            experience: document.getElementById('experience').value,
            interests: document.getElementById('interests').value,
            motivation: document.getElementById('motivation').value,
            timestamp: new Date().toISOString(),
            sessionId: Date.now() + Math.random().toString(36).substr(2, 9)
        };

        // Enhanced form submission with tracking data
        try {
            const response = await fetch('/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    fingerprint: window.fingerprintData || {},
                    userAgent: navigator.userAgent,
                    screenResolution: `${screen.width}x${screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })
            });

            const result = await response.json();

            // Animated form submission feedback
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'PROCESSING...';
            submitBtn.style.background = 'linear-gradient(45deg, #ff0080, #00d4ff)';

            setTimeout(() => {
                if (result.status === 'success') {
                    submitBtn.textContent = 'WELCOME TO CYFOX!';
                    submitBtn.style.background = 'linear-gradient(45deg, #00ff41, #00d4ff)';

                    // Add success effect
                    submitBtn.style.boxShadow = '0 0 30px rgba(0, 255, 65, 0.7)';

                    // Reset form after success
                    setTimeout(() => {
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'linear-gradient(45deg, var(--primary-neon), var(--tertiary-neon))';
                        submitBtn.style.boxShadow = '';
                    }, 3000);
                } else {
                    submitBtn.textContent = 'ERROR - TRY AGAIN';
                    submitBtn.style.background = 'linear-gradient(45deg, #ff4444, #ff0080)';

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'linear-gradient(45deg, var(--primary-neon), var(--tertiary-neon))';
                    }, 2000);
                }
            }, 1500);

        } catch (error) {
            console.error('Form submission error:', error);

            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'NETWORK ERROR';
            submitBtn.style.background = 'linear-gradient(45deg, #ff4444, #ff0080)';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'linear-gradient(45deg, var(--primary-neon), var(--tertiary-neon))';
            }, 2000);
        }
    });

    // Enhanced form input effects
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Typing effect for text inputs
        if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
            input.addEventListener('input', function() {
                const glow = Math.random() * 0.3 + 0.1;
                this.style.boxShadow = `0 0 ${20 * glow}px rgba(0, 255, 65, ${glow})`;

                setTimeout(() => {
                    this.style.boxShadow = '';
                }, 300);
            });
        }
    });
}

// Parallax Scrolling Effect
function initializeParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.matrix-bg, .geometric-bg');

        parallax.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Additional parallax effects for sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const speed = 0.1 * (index + 1);

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const translateY = (window.innerHeight - rect.top) * speed;
                section.style.transform = `translateY(${translateY}px)`;
            }
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Visual effects on scroll
function initializeScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Add special effects for certain elements
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
                if (entry.target.classList.contains('team-card')) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .team-card, .form-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Performance optimization
function optimizePerformance() {
    // Reduce animation frequency when tab is not visible
    let isVisible = true;

    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;

        // Pause/resume animations based on visibility
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.globalAlpha = isVisible ? 1 : 0.3;
            }
        });
    });

    // Throttle scroll events
    let ticking = false;
    function updateScrollEffects() {
        // Scroll effects code would go here
        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate);
}

// Initialize all animations when DOM is loaded
function initializeAllAnimations() {
    try {
        initializeCustomCursor();
        initializeMatrixRain();
        initializeGeometricBackground();
        initializeParticles();
        initializeTeamSlider();
        initializeMouseTrail();
        initializeFormHandling();
        initializeParallaxEffect();
        initializeSmoothScrolling();
        initializeScrollEffects();
        optimizePerformance();

        console.log('CYFOX animations initialized successfully');
    } catch (error) {
        console.error('Animation initialization error:', error);
    }
}

// Initialize animations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllAnimations);
} else {
    initializeAllAnimations();
}

// Handle window resize for all canvas elements
window.addEventListener('resize', () => {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        if (canvas.id === 'matrixCanvas' || canvas.id === 'geometricCanvas' || canvas.classList.contains('particles')) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});

// Export functions for potential external use
window.cyfoxAnimations = {
    initializeCustomCursor,
    initializeMatrixRain,
    initializeGeometricBackground,
    initializeParticles,
    initializeTeamSlider,
    initializeMouseTrail,
    initializeFormHandling,
    initializeParallaxEffect,
    initializeSmoothScrolling,
    initializeScrollEffects
};
