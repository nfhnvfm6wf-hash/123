(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     Header: compact + translucent on scroll
  --------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile navigation
  --------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Открыть меню');
    });
  });

  /* ---------------------------------------------------------------------
     Finder dropdowns
  --------------------------------------------------------------------- */
  const dropdownFields = document.querySelectorAll('[data-dropdown]');

  const closeAllDropdowns = (except) => {
    dropdownFields.forEach((field) => {
      if (field === except) return;
      field.classList.remove('is-open');
      field.querySelector('.finder-trigger').setAttribute('aria-expanded', 'false');
      field.querySelector('.finder-dropdown').hidden = true;
    });
  };

  dropdownFields.forEach((field) => {
    const trigger = field.querySelector('.finder-trigger');
    const dropdown = field.querySelector('.finder-dropdown');
    const valueEl = field.querySelector('.finder-value');

    trigger.addEventListener('click', () => {
      const willOpen = !field.classList.contains('is-open');
      closeAllDropdowns(willOpen ? field : null);
      field.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
      dropdown.hidden = !willOpen;
    });

    dropdown.querySelectorAll('li').forEach((option) => {
      const selectOption = () => {
        valueEl.textContent = option.textContent;
        field.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        dropdown.hidden = true;
        trigger.focus();
      };
      option.addEventListener('click', selectOption);
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(); }
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-dropdown]')) closeAllDropdowns();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  /* ---------------------------------------------------------------------
     Scroll reveal (fade + move up, staggered within groups)
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll(':scope [data-reveal]').forEach((el, i) => {
      el.style.setProperty('--i', i);
    });
  });

  const revealTargets = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* Process timeline lines reveal individually */
  document.querySelectorAll('.process-list li').forEach((el) => {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      io.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  });

  /* ---------------------------------------------------------------------
     Animated stat counters
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countObserver.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* ---------------------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    const answer = btn.nextElementSibling;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-question').forEach((otherBtn) => {
        if (otherBtn === btn) return;
        otherBtn.setAttribute('aria-expanded', 'false');
        otherBtn.nextElementSibling.style.maxHeight = null;
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  /* ---------------------------------------------------------------------
     Property "favourite" toggle
  --------------------------------------------------------------------- */
  document.querySelectorAll('.property-fav').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('is-active');
    });
  });

  /* ---------------------------------------------------------------------
     CTA buttons: track pointer for radial highlight
  --------------------------------------------------------------------- */
  document.querySelectorAll('.btn-dark').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  /* ---------------------------------------------------------------------
     Final CTA form (client-side only demo submit)
     Заменить на реальную интеграцию с CRM / backend при подключении.
  --------------------------------------------------------------------- */
  const ctaForm = document.getElementById('cta-form');
  const ctaSuccess = document.getElementById('cta-success');

  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!ctaForm.checkValidity()) {
        ctaForm.reportValidity();
        return;
      }
      ctaForm.hidden = true;
      ctaSuccess.hidden = false;
    });
  }

  /* ---------------------------------------------------------------------
     Mobile sticky CTA visibility (hide once final CTA is in view)
  --------------------------------------------------------------------- */
  const mobileSticky = document.getElementById('mobile-sticky');
  const ctaFinal = document.getElementById('cta-final');

  if (mobileSticky) {
    const showSticky = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.6;
      let overFinal = false;
      if (ctaFinal) {
        const rect = ctaFinal.getBoundingClientRect();
        overFinal = rect.top < window.innerHeight * 0.5;
      }
      mobileSticky.classList.toggle('is-visible', scrolled && !overFinal);
    };
    showSticky();
    window.addEventListener('scroll', showSticky, { passive: true });
    window.addEventListener('resize', showSticky);
  }

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
