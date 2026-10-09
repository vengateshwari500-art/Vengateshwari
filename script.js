'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Mobile menu ---------- */
const burger = $('#burger'), menu = $('#menu');
const setMenu = open => {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

/* ---------- Typing animation for roles ---------- */
const roles = [
  'Computer Science Engineering Student',
  'Aspiring Software Developer',
  'Full Stack Developer'
];
const typed = $('#typed');
if (reduceMotion) {
  typed.textContent = roles.join(' | ');
} else {
  let r = 0, c = 0, del = false;
  (function tick() {
    const word = roles[r];
    typed.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 28 : 65);
  })();
}

/* ---------- Scroll reveal + active nav link ---------- */
const revealIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
}), { threshold: .15 });
$$('.reveal').forEach(el => revealIO.observe(el));

const links = $$('.menu a');
const navIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => navIO.observe(s));

/* ---------- Toast + placeholder links ---------- */
const toast = $('#toast');
let t;
const say = msg => {
  toast.textContent = msg; toast.classList.add('show');
  clearTimeout(t); t = setTimeout(() => toast.classList.remove('show'), 2600);
};
// Links with href="#" and data-todo are placeholders: tell the visitor instead of jumping to top.
$$('a[data-todo]').forEach(a => a.addEventListener('click', e => {
  if (a.getAttribute('href') === '#') { e.preventDefault(); say('Link coming soon'); }
}));

/* ---------- Contact form validation ---------- */
const form = $('#form'), status = $('#status');
const rules = {
  name:    v => v.trim().length >= 2 || 'Please enter your name.',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
  subject: v => v.trim().length >= 3 || 'Please add a subject.',
  message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
};
const check = el => {
  const res = rules[el.name](el.value), box = el.closest('.f');
  box.classList.toggle('bad', res !== true);
  $('small', box).textContent = res === true ? '' : res;
  return res === true;
};
$$('input,textarea', form).forEach(el => el.addEventListener('blur', () => check(el)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = $$('input,textarea', form).map(check).every(Boolean);
  status.classList.remove('ok');
  if (!ok) { status.textContent = 'Please fix the highlighted fields.'; return; }
  /* TODO: send the data here with a form service, for example:
     fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body:new FormData(form), headers:{Accept:'application/json'} }) */
  status.textContent = 'Looks good! Messages are not sent yet because no form service or backend is connected.';
  status.classList.add('ok');
});
