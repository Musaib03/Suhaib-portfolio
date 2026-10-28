const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Theme toggle (remembers the choice)
$('#theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Mobile menu
const toggle = $('.nav-toggle');
const nav = $('#nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Hero dashboard animation
requestAnimationFrame(() => setTimeout(() => document.body.classList.add('ready'), 100));

// Count-up numbers
function countUp(el) {
  const end = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (reduce) return;
  const start = performance.now();
  const dur = 1400;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = Math.round(end * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const statObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { $$('[data-count]', e.target).forEach(countUp); statObs.unobserve(e.target); }
  });
}, { threshold: 0.4 });
statObs.observe($('.stats'));

// Reveal sections on scroll
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => revObs.observe(el));

// Highlight current section in the nav
const links = $$('a[href^="#"]', nav);
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
links.map((a) => $(a.getAttribute('href'))).filter(Boolean).forEach((s) => navObs.observe(s));

// Experience tabs
const tabs = $$('[role="tab"]');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
  });
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = (tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[i].focus(); tabs[i].click();
  });
});

// Copy email
const copyBtn = $('#copy');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#email').textContent.trim());
    copyBtn.textContent = 'Copied';
  } catch (err) {
    copyBtn.textContent = 'Copy failed';
  }
  setTimeout(() => (copyBtn.textContent = 'Copy email'), 1800);
});

$('#year').textContent = new Date().getFullYear();
