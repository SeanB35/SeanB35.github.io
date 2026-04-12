/* ============================================================
   PHOTOGRAPHY PORTFOLIO — script.js
   Developer: Sean Briganti
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initLightbox();
    initTestimonials();
    initAccordion();
    initContactForm();
});

/* ----------------------------------------------------------
   1. MOBILE NAV TOGGLE
   ---------------------------------------------------------- */
function initNavToggle() {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => links.classList.remove('open'));
    });
}

/* ----------------------------------------------------------
   2. LIGHTBOX (Portfolio Gallery)
   ---------------------------------------------------------- */
function initLightbox() {
    const grid     = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    if (!grid || !lightbox) return;

    const lbImg   = document.getElementById('lightbox-img');
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev  = document.getElementById('lightbox-prev');
    const btnNext  = document.getElementById('lightbox-next');

    // Collect all gallery image sources (full-size via Unsplash param swap)
    const items = grid.querySelectorAll('.gallery-item');
    const images = [];
    items.forEach(item => {
        const img = item.querySelector('img');
        // Replace thumbnail width param with larger version
        images.push(img.src.replace('w=600', 'w=1600'));
    });

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lbImg.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lbImg.src = images[currentIndex];
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lbImg.src = images[currentIndex];
    }

    // Click handlers
    items.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });
    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', showPrev);
    btnNext.addEventListener('click', showNext);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   showPrev();
        if (e.key === 'ArrowRight')  showNext();
    });
}

/* ----------------------------------------------------------
   3. AJAX TESTIMONIALS (About Page)
   ---------------------------------------------------------- */
function initTestimonials() {
    const container = document.getElementById('testimonial-grid');
    if (!container) return;

    fetch('reviews.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load testimonials.');
            return response.json();
        })
        .then(reviews => {
            reviews.forEach(review => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                card.innerHTML = `
                    <p>${review.text}</p>
                    <span class="client-name">${review.name}</span>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p style="color:var(--text-muted);">Unable to load testimonials at this time.</p>';
        });
}

/* ----------------------------------------------------------
   4. JQUERY-UI ACCORDION (Services Page)
   ---------------------------------------------------------- */
function initAccordion() {
    // Only run if jQuery and the accordion container exist
    if (typeof jQuery === 'undefined') return;
    const $accordion = jQuery('#services-accordion');
    if (!$accordion.length) return;

    $accordion.accordion({
        active: false,
        collapsible: true,
        heightStyle: 'content',
        animate: 300,
        header: 'h3',
        icons: {
            header: 'ui-icon-plus',
            activeHeader: 'ui-icon-minus'
        }
    });

    // Override jQuery-UI theme colors to match our gritty palette
    $accordion.find('.ui-accordion-header').css({
        'background': '#161616',
        'color': '#e8e8e8',
        'border': '1px solid #333',
        'font-family': "'Playfair Display', serif",
        'font-size': '1.15rem',
        'padding': '1.2rem 1.6rem'
    });
    $accordion.find('.ui-accordion-content').css({
        'background': '#111',
        'color': '#888',
        'border': '1px solid #333',
        'border-top': 'none',
        'padding': '1.5rem 1.6rem'
    });
}

/* ----------------------------------------------------------
   5. CONTACT FORM VALIDATION
   ---------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        form.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
        document.getElementById('form-success').style.display = 'none';

        // Name
        const name = document.getElementById('contact-name');
        if (!name.value.trim()) {
            document.getElementById('error-name').style.display = 'block';
            isValid = false;
        }

        // Email
        const email = document.getElementById('contact-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            document.getElementById('error-email').style.display = 'block';
            isValid = false;
        }

        // Message
        const message = document.getElementById('contact-message');
        if (!message.value.trim()) {
            document.getElementById('error-message').style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // Simulate a successful submission (no backend)
            document.getElementById('form-success').style.display = 'block';
            form.reset();
        }
    });
}
