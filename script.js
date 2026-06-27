/* =========================================================
   NAMRATA JAIN — PORTFOLIO
   Vanilla JS — no frameworks, no external libraries
========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu(){
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
  function openMobileMenu(){
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------- Scrollspy: highlight active nav link ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const setActiveLink = (id) => {
    desktopLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.nav === id);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
  }

  /* ---------- Reveal-on-scroll animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Profile photo fallback (shows "NJ" monogram if no photo found) ---------- */
  const profileImg = document.getElementById('profileImg');
  const profileFallback = document.getElementById('profileFallback');

  if (profileImg && profileFallback) {
    profileImg.addEventListener('error', () => {
      profileImg.style.display = 'none';
    });
    profileImg.addEventListener('load', () => {
      // Real photo loaded successfully — hide the monogram behind it
      profileFallback.style.opacity = '0';
    });
    // If the placeholder src is already broken on load, trigger the fallback state
    if (profileImg.complete && profileImg.naturalWidth === 0) {
      profileImg.style.display = 'none';
    }
  }

  /* ---------- Hero profile card — subtle tilt on mouse move ---------- */
  const card = document.getElementById('profileCard');
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (card && !prefersReducedMotion && !isCoarsePointer) {
    const maxTilt = 8;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0 -> 1
      const y = (e.clientY - rect.top) / rect.height;  // 0 -> 1
      const rotateY = (x - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - y) * maxTilt * 2;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  /* ---------- Toast helper ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message){
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  /* ---------- Copy email to clipboard (small UX touch on the contact card) ---------- */
  const emailCard = document.getElementById('emailCard');
  if (emailCard) {
    emailCard.addEventListener('click', (e) => {
      const email = 'jnamrata477@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        e.preventDefault();
        navigator.clipboard.writeText(email)
          .then(() => {
            showToast('Email copied to clipboard ✓');
            window.location.href = `mailto:${email}`;
          })
          .catch(() => { window.location.href = `mailto:${email}`; });
      }
    });
  }

});
