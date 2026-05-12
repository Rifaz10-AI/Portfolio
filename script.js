// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  if (cursor) cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
  fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
  if (follower) follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a,button,.edu-card,.proj-card,.cert-tile,.cc,.skill-block').forEach(el => {
  el.addEventListener('mouseenter', () => follower && follower.classList.add('hovered'));
  el.addEventListener('mouseleave', () => follower && follower.classList.remove('hovered'));
});

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');
burger && burger.addEventListener('click', () => navMenu.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navMenu.classList.remove('open')));

// ── HERO CANVAS PARTICLES ──
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function makePts() {
    pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.5 + .5
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124,58,237,.5)'; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(124,58,237,${(1 - d / 120) * .12})`;
          ctx.lineWidth = .6; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize(); makePts(); draw();
  window.addEventListener('resize', () => { resize(); makePts(); });
})();

// ── TYPEWRITER ──
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['AI systems.', 'RAG pipelines.', 'intelligent backends.', 'Agentic AI apps.', 'LLM integrations.'];
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1600); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, deleting ? 50 : 90);
  }
  setTimeout(tick, 1000);
})();

// ── SCROLL REVEAL ──
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
})();

// ── SKILL BARS ──
(function initBars() {
  const fills = document.querySelectorAll('.sb-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); obs.unobserve(e.target); } });
  }, { threshold: .3 });
  fills.forEach(f => obs.observe(f));
})();

// ── COUNTERS ──
(function initCounters() {
  const items = document.querySelectorAll('.stat-val[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isDecimal = el.hasAttribute('data-decimal');
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;
        if (current >= target) clearInterval(timer);
      }, 20);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  items.forEach(el => obs.observe(el));
})();

// ── CONTACT FORM ──
const form = document.getElementById('contact-form');
const successEl = document.getElementById('cf-success');
form && form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('cf-submit');
  btn.querySelector('span').textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.querySelector('span').textContent = 'Send Message';
    btn.disabled = false;
    successEl.classList.add('show');
    form.reset();
    setTimeout(() => successEl.classList.remove('show'), 5000);
  }, 1200);
});

// ── ACTIVE NAV HIGHLIGHT ──
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.style.color = '#a78bfa';
      }
    });
  }, { threshold: .4 });
  sections.forEach(s => obs.observe(s));
})();

// ── PROFILE IMAGE FALLBACK ──
const img = document.getElementById('profile-img');
if (img) {
  img.onerror = () => {
    const div = document.createElement('div');
    div.style.cssText = 'width:340px;height:340px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#2563eb);display:flex;align-items:center;justify-content:center;font-size:6rem;border:3px solid rgba(124,58,237,.3);';
    div.textContent = '👨‍💻';
    img.replaceWith(div);
  };
}
