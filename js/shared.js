'use strict';
/* ══════════════════════════════════════════════════════════════
   shared.js — Runs on every page.
   Handles: custom cursor RAF, starfield canvas, orbital menu.
   ══════════════════════════════════════════════════════════════ */

/* ─── Custom Cursor (single RAF loop) ─── */
(function () {
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    if (!cursor || !cursorDot) return;

    let mouseX = 0, mouseY = 0, rafPending = false;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(flush);
        }
    }, { passive: true });

    function flush() {
        rafPending = false;
        cursor.style.transform = `translate3d(${mouseX - 8}px,${mouseY - 8}px,0)`;
        cursorDot.style.transform = `translate3d(${mouseX - 2}px,${mouseY - 2}px,0)`;
    }

    /* Scale cursor on interactive elements */
    document.querySelectorAll('a, button, [role="button"], .planet-orb, .level-node, .cartridge, .badge').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate3d(${mouseX - 8}px,${mouseY - 8}px,0) scale(2.5) rotate(45deg)`;
        }, { passive: true });
        el.addEventListener('mouseleave', () => {
            rafPending = true;
            requestAnimationFrame(flush);
        }, { passive: true });
    });
})();

/* ─── Starfield Canvas ─── */
(function () {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let W, H, stars = [], resizeTimer;

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

    function mkStar() {
        const a = Math.random();
        const hue = a > .5 ? '179,136,255' : '90,209,255';
        const alp = (.4 + a * .6).toFixed(2);
        return {
            x: Math.random() * W, y: Math.random() * H,
            r: Math.random() * 1.4 + .3,
            vx: (Math.random() - .5) * .35,
            vy: (Math.random() - .5) * .35,
            fill: `rgba(${hue},${alp})`
        };
    }

    function init() { resize(); stars = Array.from({ length: 120 }, mkStar); }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0, len = stars.length; i < len; i++) {
            const s = stars[i];
            s.x += s.vx; s.y += s.vy;
            if (s.x < 0) s.x = W; else if (s.x > W) s.x = 0;
            if (s.y < 0) s.y = H; else if (s.y > H) s.y = 0;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, 6.2832);
            ctx.fillStyle = s.fill;
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    }, { passive: true });

    init(); draw();
})();

/* ─── Orbital Menu Toggle ─── */
(function () {
    const shipToggle = document.getElementById('ship-toggle');
    const orbitalMenu = document.getElementById('orbital-menu');
    const orbitalClose = document.getElementById('orbital-close');
    if (!shipToggle || !orbitalMenu || !orbitalClose) return;

    function openOrbital() {
        orbitalMenu.classList.add('open');
        orbitalMenu.setAttribute('aria-hidden', 'false');
        shipToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeOrbital() {
        orbitalMenu.classList.remove('open');
        orbitalMenu.setAttribute('aria-hidden', 'true');
        shipToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    shipToggle.addEventListener('click', () =>
        orbitalMenu.classList.contains('open') ? closeOrbital() : openOrbital()
    );

    orbitalClose.addEventListener('click', closeOrbital);

    document.querySelectorAll('.orbit-link').forEach(link =>
        link.addEventListener('click', closeOrbital)
    );

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && orbitalMenu.classList.contains('open')) closeOrbital();
    });

    orbitalMenu.addEventListener('click', e => {
        if (e.target === orbitalMenu) closeOrbital();
    });
})();
