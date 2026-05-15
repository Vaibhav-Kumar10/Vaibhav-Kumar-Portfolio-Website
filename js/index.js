'use strict';
/* ══════════════════════════════════════════════════════════════
   index.js — index.html specific JavaScript.
   Requires: js/shared.js loaded first.
   ══════════════════════════════════════════════════════════════ */

/* ─── DOM cache ─── */
const heroEl = document.getElementById('hero');
const heroTitle = heroEl.querySelector('.hero-title');
const heroSub = heroEl.querySelector('.hero-sub');
const termBodyEl = document.getElementById('termBody');
const termInputEl = document.getElementById('term-input');
const loaderEl = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');

const sectionIds = ['hero', 'experience', 'skills', 'leaderboard', 'projects', 'certs', 'contact'];
const sectionEls = sectionIds.map(id => document.getElementById(id));
let secIdx = 0;

/* ─── Hero parallax (merged into cursor RAF via shared.js patch) ─── */
/* Monkey-patch: after shared.js runs, extend the mousemove to add parallax */
let _mx = 0, _my = 0;
document.addEventListener('mousemove', e => {
    _mx = e.clientX; _my = e.clientY;
    const px = (_mx / innerWidth - .5) * 2;
    const py = (_my / innerHeight - .5) * 2;
    heroTitle.style.transform = `translate3d(${px * 4}px,${py * 2}px,0)`;
    heroSub.style.transform = `translate3d(${px * 8}px,${py * 4}px,0)`;
}, { passive: true });

/* ─── Loader ─── */
const msgs = ['Loading kernel...', 'Mounting filesystem...', 'Initializing shaders...',
    'Booting interface...', 'Decrypting skills.dat...', 'Loading experience.lvl...', 'Portfolio.exe ready!'];
let pct = 0, mi = 0;
const loadInt = setInterval(() => {
    pct += Math.random() * 18 + 5;
    if (pct > 100) pct = 100;
    loaderBar.style.width = pct + '%';
    loaderText.textContent = msgs[mi] || msgs[msgs.length - 1];
    if (pct >= 100) {
        clearInterval(loadInt);
        loaderText.textContent = '// ALL SYSTEMS GO';
        setTimeout(() => {
            loaderEl.style.transition = 'opacity .6s';
            loaderEl.style.opacity = '0';
            setTimeout(() => loaderEl.style.display = 'none', 700);
        }, 600);
    }
    if (mi < msgs.length - 1 && pct > mi * 15) mi++;
}, 120);

/* ─── Experience panels ─── */
function openPanel(id) { document.getElementById('panel-' + id).classList.add('open'); }
function closePanel(id) { document.getElementById('panel-' + id).classList.remove('open'); }

document.querySelectorAll('.exp-panel').forEach(p =>
    p.addEventListener('click', e => { if (e.target === p) p.classList.remove('open'); })
);

/* ─── Reveal on scroll ─── */
const revealObs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: .15 }
);
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── XP bars animate ─── */
const xpObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-w]').forEach(bar =>
                setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 200)
            );
        }
    });
}, { threshold: .2 });
document.querySelectorAll('.skill-tree').forEach(el => xpObs.observe(el));

/* ─── Scroll-spy (cached offsetTop; zero DOM reads per scroll) ─── */
let sectionTops = [];
function cacheSectionTops() { sectionTops = sectionEls.map(el => el ? el.offsetTop : 0); }

if (document.readyState === 'complete') { cacheSectionTops(); }
else { window.addEventListener('load', cacheSectionTops, { once: true, passive: true }); }

window.addEventListener('scroll', () => {
    const pos = window.scrollY + innerHeight / 2;
    for (let i = sectionTops.length - 1; i >= 0; i--) {
        if (pos >= sectionTops[i]) { secIdx = i; break; }
    }
}, { passive: true });

window.addEventListener('resize', () => {
    clearTimeout(window._stTimer);
    window._stTimer = setTimeout(cacheSectionTops, 200);
}, { passive: true });

/* ─── Keyboard nav (WASD / arrows) ─── */
document.addEventListener('keydown', e => {
    if (document.activeElement === termInputEl) return;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        secIdx = Math.min(secIdx + 1, sectionIds.length - 1);
        sectionEls[secIdx].scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        secIdx = Math.max(secIdx - 1, 0);
        sectionEls[secIdx].scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'Enter' && secIdx === 0) {
        secIdx = 1;
        sectionEls[1].scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.exp-panel.open').forEach(p => p.classList.remove('open'));
    }
    if (e.key === '`' || e.key === '~') {
        sectionEls[sectionEls.length - 1].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => termInputEl.focus(), 600);
    }
});

/* ─── Terminal ─── */
const termCmds = {
    help() {
        return `<span style="color:var(--purple)">Available commands:</span><br>
                <span style="color:var(--blue)">email</span>      — get email address<br>
                <span style="color:var(--blue)">github</span>     — open GitHub profile<br>
                <span style="color:var(--blue)">linkedin</span>   — open LinkedIn<br>
                <span style="color:var(--blue)">resume</span>     — open Resume<br>                <span style="color:var(--blue)">dsa</span>        — view coding profiles 🏆<br>
                <span style="color:var(--blue)">skills</span>     — list top skills<br>
                <span style="color:var(--blue)">clear</span>      — clear terminal`;
    },
    email() { return '📧 <a href="mailto:vaibhav.udr21@gmail.com" style="color:var(--blue)">vaibhav.udr21@gmail.com</a>'; },
    github() { window.open('https://github.com/Vaibhav-Kumar10', '_blank'); return '🔗 Opening GitHub... <a href="https://github.com/Vaibhav-Kumar10" style="color:var(--blue)" target="_blank">github.com/Vaibhav-Kumar10</a>'; },
    linkedin() { window.open('https://www.linkedin.com/in/vaibhav-kumar-87557528a/', '_blank'); return '🔗 Opening LinkedIn... <a href="https://www.linkedin.com/in/vaibhav-kumar-87557528a/" style="color:var(--blue)" target="_blank">linkedin.com/in/vaibhav-kumar-87557528a</a>'; },
    resume() { window.open('https://drive.google.com/file/d/12f5u01-WAilwhRdhymA0NHi0hcRCRI2E/view?usp=sharing', '_blank'); return '\u{1F517} Opening Resume... <a href="https://drive.google.com/file/d/12f5u01-WAilwhRdhymA0NHi0hcRCRI2E/view?usp=sharing" style="color:var(--blue)" target="_blank">View Resume</a>'; },
    dsa() {
        return `<span style="color:var(--green)">[ DSA & COMPETITIVE PROGRAMMING STATS ]</span><br>
    <span style="color:#ffa116">LeetCode</span>   : <a href="https://leetcode.com/u/huTFu8nIjY/" target="_blank" style="color:var(--blue)">Rating 1,874 - Knight (Top 5%)</a><br>
    <span style="color:#2f8d46">GFG</span>        : <a href="https://www.geeksforgeeks.org/profile/vaibhavbcyq?tab=activity" target="_blank" style="color:var(--blue)">Institution Rank 800</a><br>
    <span style="color:#00ea64">HackerRank</span> : <a href="https://www.hackerrank.com/profile/vaibhav_23bce101" target="_blank" style="color:var(--blue)">5★ C++, Python, SQL</a><br>
    `;
    // <span style="color:#1f8acb">Codeforces</span> : <a href="https://codeforces.com/profile/vaibhavkumar10" target="_blank" style="color:var(--blue)">Rating 969</a><br>
    // <span style="color:#5B4638">CodeChef</span>   : <a href="https://www.codechef.com/users/vaibhavkumar10" target="_blank" style="color:var(--blue)">1★ (1249)</a><br>
    },
    skills() { return `<span style="color:var(--green)">TOP SKILLS:</span><br>☁️ AWS (EC2,S3,Lambda,IAM) &nbsp; 🐍 Python &nbsp; 🔐 Security<br>🐳 Docker &nbsp; 🟨 JavaScript &nbsp; 🗄️ SQL/DynamoDB`; },
    clear() { termBodyEl.innerHTML = '<div class="term-line comment"># Terminal cleared. Type \'help\' for commands.</div>'; return null; }
};

termInputEl.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const val = termInputEl.value.trim().toLowerCase();
    if (!val) return;
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line cmd';
    cmdLine.textContent = 'vaibhav@portfolio:~$ ' + val;
    termBodyEl.appendChild(cmdLine);
    const fn = termCmds[val];
    const outLine = document.createElement('div');
    outLine.className = 'term-line out';
    if (fn) {
        const res = fn();
        if (res !== null) { outLine.innerHTML = res; termBodyEl.appendChild(outLine); }
    } else {
        outLine.className = 'term-line err';
        outLine.innerHTML = `Command not found: <span style="color:var(--red)">${val}</span>. Try 'help'.`;
        termBodyEl.appendChild(outLine);
    }
    termInputEl.value = '';
    termBodyEl.scrollTop = termBodyEl.scrollHeight;
});

/* Auto-focus terminal when #contact scrolls into view */
const contactEl = document.getElementById('contact');
if (contactEl) {
    new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setTimeout(() => termInputEl.focus(), 300);
        });
    }, { threshold: .3 }).observe(contactEl);
}

/* ─── Cartridge 3D tilt ─── */
document.querySelectorAll('.cartridge').forEach(card => {
    let rect = null;
    card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); }, { passive: true });
    card.addEventListener('mousemove', e => {
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(600px) rotateY(${x * 20}deg) rotateX(${-y * 10}deg) translate3d(0,0,0)`;
    }, { passive: true });
    card.addEventListener('mouseleave', () => { rect = null; card.style.transform = ''; }, { passive: true });
});

