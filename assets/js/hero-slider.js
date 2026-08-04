// ============================================================================
// HERO SECTION: background slider + typing text effect
// ============================================================================

// Dynamic Year Script
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Background Slider Script
const slides = document.querySelectorAll(".hero-slide");
let current = 0;

setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
}, 5000);

// Typing Text Effect (Real Estate categories)
const words = [
    "Luxury Villas",
    "Premium Apartments",
    "Commercial Spaces",
    "Residential Plots",
    "Investment Deals"
];

let i = 0;
let j = 0;
let currentWord = "";
let isDeleting = false;

const typingText = document.getElementById("typing-text");

function type() {
    if (!typingText) return;

    currentWord = words[i];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, j--);
    } else {
        typingText.textContent = currentWord.substring(0, j++);
    }

    if (!isDeleting && j === currentWord.length + 1) {
        isDeleting = true;
        setTimeout(type, 1500);
        return;
    }

    if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
    }

    setTimeout(type, isDeleting ? 50 : 100);
}

type();