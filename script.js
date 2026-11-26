(() => {
  'use strict';

  // Frame-busting fallback for static hosts (such as GitHub Pages) that do not serve frame-ancestors/X-Frame-Options headers.
  if (window.location.protocol === 'https:' && window.top !== window.self) {
    document.documentElement.replaceChildren();
    try {
      window.top.location.replace(window.self.location.href);
    } catch {
      // Cross-origin ancestor blocked top navigation; emptied DOM prevents clickjacking.
    }
    return;
  }

  const ALLOWED_PAGES = new Set(['index.html', 'projects.html', 'about.html']);
  const ALLOWED_EXTERNAL_ORIGIN = 'https://github.com';
  const ALLOWED_EXTERNAL_PREFIX = '/Alcije';
  const THEME_STORAGE_KEY = 'portfolio-theme';
  const ALLOWED_THEMES = new Set(['light', 'dark']);

  const rootElement = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function getSavedTheme() {
    try {
      const value = window.localStorage.getItem(THEME_STORAGE_KEY);
      return ALLOWED_THEMES.has(value) ? value : null;
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    if (!ALLOWED_THEMES.has(theme)) return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors under strict privacy or sandbox modes.
    }
  }

  function applyTheme(theme) {
    const resolved = ALLOWED_THEMES.has(theme) ? theme : 'light';
    rootElement.setAttribute('data-theme', resolved);
    if (themeToggle) {
      const isDark = resolved === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  const initialTheme = getSavedTheme() || (darkQuery && darkQuery.matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = rootElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  }

  if (darkQuery && typeof darkQuery.addEventListener === 'function') {
    darkQuery.addEventListener('change', (event) => {
      if (!getSavedTheme()) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  // Defense-in-depth validation for external links.
  document.querySelectorAll('a[href]').forEach((link) => {
    const rawHref = link.getAttribute('href') || '';
    if (link.getAttribute('target') === '_blank') {
      try {
        const parsed = new URL(rawHref, window.location.href);
        if (
          parsed.origin !== ALLOWED_EXTERNAL_ORIGIN ||
          !parsed.pathname.startsWith(ALLOWED_EXTERNAL_PREFIX)
        ) {
          link.removeAttribute('href');
          return;
        }
        link.setAttribute('rel', 'noopener noreferrer external');
      } catch {
        link.removeAttribute('href');
      }
    }
  });

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');

  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 16);
  }

  function closeMenu() {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.classList.remove('open');
    mobileNav.hidden = true;
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
      menuButton.classList.toggle('open', willOpen);
      mobileNav.hidden = !willOpen;
    });

    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const rawPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentPage = ALLOWED_PAGES.has(rawPage) ? rawPage : 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
  });

  const year = new Date().getFullYear();
  if (Number.isInteger(year) && year >= 2026 && year <= 2100) {
    document.querySelectorAll('[data-year]').forEach((element) => {
      element.textContent = String(year);
    });
  }

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }
})();
