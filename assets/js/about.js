// ============================================================================
// ABOUT PAGE: scroll-reveal animations + animated stat counters
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Dynamic Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ------------------------------------------------------------------
    // Scroll-reveal: fade + slide up any element with class "reveal"
    // the first time it enters the viewport.
    // ------------------------------------------------------------------
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        // No IntersectionObserver support -> just show everything.
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // ------------------------------------------------------------------
    // Animated stat counters (25,000+, 10+, 50+, 4) — counts up once
    // when the stats strip scrolls into view.
    // ------------------------------------------------------------------
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 1500; // ms
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // ease-out for a natural deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value.toLocaleString('en-IN');

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toLocaleString('en-IN');
            }
        }

        requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    } else {
        counters.forEach(el => animateCounter(el));
    }
});