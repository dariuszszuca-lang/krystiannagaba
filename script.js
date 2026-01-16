// ===== PRELOADER =====
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 800);
    });
});

// ===== NAVIGATION SCROLL =====
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Staggered animation for children
            const children = entry.target.querySelectorAll('.animate-on-scroll');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-item');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count);
                const suffix = counter.dataset.suffix || '';
                const numberEl = counter.querySelector('.stat-number');

                animateCounter(numberEl, 0, target, 2000, suffix);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}

function animateCounter(element, start, end, duration, suffix) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + range * easeOutQuart);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== PARTICLES =====
function createParticlesInContainer(containerId, particleCount = 50) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
        `;

        container.appendChild(particle);
    }
}

// Add particle animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translateY(-100px) translateX(50px);
        }
    }
`;
document.head.appendChild(style);

// Create particles in hero, book, and projects sections
createParticlesInContainer('particles', 50);
createParticlesInContainer('bookParticles', 35);
createParticlesInContainer('projectsParticles', 35);

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// ===== BUTTON SHINE EFFECT =====
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        const shine = this.querySelector('.btn-shine');
        if (shine) {
            shine.style.left = '-100%';
            setTimeout(() => {
                shine.style.transition = 'left 0.5s ease';
                shine.style.left = '100%';
            }, 10);
        }
    });

    btn.addEventListener('mouseleave', function() {
        const shine = this.querySelector('.btn-shine');
        if (shine) {
            shine.style.transition = 'none';
            shine.style.left = '-100%';
        }
    });
});

// ===== PARALLAX EFFECT =====
const heroVisual = document.querySelector('.hero-visual');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll('.project-card, .social-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== TYPING EFFECT FOR HERO (optional) =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.nav-cta, .btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ===== SCROLL PROGRESS =====
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
document.body.appendChild(scrollProgress);

const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(255,255,255,0.1);
        z-index: 9999;
    }
    .scroll-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #60a5fa);
        width: 0%;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(progressStyle);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector('.scroll-progress-bar').style.width = scrollPercent + '%';
});

// ===== CURSOR GLOW EFFECT =====
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor-glow {
        position: fixed;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .hero:hover .cursor-glow,
    .contact:hover .cursor-glow {
        opacity: 1;
    }
`;
document.head.appendChild(cursorStyle);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

console.log('Krystian Nagaba - Premium Website Loaded');
