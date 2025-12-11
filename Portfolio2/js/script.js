/* =========================================================
   INCLUDE NAVBAR (Reusable)
========================================================= */
function includeHTML(callback) {
    const includes = document.querySelectorAll("[data-include]");
    let loaded = 0;

    if (includes.length === 0) {
        callback();
        return;
    }

    includes.forEach(el => {
        const file = el.getAttribute("data-include");

        fetch(file)
            .then(res => res.text())
            .then(data => {
                el.innerHTML = data;
                loaded++;

                if (loaded === includes.length) callback();
            });
    });
}

/* =========================================================
   NAVBAR FEATURES
========================================================= */
function initNavbar() {
    const hamburger = document.getElementById("hamburger-btn");
    const navMenu = document.getElementById("nav-menu");

    hamburger?.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        navMenu.classList.toggle("open");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active-link");
        }
    });

    const navbar = document.getElementById("main-navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) navbar.classList.add("navbar-shrink");
        else navbar.classList.remove("navbar-shrink");
    });

    const darkBtn = document.getElementById("dark-toggle");

    if (darkBtn) {
        darkBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
        });
    }
}

/* =========================================================
   THEME LOAD
========================================================= */
function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}

/* =========================================================
   POPUP INFO BOXES (About Page)
========================================================= */
function activateInfoBoxes() {
    const buttons = document.querySelectorAll(".timeline-item, .skill-btn");

    if (buttons.length === 0) return;

    buttons.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();

            document.querySelectorAll(".info-box.active")
                .forEach(box => {
                    if (!this.contains(box)) box.classList.remove("active");
                });

            const info = this.querySelector(".info-box");
            if (info) info.classList.toggle("active");
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".info-box.active")
            .forEach(box => box.classList.remove("active"));
    });
}

/* =========================================================
   PAGE TRANSITIONS
========================================================= */
const slideDirections = ["left", "right", "top", "bottom"];

function initRandomSlideTransitions() {
    document.querySelectorAll("a[href]").forEach(link => {
        if (link.dataset.slideBound === "true") return;
        link.dataset.slideBound = "true";

        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("mailto:") ||
                href.startsWith("tel:") || link.target === "_blank") return;

            const url = new URL(href, location.href);
            if (url.origin !== location.origin) return;

            e.preventDefault();

            const dir = slideDirections[Math.floor(Math.random() * slideDirections.length)];
            document.getElementById("transition-overlay")?.classList.add("active");
            document.body.classList.add(`slide-out-${dir}`);

            setTimeout(() => { window.location.href = href; }, 600);
        });
    });
}

function applyRandomSlideStart() {
    const dir = slideDirections[Math.floor(Math.random() * slideDirections.length)];
    document.body.classList.add(`slide-start-${dir}`);

    requestAnimationFrame(() => {
        document.body.classList.add("slide-in");
    });
}

/* =========================================================
   CUBE ROTATION LOGIC
========================================================= */
function initCube() {
    const cube = document.getElementById("cube");
    if (!cube) return;

    let angleX = 0, angleY = 0;
    let isDragging = false, startX, startY;
    let currentX = 0, currentY = 0;
    let autoRotate = true;

    function rotateCube() {
        if (!autoRotate) return;

        const dirs = [[0, 90], [0, -90], [90, 0], [-90, 0], [180, 0], [0, 180]];
        const r = dirs[Math.floor(Math.random() * dirs.length)];

        angleX += r[0];
        angleY += r[1];
        cube.style.transform = `rotateX(${angleY}deg) rotateY(${angleX}deg)`;
    }

    setInterval(rotateCube, 2000);

    function update() {
        cube.style.transform = `rotateX(${angleY}deg) rotateY(${angleX}deg)`;
    }

    cube.addEventListener("mousedown", e => {
        isDragging = true; autoRotate = false;
        startX = e.clientX; startY = e.clientY;
    });

    document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        angleX = currentX + (e.clientX - startX) * 0.9;
        angleY = currentY - (e.clientY - startY) * 0.9;
        update();
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        currentX = angleX; currentY = angleY;
        setTimeout(() => autoRotate = true, 2000);
    });
}

/* =========================================================
   FULL INITIALIZATION
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    includeHTML(() => {
        initNavbar();
        activateInfoBoxes();
    });

    initRandomSlideTransitions();
    initCube();

    const overlay = document.getElementById("transition-overlay");
    if (overlay) overlay.classList.remove("active");

    requestAnimationFrame(applyRandomSlideStart);
});

