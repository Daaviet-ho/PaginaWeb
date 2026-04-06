// Texto rotatorio mágico
const rotatingPhrases = [
    'De Hecho, Muy Facil',
    'De Hecho, Muy Barato',
    'De Hecho, Con o Sin Contrato', 
    'De Hecho, Con Planes Incluidos',
    'De Hecho, Podremos Hacer Negocios Juntos'
];

let currentPhrase = 0;
const rotatingEl = document.querySelector('.rotating-text');

function rotateText() {
    rotatingEl.classList.add('exit');

    setTimeout(() => {
        currentPhrase = (currentPhrase + 1) % rotatingPhrases.length;
        rotatingEl.textContent = rotatingPhrases[currentPhrase];
        rotatingEl.classList.remove('exit');
        rotatingEl.classList.add('enter');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                rotatingEl.classList.add('show');
            });
        });

        setTimeout(() => {
            rotatingEl.classList.remove('enter', 'show');
        }, 500);
    }, 400);
}

setInterval(rotateText, 3000);

// Menú móvil
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Animaciones de entrada con Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Aplicar animaciones a tarjetas y secciones
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.servicio-card, .sector-card, .portfolio-card, .testimonio-card, .about-content, .contacto-form'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});
