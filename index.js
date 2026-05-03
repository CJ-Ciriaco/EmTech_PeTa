/* ═══════════════════════════════════════
   CORE NAVIGATION
═══════════════════════════════════════ */
function navigate(page) {
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    const t = document.getElementById("page-" + page);
    if (t) t.classList.add("active");
    document.querySelectorAll(".nav-links a").forEach((a) =>
        a.classList.toggle("active", a.dataset.page === page)
    );
    window.scrollTo(0, 0);
    document.getElementById("navLinks").classList.remove("open");
    // re-trigger scroll reveals on new page
    setTimeout(checkReveals, 60);
    // re-trigger counters
    setTimeout(initCounters, 80);
    return false;
}
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("open");
}
function submitForm() {
    const fname = document.getElementById("fname").value.trim();
    const email = document.getElementById("email").value.trim();
    const msg = document.getElementById("message").value.trim();
    if (!fname || !email || !msg) { alert("Please fill in your name, email, and message."); return; }
    if (!email.includes("@")) { alert("Please enter a valid email address."); return; }
    document.getElementById("formBody").style.display = "none";
    document.getElementById("formSuccess").style.display = "block";
}

/* ═══════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════ */
const progressBar = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";

    // nav shrink
    document.querySelector("nav").classList.toggle("scrolled", scrolled > 40);
}, { passive: true });

/* ═══════════════════════════════════════
   CURSOR GLOW
═══════════════════════════════════════ */
const cursorGlow = document.getElementById("cursor-glow");
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let gcx = cx, gcy = cy;
document.addEventListener("mousemove", (e) => { cx = e.clientX; cy = e.clientY; });
(function glowLoop() {
    gcx += (cx - gcx) * 0.1;
    gcy += (cy - gcy) * 0.1;
    cursorGlow.style.left = gcx + "px";
    cursorGlow.style.top = gcy + "px";
    requestAnimationFrame(glowLoop);
})();

/* ═══════════════════════════════════════
   HERO PARTICLE CANVAS
═══════════════════════════════════════ */
(function initCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function Particle() {
        this.reset = function () {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 2.5 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(Math.random() * 0.5 + 0.2);
            this.life = 0;
            this.maxLife = Math.random() * 200 + 120;
            this.hue = Math.random() > 0.5 ? 135 : 205; // green or blue
        };
        this.reset();
        this.y = Math.random() * H; // spread on init
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.life++;
            p.x += p.vx;
            p.y += p.vy;
            const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.55;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
            ctx.fill();
            if (p.life >= p.maxLife || p.y < -10) p.reset();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ═══════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════ */
function addRevealClasses() {
    // Cards
    document.querySelectorAll(".r-card").forEach((el, i) => {
        el.classList.add("reveal");
        el.style.transitionDelay = (i * 0.1) + "s";
    });
    document.querySelectorAll(".member-card").forEach((el, i) => {
        el.classList.add("reveal", "scale");
        el.style.transitionDelay = (i * 0.07) + "s";
    });
    document.querySelectorAll(".photo-card").forEach((el, i) => {
        el.classList.add("reveal", "scale");
        el.style.transitionDelay = (i * 0.08) + "s";
    });
    document.querySelectorAll(".sig-item").forEach((el, i) => {
        el.classList.add("reveal", "from-left");
        el.style.transitionDelay = (i * 0.1) + "s";
    });
    document.querySelectorAll(".mission-card").forEach((el, i) => {
        el.classList.add("reveal", i % 2 === 0 ? "from-left" : "from-right");
        el.style.transitionDelay = (i * 0.1) + "s";
    });
    document.querySelectorAll(".info-stat").forEach((el, i) => {
        el.classList.add("reveal");
        el.style.transitionDelay = (i * 0.12) + "s";
    });
    document.querySelectorAll(".rationale-block, .research-hero-card, .vlog-embed, .contact-form, .advocacy-side").forEach(el => {
        el.classList.add("reveal");
    });
    document.querySelectorAll(".cta-box").forEach(el => {
        el.classList.add("reveal", "scale");
    });
    // Fallback: reveal everything after 1.5s in case observer fails
    setTimeout(() => {
        document.querySelectorAll(".reveal:not(.visible)").forEach(el => el.classList.add("visible"));
    }, 1500);
}

function checkReveals() {
    const reveals = document.querySelectorAll(".page.active .reveal:not(.visible)");
    reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) el.classList.add("visible");
    });
}

addRevealClasses();
window.addEventListener("scroll", checkReveals, { passive: true });
setTimeout(checkReveals, 100);

/* ═══════════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════════ */
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;
    const isDecimal = String(target).includes(".");
    const duration = 1200;
    const start = performance.now();
    (function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = target * ease;
        el.textContent = isDecimal ? val.toFixed(2) : Math.round(val);
        if (progress < 1) requestAnimationFrame(tick);
    })(performance.now());
}

function initCounters() {
    document.querySelectorAll(".page.active [data-target]").forEach(el => {
        if (!el.dataset.counted) {
            el.dataset.counted = "1";
            animateCounter(el);
        }
    });
}
setTimeout(initCounters, 200);

/* ═══════════════════════════════════════
   SECTION-TAG GLITCH: set data-text attr
═══════════════════════════════════════ */
document.querySelectorAll(".section-tag").forEach(el => {
    el.setAttribute("data-text", el.textContent);
});

/* ═══════════════════════════════════════
   3D CARD TILT ON MOUSE MOVE
═══════════════════════════════════════ */
function initTilt(selector, intensity = 10) {
    document.querySelectorAll(selector).forEach(card => {
        card.classList.add("tilt-card");
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const rx = ((e.clientY - cy) / (rect.height / 2)) * intensity;
            const ry = -((e.clientX - cx) / (rect.width / 2)) * intensity;
            card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}
initTilt(".r-card", 8);
initTilt(".member-card", 6);
initTilt(".mission-card", 5);
initTilt(".photo-card", 5);
initTilt(".logo-showcase", 4);

/* ═══════════════════════════════════════
   RIPPLE ON BUTTON CLICK
═══════════════════════════════════════ */
document.querySelectorAll(".btn-primary, .btn-outline").forEach(btn => {
    btn.style.position = "relative";
    btn.style.overflow = "hidden";
    btn.addEventListener("click", (e) => {
        const r = document.createElement("span");
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        r.className = "ripple-effect";
        r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;position:absolute;border-radius:50%;`;
        btn.appendChild(r);
        setTimeout(() => r.remove(), 700);
    });
});

/* ═══════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════ */
document.querySelectorAll(".btn-primary, .btn-outline").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.25;
        btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
    });
});

/* ═══════════════════════════════════════
   WATER DROPS in hero (theme-fitting)
═══════════════════════════════════════ */
(function spawnDrops() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    function makeDropCol() {
        const wrap = document.createElement("div");
        wrap.className = "water-drop-wrap";
        const x = Math.random() * 90 + 5;
        const delay = Math.random() * 5;
        const dur = Math.random() * 2 + 2.5;
        wrap.style.cssText = `left:${x}%;top:10%;`;
        const drop = document.createElement("div");
        drop.className = "water-drop";
        drop.style.cssText = `animation-duration:${dur}s;animation-delay:${delay}s;`;
        const rip = document.createElement("div");
        rip.className = "water-drop-ripple";
        rip.style.cssText = `animation-duration:${dur}s;animation-delay:${delay + dur * 0.8}s;`;
        wrap.appendChild(drop);
        wrap.appendChild(rip);
        hero.appendChild(wrap);
    }
    for (let i = 0; i < 14; i++) makeDropCol();
})();

/* ═══════════════════════════════════════
   MICRO FLOATING PARTICLES on sections
═══════════════════════════════════════ */
(function addMicroParticles() {
    document.querySelectorAll(".section").forEach(section => {
        section.style.position = "relative";
        section.style.overflow = "hidden";
        for (let i = 0; i < 6; i++) {
            const p = document.createElement("div");
            p.className = "micro-particle";
            const size = Math.random() * 5 + 2;
            const isGreen = Math.random() > 0.5;
            const color = isGreen ? "rgba(94,199,58,.25)" : "rgba(59,185,255,.25)";
            p.style.cssText = `
				width:${size}px; height:${size}px;
				background:${color};
				left:${Math.random() * 93 + 1}%;
				top:${Math.random() * 90 + 2}%;
				animation-duration:${Math.random() * 6 + 5}s;
				animation-delay:-${Math.random() * 6}s;
				z-index:0;
				pointer-events:none;
			`;
            section.appendChild(p);
        }
    });
})();

/* ═══════════════════════════════════════
   STAGGER REVEALS on re-navigate
═══════════════════════════════════════ */
const _origNavigate = navigate;

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
navigate("home");
