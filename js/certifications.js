'use strict';
/* ══════════════════════════════════════════════════════════════
   certifications.js — certifications.html specific JavaScript.
   Requires: js/shared.js loaded first (cursor, starfield, orbital menu).
   ══════════════════════════════════════════════════════════════ */

/* ─── CERT DATA ─── */
const CERTS = {
    'aws': {
        icon: '☁️',
        name: 'AWS CERTIFIED CLOUD PRACTITIONER (CLF-C02)',
        issuer: 'Amazon Web Services',
        date: 'February 2026 · Score: 837/1000',
        desc: 'Certified in AWS core cloud concepts, compute, storage, networking, security, IAM, pricing models, and support plans. Achieved a score of 837/1000 on the CLF-C02 examination — demonstrating solid understanding of the AWS global infrastructure.',
        link: 'https://www.credly.com/badges/a101bb35-c3b4-4daf-9d2a-499c8cafdd78/public_url',
        imgFile: 'certificates/cert-aws.webp'
    },
    'oracle': {
        icon: '☕',
        name: 'JAVA CERTIFIED FOUNDATIONS ASSOCIATE',
        issuer: 'Oracle',
        date: 'July 2025',
        desc: 'Learnt about core Java concepts including object-oriented programming, data types, control structures, arrays, and Java standard library basics — the foundation for enterprise Java development.',
        link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=729555693A7479D0B57C3CF264505AC9AFC090D4F93056EA8E41036009ECAF53',
        imgFile: 'certificates/cert-oracle.webp'
    },
    'postman': {
        icon: '📮',
        name: 'API FUNDAMENTALS STUDENT EXPERT',
        issuer: 'Postman',
        date: 'July 2025',
        desc: 'Learnt about REST API architecture, HTTP methods (GET/POST/PUT/DELETE), request/response cycles, authentication, environment variables, collections, and test scripting within the Postman platform.',
        link: 'https://badgr.com/public/assertions/xthmBLcdQCaseYtcHPS_HQ/',
        imgFile: 'certificates/cert-postman.webp'
    },
    'ibm-sql': {
        icon: '🗄️',
        name: 'SQL AND RELATIONAL DATABASES 101',
        issuer: 'IBM / Cognitive Class',
        date: 'March 2025',
        desc: 'Learnt SQL and relational database concepts including attributes, primary & foreign keys, Entity-Relationship models, SELECT queries, JOINs, aggregations, and data integrity constraints.',
        link: 'https://courses.cognitiveclass.ai/certificates/da189a9d362447abb0249503817f65b2',
        imgFile: 'certificates/cert-ibm-sql.webp'
    },
    'ibm-python': {
        icon: '🐍',
        name: 'PYTHON 101 FOR DATA SCIENCE',
        issuer: 'IBM / Cognitive Class',
        date: 'March 2025',
        desc: 'Learnt how Python is applied in Data Science contexts — including NumPy arrays, Pandas DataFrames, Matplotlib visualizations, and introductory data wrangling and analysis techniques.',
        link: 'https://courses.cognitiveclass.ai/certificates/9c2a5428897347fcb6cfbfd295812f7c',
        imgFile: 'certificates/cert-ibm-python.webp'
    },
    'finlatics': {
        icon: '📊',
        name: 'DATA SCIENCE WITH PYTHON',
        issuer: 'Finlatics',
        date: 'February 2025',
        desc: 'Learnt Data Science methodology and performed applied data analysis on Bank Data — covering exploratory data analysis (EDA), feature engineering, and insight generation using Python.',
        link: 'https://www.finlatics.com/credentialscheck?hash=DS-876195bb28157ffe',
        imgFile: 'certificates/cert-finlatics.webp'
    },
    'coursera': {
        icon: '🌐',
        name: 'THE BITS AND BYTES OF COMPUTER NETWORKING',
        issuer: 'Coursera / Google',
        date: 'November 2024',
        desc: 'Learnt foundational networking concepts including TCP/IP model, DNS, DHCP, NAT, VPNs, cloud networking basics, and practical network troubleshooting skills — the first step in the networking journey.',
        link: 'https://www.coursera.org/account/accomplishments/records/E7RRO5DSQQ0J',
        imgFile: 'certificates/cert-coursera.webp'
    }
};

/* ─── LOCKED PLANET ALERT (toast) ─── */
function lockedAlert() {
    const msg = '> ACCESS DENIED\n> CLASSIFICATION: TOP SECRET\n> MISSION STATUS: IN PROGRESS\n> ETA: ???? 2026\n> TRANSMISSION ENDS.';
    const toast = document.createElement('div');
    toast.style.cssText = [
        'position:fixed', 'bottom:80px', 'left:50%', 'transform:translateX(-50%)',
        'background:#0a0000', 'border:2px solid #ff6b6b', 'color:#ff6b6b',
        'font-family:"Press Start 2P",monospace', 'font-size:9px',
        'padding:18px 24px', 'z-index:9000', 'line-height:2', 'text-align:left',
        'box-shadow:0 0 20px #ff6b6b66', 'white-space:pre', 'letter-spacing:1px',
        'transition:opacity .4s'
    ].join(';');
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; }, 2500);
    setTimeout(() => toast.remove(), 3000);
}

/* ─── SCROLL REVEAL (Y-fade; CSS handles X offset via nth-child) ─── */
const stopOffsets = [-130, 130, -110, 120, -90, 110, -70, 90];

const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transitionDelay = '0s';
            if (window.innerWidth > 700) {
                const idx = parseInt(e.target.dataset.stopIdx);
                const off = stopOffsets[idx] !== undefined ? stopOffsets[idx] : 0;
                e.target.style.transform = `translateX(${off}px)`;
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.planet-stop').forEach((el, i) => {
    el.dataset.stopIdx = i;
    el.style.opacity = '0';
    el.style.transition = `opacity .7s ease ${i * 0.05}s, transform .7s ease`;
    revealObs.observe(el);
});

/* ─── WINDING GALAXY PATH (JS-drawn SVG cubic bezier) ─── */
function drawGalaxyPath() {
    const svg = document.getElementById('galaxyPathSVG');
    const container = document.getElementById('spacePath');
    if (!svg || !container) return;

    const containerRect = container.getBoundingClientRect();
    const pts = Array.from(document.querySelectorAll('.planet-orb')).map(orb => {
        const r = orb.getBoundingClientRect();
        return { x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top };
    });

    if (pts.length < 2) return;

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i], p1 = pts[i + 1];
        const cx1 = p0.x + (p1.x - p0.x) * 0.1, cy1 = p0.y + (p1.y - p0.y) * 0.45;
        const cx2 = p1.x - (p1.x - p0.x) * 0.1, cy2 = p0.y + (p1.y - p0.y) * 0.55;
        d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }

    svg.innerHTML = `
        <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stop-color="#b388ff" stop-opacity="0.8"/>
                <stop offset="50%"  stop-color="#5ad1ff" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#39ff14" stop-opacity="0.4"/>
            </linearGradient>
            <filter id="pathGlow">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        <path d="${d}" fill="none" stroke="url(#pathGrad)" stroke-width="4" stroke-dasharray="12 8" stroke-linecap="round" opacity="0.25" filter="url(#pathGlow)"/>
        <path d="${d}" fill="none" stroke="url(#pathGrad)" stroke-width="2" stroke-dasharray="12 8" stroke-linecap="round" opacity="0.7">
            <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.8s" repeatCount="indefinite"/>
        </path>`;

    svg.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);
}
setTimeout(drawGalaxyPath, 600);
window.addEventListener('resize', () => setTimeout(drawGalaxyPath, 200));

/* ─── CERT MODAL ─── */
let activeModal = null;

function openCertModal(id) {
    const c = CERTS[id];
    if (!c) return;
    activeModal = id;

    document.getElementById('modalIcon').textContent = c.icon;
    document.getElementById('modalName').textContent = c.name;
    document.getElementById('modalIssuer').textContent = c.issuer;
    document.getElementById('modalDate').textContent = c.date;
    document.getElementById('modalDesc').textContent = c.desc;
    document.getElementById('modalLink').href = c.link;
    document.getElementById('modalImgHint').textContent = c.imgFile;

    const img = document.getElementById('modalImg');
    const placeholder = document.getElementById('modalPlaceholder');
    img.style.display = 'none';
    placeholder.style.display = 'block';

    const testImg = new Image();
    testImg.onload = () => { img.src = c.imgFile; img.style.display = 'block'; placeholder.style.display = 'none'; };
    testImg.onerror = () => { img.style.display = 'none'; placeholder.style.display = 'block'; };
    testImg.src = c.imgFile;

    document.getElementById('certModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('modalClose').focus(), 100);
}

function closeCertModal() {
    document.getElementById('certModal').classList.remove('open');
    document.body.style.overflow = '';
    activeModal = null;
}

document.getElementById('certModal').addEventListener('click', function (e) { if (e.target === this) closeCertModal(); });
document.getElementById('modalClose').addEventListener('click', closeCertModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && activeModal) closeCertModal(); });

/* ─── Planet hover pulse ─── */
document.querySelectorAll('.planet-orb').forEach(orb => {
    orb.addEventListener('mouseenter', () => { orb.style.filter = 'brightness(1.3)'; });
    orb.addEventListener('mouseleave', () => { orb.style.filter = ''; });
});

/* ─── Cert count animation ─── */
(function () {
    const el = document.getElementById('certCount');
    if (!el) return;
    let v = 0; const target = 7;
    const t = setInterval(() => { el.textContent = ++v; if (v >= target) clearInterval(t); }, 120);
})();
