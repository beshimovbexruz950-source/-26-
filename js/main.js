/**
 * Turdiev Jasurbek Jo‘raqulovich - Personal Brand Website
 * Interactive Script: Navigation, Scrollspy, Animations, Form Handling & Language Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');
  const toastNotice = document.getElementById('toastNotice');
  const revealElements = document.querySelectorAll('.fade-up');
  const langBtns = document.querySelectorAll('.lang-btn');

  /* --------------------------------------------------------------------------
     1. STICKY HEADER TRANSFORMATION
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  /* --------------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking outside or clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. SCROLL-SPY ACTIVE LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* --------------------------------------------------------------------------
     4. REVEAL ANIMATIONS ON SCROLL (FADE-UP)
     -------------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     5. BILINGUAL LANGUAGE SWITCHER (UZBEK DEFAULT & ENGLISH)
     -------------------------------------------------------------------------- */
  const setLanguage = (lang) => {
    if (typeof translations === 'undefined' || !translations[lang]) return;

    // Update active button state
    langBtns.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[lang][key] !== undefined) {
        const val = translations[lang][key];
        if (val.includes('<') && val.includes('>')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update placeholders with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      if (translations[lang][key] !== undefined) {
        el.placeholder = translations[lang][key];
      }
    });

    // Save preference
    localStorage.setItem('jt_lang', lang);
  };

  // Language button listeners
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.dataset.lang;
      setLanguage(targetLang);
    });
  });

  // Default to Uzbek ('uz')
  const savedLang = localStorage.getItem('jt_lang') || 'uz';
  setLanguage(savedLang);

  /* --------------------------------------------------------------------------
     6. CONTACT FORM HANDLING WITH TOAST FEEDBACK
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      const currentLang = localStorage.getItem('jt_lang') || 'uz';

      // Temporary visual loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
        </svg>
        ${currentLang === 'uz' ? 'Xabar yuborilmoqda...' : 'Transmitting Message...'}
      `;

      setTimeout(() => {
        // Reset form
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;

        // Show elegant toast notice
        if (toastNotice) {
          toastNotice.classList.add('show');
          setTimeout(() => {
            toastNotice.classList.remove('show');
          }, 5500);
        }
      }, 1200);
    });
  }
});
