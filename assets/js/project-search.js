// ============================================================================
// PROJECT SEARCH + RESULT CARDS POPUP
// ============================================================================
// NOTE: this file uses the global `PROJECTS` array defined in
// projects-data.js — that file MUST be loaded before this one in index.html.

const STATUS_BADGES = {
    available: '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700"><i class="fa-solid fa-circle-check"></i>Available</span>',
    limited: '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700"><i class="fa-solid fa-triangle-exclamation"></i>Limited Units</span>',
    soldout: '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700"><i class="fa-solid fa-ban"></i>Sold Out</span>'
};

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderProjectCards(list) {
    const grid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    grid.innerHTML = '';

    if (list.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }
    noResults.classList.add('hidden');

    list.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col';
        card.innerHTML = `
            <div class="relative h-48 overflow-hidden bg-slate-100">
                <img src="${p.image}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover"
                     onerror="this.style.display='none'">
                <div class="absolute top-3 left-3">${STATUS_BADGES[p.status] || ''}</div>
            </div>
            <div class="p-5 flex flex-col flex-1">
                <div class="flex items-start justify-between gap-2">
                    <h3 class="font-bold text-lg text-slate-900 leading-snug">${escapeHtml(p.name)}</h3>
                    <div class="flex items-center gap-1 text-amber-500 text-sm font-semibold shrink-0 pt-0.5">
                        <i class="fa-solid fa-star"></i>${p.rating}
                    </div>
                </div>
                <p class="text-sm text-slate-500 flex items-center gap-1.5 mt-1.5">
                    <i class="fa-solid fa-location-dot text-blue-500 w-4"></i>${escapeHtml(p.location)}
                </p>
                <p class="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                    <i class="fa-regular fa-clock text-blue-500 w-4"></i>Visit: ${escapeHtml(p.visitTime)}
                </p>
                <p class="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                    <i class="fa-regular fa-user text-blue-500 w-4"></i>Contact: ${escapeHtml(p.contactName)}
                </p>
                <a href="${p.detailLink}"
                   class="mt-4 inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
                    View More Details<i class="fa-solid fa-arrow-right text-xs"></i>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

function runPropertySearch() {
    const locationInput = document.getElementById('search-location');
    const typeInput = document.getElementById('search-type');
    const priceInput = document.getElementById('search-price');
    const bedsInput = document.getElementById('search-beds');
    if (!locationInput) return;

    const locationQuery = locationInput.value.trim().toLowerCase();
    const typeQuery = typeInput.value;
    const priceQuery = priceInput.value;
    const bedsQuery = bedsInput.value;

    const filtered = PROJECTS.filter(p => {
        const matchLocation = !locationQuery
            || p.city.toLowerCase().includes(locationQuery)
            || p.area.toLowerCase().includes(locationQuery)
            || p.location.toLowerCase().includes(locationQuery);
        const matchType = typeQuery === 'Any Type' || p.type === typeQuery;
        // The first price option is the widest range -> treat as "any price"
        const matchPrice = priceQuery === '₹50L - ₹5Cr+' || p.priceCategory === priceQuery;
        const matchBeds =
            bedsQuery === 'Any' ||
            (bedsQuery === '2+ BHK' && p.bhk >= 2) ||
            (bedsQuery === '3+ BHK' && p.bhk >= 3);
        return matchLocation && matchType && matchPrice && matchBeds;
    });

    const label = document.getElementById('results-location-label');
    const count = document.getElementById('results-count');
    if (label) label.textContent = locationQuery ? `near "${locationInput.value.trim()}"` : '';
    if (count) count.textContent = `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`;

    renderProjectCards(filtered);
    openResultsModal();
}

// ------------------------------------------------------------------
// RESULTS POPUP MODAL — open/close (same pattern as the mobile
// drawer in navbar.js: backdrop fade, Escape to close, click outside
// to close, focus moves to the close button, and back to the search
// button once the popup is dismissed).
// ------------------------------------------------------------------
const resultsModal = document.getElementById('results-modal');
const resultsBackdrop = document.getElementById('results-backdrop');
const resultsModalClose = document.getElementById('results-modal-close');
let lastFocusedBeforeResultsModal = null;

function openResultsModal() {
    lastFocusedBeforeResultsModal = document.activeElement;

    resultsModal.classList.remove('opacity-0', 'invisible', 'pointer-events-none', 'scale-95');
    resultsBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');

    resultsModal.setAttribute('aria-hidden', 'false');
    if (resultsModalClose) resultsModalClose.focus();

    document.addEventListener('keydown', handleResultsModalEscape);
}

function closeResultsModal() {
    resultsModal.classList.add('opacity-0', 'invisible', 'pointer-events-none', 'scale-95');
    resultsBackdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');

    resultsModal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleResultsModalEscape);

    if (lastFocusedBeforeResultsModal) {
        lastFocusedBeforeResultsModal.focus();
    }
}

function handleResultsModalEscape(e) {
    if (e.key === 'Escape') closeResultsModal();
}

if (resultsModalClose) resultsModalClose.addEventListener('click', closeResultsModal);
if (resultsBackdrop) resultsBackdrop.addEventListener('click', closeResultsModal);

// Intercept the search form so Enter / Search button never reloads
// the page — it filters the projects and opens the popup instead.
const propertySearchForm = document.getElementById('property-search-form');
if (propertySearchForm) {
    propertySearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        runPropertySearch();
    });
}