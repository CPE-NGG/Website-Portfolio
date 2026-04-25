// --- Initialization ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
        initThree();
        initTyping();
        initCustomCursor();
    }, 2000);
    lucide.createIcons();
});

// --- Mobile Menu Logic ---
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

const toggleMenu = (open) => {
    mobileMenu.style.transform = open ? 'translateX(0)' : 'translateX(100%)';
};

menuToggle.addEventListener('click', () => toggleMenu(true));
menuClose.addEventListener('click', () => toggleMenu(false));

// Close menu when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// --- Improved Comic Star Cursor ---
function initCustomCursor() {
    const container = document.getElementById('custom-cursor-container');
    const star = container.querySelector('.star-cursor');
    let mouseX = 0, mouseY = 0;
    let starX = 0, starY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        createParticle(mouseX, mouseY);
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        
        container.appendChild(particle);

        const animation = particle.animate([
            { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
            { transform: `translate(calc(-50% + ${vx * 50}px), calc(-50% + ${vy * 50}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0, .5, .5, 1)'
        });

        animation.onfinish = () => particle.remove();
    }

    function updateStar() {
        starX += (mouseX - starX) * 0.25;
        starY += (mouseY - starY) * 0.25;

        star.style.left = `${starX}px`;
        star.style.top = `${starY}px`;
        star.style.transform = `translate(-50%, -50%) rotate(${window.scrollY * 0.2 + (starX * 0.1)}deg)`;

        requestAnimationFrame(updateStar);
    }
    updateStar();

    document.querySelectorAll('a, button, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
            star.style.width = '50px';
            star.style.height = '50px';
            star.style.filter = 'drop-shadow(0 0 15px #fff) drop-shadow(0 0 30px var(--primary-magenta))';
        });
        el.addEventListener('mouseleave', () => {
            star.style.width = '30px';
            star.style.height = '30px';
            star.style.filter = 'drop-shadow(0 0 8px #fff) drop-shadow(0 0 15px var(--primary-blue))';
        });
    });
}

// --- Typing Animation ---
function initTyping() {
    const text = document.getElementById('typing-text');
    const phrases = ['Systems Architect', 'Digital Navigator', 'UI Visionary', 'Creative Engineer'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            text.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            text.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 40 : 120;

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2500; 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }
    type();
}

// --- Helper: Create a Glowing Star Texture ---
function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Create a radial gradient (Inner white to outer transparent)
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
}

// --- Three.js Starfield & Planets ---
function initThree() {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const colorPalette = [
        new THREE.Color(0x00d2ff),
        new THREE.Color(0xff00cc),
        new THREE.Color(0x9d50bb),
        new THREE.Color(0xffffff)
    ];

    for(let i = 0; i < starCount * 3; i+=3) {
        positions[i] = (Math.random() - 0.5) * 60; 
        positions[i+1] = (Math.random() - 0.5) * 300; 
        positions[i+2] = (Math.random() - 0.5) * 20;

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i] = col.r;
        colors[i+1] = col.g;
        colors[i+2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // --- Updated Star Material with Texture ---
    const starMaterial = new THREE.PointsMaterial({
        size: 0.18, // Slightly larger to show off the glow
        map: createStarTexture(), // Apply the glowing circle texture
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending, // This makes overlapping stars glow brighter
        depthWrite: false, // Prevents "black boxes" from appearing around stars
        sizeAttenuation: true
    });

    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    function generatePlanetTexture(primaryColor, secondaryColor, type = 'earth') {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = Math.random() * (type === 'gas' ? size/10 : 20);
            ctx.beginPath();
            ctx.fillStyle = secondaryColor + '22';
            if (type === 'gas') { ctx.rect(0, y, size, Math.random() * 5); }
            else { ctx.arc(x, y, radius, 0, Math.PI * 2); }
            ctx.fill();
        }
        const grd = ctx.createLinearGradient(0, 0, size, 0);
        grd.addColorStop(0, 'rgba(0,0,0,0.4)');
        grd.addColorStop(0.5, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,size,size);
        return new THREE.CanvasTexture(canvas);
    }

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    function createPlanet(radius, color, altColor, x, y, type = 'earth', hasRing = false) {
        const group = new THREE.Group();
        const geo = new THREE.SphereGeometry(radius, 64, 64);
        const tex = generatePlanetTexture(color, altColor, type);
        const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, metalness: 0.2 });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        const glowGeo = new THREE.SphereGeometry(radius * 1.05, 64, 64);
        const glowMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.15, side: THREE.BackSide, blending: THREE.AdditiveBlending });
        group.add(new THREE.Mesh(glowGeo, glowMat));

        if (type === 'earth') {
            const cloudGeo = new THREE.SphereGeometry(radius * 1.02, 64, 64);
            const cloudTex = generatePlanetTexture('rgba(255,255,255,0)', '#ffffff', 'earth');
            const cloudMat = new THREE.MeshStandardMaterial({ alphaMap: cloudTex, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
            const clouds = new THREE.Mesh(cloudGeo, cloudMat);
            group.add(clouds);
            group.userData.clouds = clouds;
        }

        if (hasRing) {
            const ringGeo = new THREE.RingGeometry(radius * 1.4, radius * 2.2, 128);
            const ringCanvas = document.createElement('canvas');
            ringCanvas.width = 128; ringCanvas.height = 128;
            const rCtx = ringCanvas.getContext('2d');
            const rGrd = rCtx.createRadialGradient(64,64,30,64,64,64);
            rGrd.addColorStop(0, 'rgba(0,0,0,0)'); rGrd.addColorStop(0.5, color + '44');
            rGrd.addColorStop(0.8, altColor + '22'); rGrd.addColorStop(1, 'rgba(0,0,0,0)');
            rCtx.fillStyle = rGrd; rCtx.fillRect(0,0,128,128);
            const ringMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ringCanvas), transparent: true, opacity: 0.6, side: THREE.DoubleSide });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2.2;
            group.add(ring);
        }
        group.position.set(x, y, 0);
        planetGroup.add(group);
        return group;
    }

    // --- Planets spaced out for the whole scroll depth ---
    const p1 = createPlanet(1.2, '#00d2ff', '#ffffff', 6, 2, 'earth', false);
    const p2 = createPlanet(2.5, '#9d50bb', '#3a0a5a', -10, -15, 'gas', true);
    const p3 = createPlanet(1.5, '#ff00cc', '#440022', 8, -35, 'earth', false);
    const p4 = createPlanet(3.0, '#00ffff', '#004444', -7, -60, 'gas', true);
    const p5 = createPlanet(1.8, '#ffcc00', '#663300', 9, -90, 'earth', false);
    const p6 = createPlanet(2.2, '#ff3300', '#330000', -9, -120, 'gas', false);
    const p7 = createPlanet(1.0, '#ffffff', '#9d50bb', 5, -150, 'earth', true);
    const p8 = createPlanet(2.0, '#ff0066', '#330011', -6, -190, 'gas', true);
    const p9 = createPlanet(1.4, '#00ffaa', '#002211', 7, -230, 'earth', false);
    const p10 = createPlanet(2.8, '#ff9900', '#331100', -8, -270, 'gas', true);
    const planets = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 5, 5);
    scene.add(sunLight);

    function animate() {
        requestAnimationFrame(animate);
        starMesh.rotation.y += 0.0001;
        
        planets.forEach((p, idx) => {
            p.rotation.y += 0.001 * (idx + 1);
            if (p.userData.clouds) p.userData.clouds.rotation.y += 0.0005;
        });

        const scrollY = window.scrollY;
        // Subtle parallax: star field moves slower, planets move faster
        planetGroup.position.y = scrollY * 0.045; 
        starMesh.position.y = scrollY * 0.015;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 0.1;
        const y = (e.clientY / window.innerHeight - 0.5) * 0.1;
        scene.rotation.x = y; scene.rotation.y = x;
    });
}

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, observerOptions);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));