/* =========================================
   PROJECT DATA
========================================= */

const rowProjectsData = [
    {
        id: 1,
        name: "Highway Blossom",
        rate: "₹3,300",
        location: "AB Road, Mangliya",
        badge: "Premium Layout",
        category: "ab-road",
        image: "/assets/image/blooms city.png"
    },

    {
        id: 2,
        name: "Highway Serene City 2",
        rate: "₹3,400",
        location: "AB Road, Mangliya",
        badge: "Popular Project",
        category: "ab-road",
        image: "/assets/image/HighwaySereneCity2.png"
    },

    {
        id: 3,
        name: "Highway Oasis",
        rate: "₹3,775",
        location: "Prime Location",
        badge: "Luxury Township",
        category: "premium",
        image: "/assets/image/HighwayOasisimage.png"
    },

    {
        id: 4,
        name: "Highway Landmark",
        rate: "₹2,975",
        location: "Prime Location",
        badge: "Best Value",
        category: "budget",
        image: "/assets/image/86fe30d3-5c86-45b6-9f45-d5f43159bfb8.png"
    },

    {
        id: 5,
        name: "Highway Avenue",
        rate: "₹4,400",
        location: "Prime Location",
        badge: "Grand Township",
        category: "premium",
        image: "/assets/image/Highway Avenue.png"
    },

    {
        id: 6,
        name: "Highway Trident",
        rate: "₹2,650",
        location: "New Launching Colony",
        badge: "New Launch 🔥",
        category: "new",

        /* Replace with your local Highway Trident image later */
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85"
    },

    {
        id: 7,
        name: "Highway Season",
        rate: "₹2,699",
        location: "Prime Location",
        badge: "Hot Deal",
        category: "budget",
        image: "/assets/image/HighwaySeasons.png"
    },

    {
        id: 8,
        name: "Highway Aura",
        rate: "₹3,400",
        location: "Prime Location",
        badge: "Exclusive",
        category: "premium",
        image: "/assets/image/72160110-151f-4c11-97dc-abf1255d7d34.jpg"
    },

    {
        id: 9,
        name: "Highway Summit",
        rate: "₹3,400",
        location: "Prime Location",
        badge: "Exclusive",
        category: "premium",
        image: "/assets/image/Submmitlimage.jpg"
    }
];


/* =========================================
   ELEMENTS
========================================= */

const galleryGrid =
    document.getElementById("galleryGrid");

const projectFilters =
    document.getElementById("projectFilters");

const searchInput =
    document.getElementById("gallerySearch");

const clearSearch =
    document.getElementById("clearSearch");

const suggestions =
    document.getElementById("searchSuggestions");

const resultText =
    document.getElementById("galleryResultText");

const galleryCount =
    document.getElementById("galleryCount");

const emptyState =
    document.getElementById("galleryEmpty");

const resetGallery =
    document.getElementById("resetGallery");

const categoryButtons =
    document.querySelectorAll(".category-btn");


/* LIGHTBOX */

const lightbox =
    document.getElementById("galleryLightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const lightboxLocation =
    document.getElementById("lightboxLocation");

const lightboxBadge =
    document.getElementById("lightboxBadge");

const lightboxClose =
    document.getElementById("lightboxClose");

const lightboxPrev =
    document.getElementById("lightboxPrev");

const lightboxNext =
    document.getElementById("lightboxNext");


/* =========================================
   STATE
========================================= */

let selectedCategory = "all";

let selectedProject = "all";

let currentSearch = "";

let visibleProjects = [...rowProjectsData];

let currentLightboxIndex = 0;


/* =========================================
   GENERATE PROJECT FILTER BUTTONS
========================================= */

function createProjectFilters() {

    projectFilters.innerHTML = `
        <button
            class="project-filter-btn active"
            data-project="all"
        >
            All
        </button>
    `;

    rowProjectsData.forEach(project => {

        const button =
            document.createElement("button");

        button.className =
            "project-filter-btn";

        button.dataset.project =
            project.name;

        button.textContent =
            project.name;

        projectFilters.appendChild(button);

    });

}


/* =========================================
   CREATE CARD
========================================= */

function createProjectCard(project, index) {

    return `

        <article
            class="gallery-card"
            data-id="${project.id}"
            style="animation-delay:${index * 0.04}s"
        >

            <img
                src="${project.image}"
                alt="${project.name} project"
                class="gallery-card-image"
                loading="lazy"
            />

            <span class="gallery-card-badge">
                ${project.badge}
            </span>

            <div class="gallery-view-icon">

                <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14 21 3"></path>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>

            </div>

            <div class="gallery-card-info">

                <div class="gallery-card-location">

                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>

                    ${project.location}

                </div>

                <h3>
                    ${project.name}
                </h3>

                <div class="gallery-card-bottom">

                    <div class="gallery-card-rate">
                        Starting from
                        <strong>${project.rate}</strong>
                    </div>

                    <span class="gallery-view-text">
                        View Image →
                    </span>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   FILTER DATA
========================================= */

function filterProjects() {

    const query =
        currentSearch
            .trim()
            .toLowerCase();

    visibleProjects =
        rowProjectsData.filter(project => {

            const categoryMatch =
                selectedCategory === "all" ||
                project.category === selectedCategory;

            const projectMatch =
                selectedProject === "all" ||
                project.name === selectedProject;

            const searchableText = `
                ${project.name}
                ${project.location}
                ${project.badge}
                ${project.category}
            `.toLowerCase();

            const searchMatch =
                !query ||
                searchableText.includes(query);

            return (
                categoryMatch &&
                projectMatch &&
                searchMatch
            );

        });

    renderGallery();

}


/* =========================================
   RENDER GALLERY
========================================= */

function renderGallery() {

    if (!visibleProjects.length) {

        galleryGrid.innerHTML = "";

        emptyState.classList.add("show");

        galleryCount.textContent = "0 Projects";

        resultText.textContent =
            "No matching projects found";

        return;

    }

    emptyState.classList.remove("show");

    galleryGrid.innerHTML =
        visibleProjects
            .map(createProjectCard)
            .join("");

    galleryCount.textContent =
        `${visibleProjects.length} ${visibleProjects.length === 1
            ? "Project"
            : "Projects"
        }`;

    if (currentSearch) {

        resultText.innerHTML =
            `Results for "<strong>${escapeHTML(currentSearch)}</strong>"`;

    }

    else if (selectedProject !== "all") {

        resultText.textContent =
            `Showing ${selectedProject}`;

    }

    else if (selectedCategory !== "all") {

        resultText.textContent =
            "Showing filtered projects";

    }

    else {

        resultText.textContent =
            "Showing all projects";

    }

    attachCardEvents();

}


/* =========================================
   CARD EVENTS
========================================= */

function attachCardEvents() {

    const cards =
        document.querySelectorAll(".gallery-card");

    cards.forEach(card => {

        card.addEventListener("click", () => {

            const id =
                Number(card.dataset.id);

            currentLightboxIndex =
                visibleProjects.findIndex(
                    project => project.id === id
                );

            openLightbox();

        });

    });

}


/* =========================================
   CATEGORY FILTER
========================================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedCategory =
            button.dataset.category;

        filterProjects();

    });

});


/* =========================================
   PROJECT FILTER
========================================= */

projectFilters.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".project-filter-btn"
            );

        if (!button) return;

        document
            .querySelectorAll(
                ".project-filter-btn"
            )
            .forEach(btn =>
                btn.classList.remove("active")
            );

        button.classList.add("active");

        selectedProject =
            button.dataset.project;

        filterProjects();

    }
);


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    event => {

        currentSearch =
            event.target.value;

        clearSearch.style.display =
            currentSearch
                ? "block"
                : "none";

        showSuggestions(currentSearch);

        filterProjects();

    }
);


/* =========================================
   SEARCH SUGGESTIONS
========================================= */

function showSuggestions(value) {

    const query =
        value.trim().toLowerCase();

    if (!query) {

        suggestions.classList.remove("show");

        suggestions.innerHTML = "";

        return;

    }

    const matches =
        rowProjectsData.filter(project => {

            return (
                project.name
                    .toLowerCase()
                    .includes(query) ||

                project.location
                    .toLowerCase()
                    .includes(query) ||

                project.badge
                    .toLowerCase()
                    .includes(query)
            );

        });

    if (!matches.length) {

        suggestions.classList.remove("show");

        return;

    }

    suggestions.innerHTML =
        matches
            .slice(0, 5)
            .map(project => `

                <button
                    class="suggestion-item"
                    data-name="${project.name}"
                >

                    <img
                        src="${project.image}"
                        alt=""
                    />

                    <div class="suggestion-content">

                        <strong>
                            ${project.name}
                        </strong>

                        <span>
                            ${project.location}
                        </span>

                    </div>

                </button>

            `)
            .join("");

    suggestions.classList.add("show");

}


/* =========================================
   SELECT SEARCH SUGGESTION
========================================= */

suggestions.addEventListener(
    "click",
    event => {

        const item =
            event.target.closest(
                ".suggestion-item"
            );

        if (!item) return;

        const projectName =
            item.dataset.name;

        searchInput.value =
            projectName;

        currentSearch =
            projectName;

        clearSearch.style.display =
            "block";

        suggestions.classList.remove("show");

        filterProjects();

    }
);


/* =========================================
   CLEAR SEARCH
========================================= */

clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        currentSearch = "";

        clearSearch.style.display =
            "none";

        suggestions.classList.remove("show");

        filterProjects();

        searchInput.focus();

    }
);


/* =========================================
   RESET
========================================= */

resetGallery.addEventListener(
    "click",
    resetAllFilters
);


function resetAllFilters() {

    selectedCategory = "all";

    selectedProject = "all";

    currentSearch = "";

    searchInput.value = "";

    clearSearch.style.display = "none";

    suggestions.classList.remove("show");


    categoryButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category === "all"
        );

    });


    document
        .querySelectorAll(
            ".project-filter-btn"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.project === "all"
            );

        });


    filterProjects();

}


/* =========================================
   LIGHTBOX
========================================= */

function openLightbox() {

    const project =
        visibleProjects[currentLightboxIndex];

    if (!project) return;

    lightboxImage.src =
        project.image;

    lightboxImage.alt =
        project.name;

    lightboxTitle.textContent =
        project.name;

    lightboxLocation.textContent =
        project.location;

    lightboxBadge.textContent =
        project.badge;

    lightbox.classList.add("open");

    document.body.style.overflow =
        "hidden";

}


function closeLightbox() {

    lightbox.classList.remove("open");

    document.body.style.overflow = "";

}


function nextImage() {

    currentLightboxIndex =
        (currentLightboxIndex + 1) %
        visibleProjects.length;

    openLightbox();

}


function previousImage() {

    currentLightboxIndex =
        (
            currentLightboxIndex -
            1 +
            visibleProjects.length
        ) %
        visibleProjects.length;

    openLightbox();

}


lightboxClose.addEventListener(
    "click",
    closeLightbox
);


lightboxNext.addEventListener(
    "click",
    nextImage
);


lightboxPrev.addEventListener(
    "click",
    previousImage
);


/* CLOSE BY CLICKING BACKDROP */

lightbox.addEventListener(
    "click",
    event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    }
);


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !lightbox.classList.contains("open")
        ) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

    }
);


/* =========================================
   CLOSE SEARCH WHEN CLICK OUTSIDE
========================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".gallery-search-wrap"
            )
        ) {

            suggestions.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================
   BASIC HTML ESCAPE
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =========================================
   INITIALIZE
========================================= */

createProjectFilters();

filterProjects();