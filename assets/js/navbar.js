// ============================================================================
// NAVBAR: scroll show/hide, mega menu, mobile drawer
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const DESKTOP_BREAKPOINT = 1024; // matches Tailwind's `lg` breakpoint
    const SCROLL_THRESHOLD = 50;

    const header = document.getElementById('main-header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const dropdownWrapper = document.getElementById('properties-dropdown-wrapper');
    const dropdownBtn = document.getElementById('properties-dropdown-btn');

    // ------------------------------------------------------------------
    // 1. SCROLL EFFECT — header is always white/solid. The only behavior
    //    here is: hide header on scroll-down, reveal it again on
    //    scroll-up (classic "sticky reveal" navbar pattern). Throttled
    //    via requestAnimationFrame so it never fires 50-100+ times/sec.
    // ------------------------------------------------------------------
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= SCROLL_THRESHOLD) {
            // Always visible near the very top of the page.
            header.classList.remove('header-hidden');
        } else if (currentScrollY > lastScrollY) {
            // Scrolling DOWN -> hide.
            header.classList.add('header-hidden');
        } else if (currentScrollY < lastScrollY) {
            // Scrolling UP -> reveal.
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    }

    let scrollTicking = false;
    function onScroll() {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // set correct initial state on load

    // ------------------------------------------------------------------
    // 2. MEGA MENU: keep aria-expanded in sync with actual visible state
    //    (hover-only CSS never reported this to screen readers before)
    // ------------------------------------------------------------------
    function openMegaMenu() {
        dropdownBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMegaMenu() {
        dropdownBtn.setAttribute('aria-expanded', 'false');
    }
    dropdownWrapper.addEventListener('mouseenter', openMegaMenu);
    dropdownWrapper.addEventListener('mouseleave', closeMegaMenu);
    dropdownBtn.addEventListener('focus', openMegaMenu);
    dropdownWrapper.addEventListener('focusout', (e) => {
        if (!dropdownWrapper.contains(e.relatedTarget)) closeMegaMenu();
    });

    // ------------------------------------------------------------------
    // 3. MOBILE DRAWER CONTROLS
    //    - Syncs aria-hidden / aria-expanded for assistive tech
    //    - Moves focus into the drawer on open, and back to the
    //      trigger button on close (basic focus management)
    //    - Simple focus trap while drawer is open (Tab / Shift+Tab)
    //    - Toggles "drawer-open" so the .drawer-open .drawer-link
    //      fadeInDown CSS rule fires.
    // ------------------------------------------------------------------
    let lastFocusedElement = null;

    function getFocusableDrawerElements() {
        return mobileDrawer.querySelectorAll(
            'a[href], button:not([disabled])'
        );
    }

    function openDrawer() {
        lastFocusedElement = document.activeElement;

        mobileDrawer.classList.remove('translate-x-full');
        mobileDrawer.classList.add('drawer-open');
        drawerBackdrop.classList.remove('opacity-0', 'pointer-events-none');
        document.body.classList.add('overflow-hidden');

        mobileDrawer.setAttribute('aria-hidden', 'false');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');

        closeDrawerBtn.focus();
        document.addEventListener('keydown', trapFocus);
    }

    function closeDrawer() {
        mobileDrawer.classList.add('translate-x-full');
        mobileDrawer.classList.remove('drawer-open');
        drawerBackdrop.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');

        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        document.removeEventListener('keydown', trapFocus);

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        } else {
            mobileMenuBtn.focus();
        }
    }

    function trapFocus(e) {
        if (e.key === 'Escape') {
            closeDrawer();
            return;
        }
        if (e.key !== 'Tab') return;

        const focusable = Array.from(getFocusableDrawerElements());
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    mobileMenuBtn.addEventListener('click', openDrawer);
    closeDrawerBtn.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', closeDrawer);

    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // ------------------------------------------------------------------
    // 4. Auto-close drawer if window is resized up to desktop width
    //    (fixes stuck-open-drawer edge case on orientation/resize)
    // ------------------------------------------------------------------
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth >= DESKTOP_BREAKPOINT &&
                !mobileDrawer.classList.contains('translate-x-full')) {
                closeDrawer();
            }
        }, 150);
    });
});