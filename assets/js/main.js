/* ==========================================================================
   main.js — nav, scroll-spy, reveal, theme, contact form
   ========================================================================== */
(function () {
  'use strict';

  var doc = document.documentElement;
  var header = document.getElementById('header');
  var navList = document.getElementById('nav-list');
  var navToggle = document.getElementById('nav-toggle');
  var themeToggle = document.getElementById('theme-toggle');

  /* Footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Header state on scroll */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile navigation */
  function setNav(open) {
    navList.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  navToggle.addEventListener('click', function () {
    setNav(!navList.classList.contains('is-open'));
  });
  navList.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

  /* Scroll-spy */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });

    /* Reveal on scroll */
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Theme toggle (persisted) */
  themeToggle.addEventListener('click', function () {
    var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Contact form — composes a pre-filled email */
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
        note.textContent = 'Please fill in your name, a valid email and a message.';
        return;
      }
      var subject = encodeURIComponent('Portfolio enquiry from ' + name);
      var body = encodeURIComponent(message + '\n\n— ' + name + '\n' + email);
      window.location.href = 'mailto:anujbisht09@gmail.com?subject=' + subject + '&body=' + body;
      note.textContent = 'Opening your email app…';
    });
  }
})();
