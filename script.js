// 1. Typing Effect for Hero Section
const typingText = document.querySelector('.typing-text');
const roles = ["Computer Engineering Student", "Computer Networks Engineering", "Web Developer", "IoT Enthusiast", "Tech Innovator"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 150;

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// 2. Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');
    
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

// 3. Reveal Elements on Scroll
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .project-card').forEach(el => observer.observe(el));

// 4. Smooth Scrolling
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// 5. REAL Email Submission via EmailJS
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Change button state
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    // Replace with your actual Service ID and Template ID from EmailJS
    const serviceID = "service_x8atasd";
    const templateID = "template_8ek1mqp";

    const templateParams = {
        from_name: document.getElementById('name').value,
        reply_to: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            formStatus.innerHTML = "Message sent successfully! I'll get back to you soon.";
            formStatus.style.color = "#22c55e"; // Green
            contactForm.reset();
        }, (error) => {
            formStatus.innerHTML = "Oops! Something went wrong. Please try again.";
            formStatus.style.color = "#ef4444"; // Red
            console.log('FAILED...', error);
        })
        .finally(() => {
            submitBtn.innerText = "Send Message";
            submitBtn.disabled = false;
        });
});

// 6. Carousel Functionality for Certifications
let currentCertIndex = 0;
let slideTimer;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!slides.length) return;

    // Attach Event Listeners to Arrows
    if (prevBtn) prevBtn.addEventListener('click', () => shiftSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => shiftSlide(1));

    startAutoPlay();
}

function shiftSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;

    // 1. Hide current slide
    slides[currentCertIndex].classList.remove('active');

    // 2. Calculate next index (Infinite Loop)
    currentCertIndex = (currentCertIndex + n + slides.length) % slides.length;

    // 3. Show new slide
    slides[currentCertIndex].classList.add('active');

    resetAutoPlay();
}

function startAutoPlay() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(() => shiftSlide(1), 5000);
}

function resetAutoPlay() {
    clearInterval(slideTimer);
    startAutoPlay();
}

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    // type(); // Re-add your typing effect call here
});

// Back to Top Button
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Init
document.addEventListener('DOMContentLoaded', type);