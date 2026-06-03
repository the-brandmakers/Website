
'use strict';

// ── MOBILE NAV ──
const ham = document.getElementById('ham');
const mob = document.getElementById('mob');
ham.addEventListener('click', () => mob.classList.toggle('open'));
document.querySelectorAll('.ml').forEach(a => a.addEventListener('click', () => mob.classList.remove('open')));

// ── NAV SCROLL ──
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  mainNav.style.background = window.scrollY > 60 ? 'rgba(10,10,10,0.94)' : 'rgba(10,10,10,0.75)';
}, { passive: true });

// ── FADE-IN ON SCROLL ──
const fadeEls = document.querySelectorAll('.fade-up');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => io.observe(el));
// Hero fires immediately
setTimeout(() => document.querySelectorAll('#hero .fade-up').forEach(el => el.classList.add('visible')), 80);

// ── PARALLAX ──
let tick = false;
const pEls = document.querySelectorAll('.par');
function runPar() {
  const sy = window.scrollY;
  pEls.forEach(el => {
    const speed = parseFloat(el.dataset.p || 0.1);
    const rect = el.getBoundingClientRect();
    const off = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
    el.style.transform = `translateY(${off}px)`;
  });
  tick = false;
}
window.addEventListener('scroll', () => {
  if (!tick && window.innerWidth > 768) { requestAnimationFrame(runPar); tick = true; }
}, { passive: true });

// ── 3D TILT ──
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.innerWidth <= 768) return;
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), background 0.4s, box-shadow 0.4s, border-color 0.4s';
  });
});

// ── TESTIMONIALS SLIDER ──
const track = document.getElementById('ttrack');
const cards = [...track.querySelectorAll('.testi-card')];
const dotsEl = document.getElementById('tdots');
let cur = 0, autoT, visN = 3;

function vis() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function buildDots() {
  dotsEl.innerHTML = '';
  const g = Math.ceil(cards.length / visN);
  for (let i = 0; i < g; i++) {
    const d = document.createElement('button');
    d.className = 's-dot' + (i === cur ? ' on' : '');
    d.setAttribute('aria-label', `Go to slide ${i+1}`);
    d.addEventListener('click', () => go(i));
    dotsEl.appendChild(d);
  }
}
function updateDots() {
  [...dotsEl.querySelectorAll('.s-dot')].forEach((d,i) => d.classList.toggle('on', i === cur));
}
function go(idx) {
  visN = vis();
  const max = cards.length - visN;
  cur = Math.max(0, Math.min(idx, max));
  const cw = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${cur * cw}px)`;
  updateDots();
  reset();
}
function next() { visN = vis(); go(cur >= cards.length - visN ? 0 : cur + 1); }
function prev() { visN = vis(); go(cur <= 0 ? cards.length - visN : cur - 1); }
function reset() { clearInterval(autoT); autoT = setInterval(next, 4500); }

document.getElementById('tnext').addEventListener('click', next);
document.getElementById('tprev').addEventListener('click', prev);

let tx0 = 0;
track.addEventListener('touchstart', e => tx0 = e.touches[0].clientX, { passive: true });
track.addEventListener('touchend', e => { const d = tx0 - e.changedTouches[0].clientX; if (Math.abs(d) > 50) d > 0 ? next() : prev(); });

function initSlider() { visN = vis(); buildDots(); go(0); }
initSlider();
window.addEventListener('resize', initSlider, { passive: true });

// ── CONTACT FORM ──
const cform = document.getElementById('cform');
const formOk = document.getElementById('form-ok');
cform.addEventListener('submit', e => {
  e.preventDefault();
  const btn = cform.querySelector('[type=submit]');
  const orig = btn.innerHTML;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    formOk.style.display = 'block';
    formOk.textContent = '✓ Message received — we\'ll be in touch within 24 hours.';
    formOk.style.color = '#7DAA8A';
    cform.reset();
    btn.innerHTML = orig;
    btn.disabled = false;
    setTimeout(() => { formOk.style.display = 'none'; }, 6000);
  }, 1100);
});
