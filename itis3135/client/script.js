/* ============================================================
   PHOTOGRAPHY PORTFOLIO — script.js
   Developer: Sean Briganti
   Date: April 2026
   Purpose: Provides dynamic functionality for the Peter Bivona
            Photography client website. Includes mobile nav toggle,
            lightbox gallery, AJAX testimonials, jQuery-UI accordion,
            contact form validation, portfolio category filtering,
            before/after image comparison slider, and scroll-triggered
            reveal animations with a back-to-top button.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initLightbox();
    initTestimonials();
    initAccordion();
    initContactForm();
    initGalleryFilter();
    initBeforeAfter();
    initScrollReveal();
    initBackToTop();
});

/* ----------------------------------------------------------
   1. MOBILE NAV TOGGLE
   Event: click
   Page: All pages
   Description: Toggles the mobile navigation menu open/closed
                when the hamburger button is clicked. Also closes
                the menu when any nav link is clicked.
   ---------------------------------------------------------- */
function initNavToggle() {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => links.classList.remove('open'));
    });
}

/* ----------------------------------------------------------
   2. LIGHTBOX (Portfolio Gallery)
   Events: click, keydown
   Page: portfolio.html
   Description: Opens a full-screen lightbox when a gallery
                image is clicked. Supports next/previous navigation
                via buttons and arrow keys, and closes on Escape
                or backdrop click.
   ---------------------------------------------------------- */
function initLightbox() {
    const grid     = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    if (!grid || !lightbox) return;

    const lbImg    = document.getElementById('lightbox-img');
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev  = document.getElementById('lightbox-prev');
    const btnNext  = document.getElementById('lightbox-next');

    function getVisibleImages() {
        const visibleItems = grid.querySelectorAll('.gallery-item:not(.hidden)');
        const srcs = [];
        visibleItems.forEach(item => {
            const img = item.querySelector('img');
            srcs.push(img.src);
        });
        return { items: visibleItems, srcs: srcs };
    }

    let currentIndex = 0;

    function openLightbox(index) {
        const { srcs } = getVisibleImages();
        currentIndex = index;
        lbImg.src = srcs[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        const { srcs } = getVisibleImages();
        currentIndex = (currentIndex - 1 + srcs.length) % srcs.length;
        lbImg.src = srcs[currentIndex];
    }

    function showNext() {
        const { srcs } = getVisibleImages();
        currentIndex = (currentIndex + 1) % srcs.length;
        lbImg.src = srcs[currentIndex];
    }

    function attachClickHandlers() {
        const { items } = getVisibleImages();
        items.forEach((item, i) => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            newItem.addEventListener('click', () => openLightbox(i));
        });
    }

    attachClickHandlers();
    window._reattachLightbox = attachClickHandlers;

    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', showPrev);
    btnNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   showPrev();
        if (e.key === 'ArrowRight')  showNext();
    });
}

/* ----------------------------------------------------------
   3. AJAX TESTIMONIALS (About Page)
   Event: DOMContentLoaded (fetch on load)
   Page: about.html
   Description: Uses the Fetch API to asynchronously load
                testimonial data from reviews.json and dynamically
                generates testimonial cards in the DOM.
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
                card.innerHTML =
                    '<p>' + review.text + '</p>' +
                    '<span class="client-name">' + review.name + '</span>';
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
   Event: click (managed by jQuery-UI)
   Page: services.html
   Description: Initializes a jQuery-UI accordion widget on the
                services list so users can expand/collapse each
                package to view details and pricing.
   ---------------------------------------------------------- */
function initAccordion() {
    if (typeof jQuery === 'undefined') return;
    var acc = jQuery('#services-accordion');
    if (!acc.length) return;

    acc.accordion({
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

    acc.find('.ui-accordion-header').css({
        'background': '#161616',
        'color': '#e8e8e8',
        'border': '1px solid #333',
        'font-family': "'Playfair Display', serif",
        'font-size': '1.15rem',
        'padding': '1.2rem 1.6rem'
    });
    acc.find('.ui-accordion-content').css({
        'background': '#111',
        'color': '#888',
        'border': '1px solid #333',
        'border-top': 'none',
        'padding': '1.5rem 1.6rem'
    });
}

/* ----------------------------------------------------------
   5. CONTACT FORM VALIDATION
   Event: submit
   Page: contact.html
   Description: Validates user input on the contact form when
                submitted. Checks for non-empty name, valid email
                format, and non-empty message. Displays inline
                error messages and a success banner.
   ---------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        form.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
        document.getElementById('form-success').style.display = 'none';

        const name = document.getElementById('contact-name');
        if (!name.value.trim()) {
            document.getElementById('error-name').style.display = 'block';
            isValid = false;
        }

        const email = document.getElementById('contact-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            document.getElementById('error-email').style.display = 'block';
            isValid = false;
        }

        const message = document.getElementById('contact-message');
        if (!message.value.trim()) {
            document.getElementById('error-message').style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            document.getElementById('form-success').style.display = 'block';
            form.reset();
        }
    });
}

/* ==============================================================
   NEW INTERACTIVITY #1: PORTFOLIO CATEGORY FILTER
   ==============================================================
   Event: click
   Page: portfolio.html
   Description: Allows users to filter gallery images by category
                (All, Landscape, Urban, Nature) by clicking filter
                buttons. Uses CSS classes and data-category
                attributes to show/hide gallery items with a smooth
                fade animation.
   ============================================================== */
function initGalleryFilter() {
    const filterBar = document.getElementById('filter-bar');
    const grid      = document.getElementById('gallery-grid');
    if (!filterBar || !grid) return;

    const buttons = filterBar.querySelectorAll('.filter-btn');
    const items   = grid.querySelectorAll('.gallery-item');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            items.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (category === 'all' || itemCat === category) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            if (typeof window._reattachLightbox === 'function') {
                window._reattachLightbox();
            }
        });
    });
}

/* ==============================================================
   NEW INTERACTIVITY #2: BEFORE / AFTER IMAGE COMPARISON SLIDER
   ==============================================================
   Events: mousedown, mousemove, mouseup, touchstart, touchmove,
           touchend, click
   Page: index.html
   Description: Displays a draggable slider that reveals a
                before (raw) image on the left and an after
                (edited) image on the right. The user can drag
                the handle to compare two versions of a photo.
                Uses clip-path to dynamically crop the top layer.
   ============================================================== */
function initBeforeAfter() {
    const wrapper = document.getElementById('ba-wrapper');
    if (!wrapper) return;

    const afterImg = wrapper.querySelector('.ba-after');
    const handle   = wrapper.querySelector('.ba-handle');
    let isDragging = false;

    function updatePosition(clientX) {
        const rect = wrapper.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const pct = (x / rect.width) * 100;

        afterImg.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
        handle.style.left = pct + '%';
    }

    handle.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e.clientX);
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

    handle.addEventListener('touchstart', () => { isDragging = true; });
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updatePosition(e.touches[0].clientX);
    });
    document.addEventListener('touchend', () => { isDragging = false; });

    wrapper.addEventListener('click', (e) => {
        updatePosition(e.clientX);
    });
}

/* ==============================================================
   NEW INTERACTIVITY #3: SCROLL-REVEAL ANIMATIONS + BACK-TO-TOP
   ==============================================================
   Events: scroll (IntersectionObserver), click
   Pages: All pages
   Description:
   (a) Scroll Reveal - Uses IntersectionObserver to detect when
       .reveal elements enter the viewport. Adds .revealed class
       to trigger a CSS fade-and-slide-up animation.
   (b) Back-to-Top - A fixed button appears after scrolling 400px.
       Clicking it smoothly scrolls to the top of the page.
   ============================================================== */

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
