'use strict';

const initHeaderScroll = () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    const handleBreakpoint = (e) => {
        if (e.matches) {
            window.removeEventListener('scroll', onScroll);
            header.classList.add('is-scrolled');
        } else {
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    };

    mediaQuery.addEventListener('change', handleBreakpoint);
    handleBreakpoint(mediaQuery);
};

const initMobileNav = () => {
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (!navToggle || !mobileNav) return;

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
};

const initDropdowns = () => {
    const dropdownFields = document.querySelectorAll('[data-dropdown]');

    const closeAllDropdowns = (except) => {
        dropdownFields.forEach((field) => {
            if (field === except) return;
            field.classList.remove('is-open');
            const trigger = field.querySelector('.finder-trigger');
            const dropdown = field.querySelector('.finder-dropdown');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            if (dropdown) dropdown.hidden = true;
        });
    };

    dropdownFields.forEach((field) => {
        const trigger = field.querySelector('.finder-trigger');
        const dropdown = field.querySelector('.finder-dropdown');
        const valueEl = field.querySelector('.finder-value');

        if (!trigger || !dropdown) return;

        trigger.addEventListener('click', () => {
            const willOpen = !field.classList.contains('is-open');
            closeAllDropdowns(willOpen ? field : null);
            field.classList.toggle('is-open', willOpen);
            trigger.setAttribute('aria-expanded', String(willOpen));
            dropdown.hidden = !willOpen;
        });

        dropdown.querySelectorAll('li').forEach((option) => {
            const selectOption = () => {
                if (valueEl) {
                    valueEl.textContent = option.textContent;
                    valueEl.title = option.textContent;
                }
                field.dataset.selectedValue = option.dataset.value || '';
                field.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
                dropdown.hidden = true;
                trigger.focus();
            };

            option.addEventListener('click', selectOption);
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectOption();
                }
            });
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-dropdown]')) closeAllDropdowns();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllDropdowns();
    });
};

const initFinderSubmit = () => {
    const form = document.getElementById('finder-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        const ifnsField = form.querySelector('.finder-field:first-of-type');
        const ifnsValue = ifnsField && ifnsField.dataset.selectedValue;

        if (ifnsValue) {
            e.preventDefault();
            window.location.href = `ifns.html?n=${encodeURIComponent(ifnsValue)}`;
        }
    });
};

const initScrollReveal = () => {
    document.querySelectorAll('[data-reveal-group]').forEach((group) => {
        group.querySelectorAll(':scope [data-reveal]').forEach((el, i) => {
            el.style.setProperty('--i', i);
        });
    });

    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.process-list li').forEach((el) => el.classList.add('is-visible'));
};

const initStatCounters = () => {
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
        const countObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        countObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.6 }
        );
        counters.forEach((el) => countObserver.observe(el));
    } else {
        counters.forEach((el) => {
            el.textContent = el.dataset.count + (el.dataset.suffix || '');
        });
    }
};

const initFaqAccordion = () => {
    document.querySelectorAll('.faq-question').forEach((btn) => {
        const answer = btn.nextElementSibling;
        if (!answer) return;

        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('.faq-question').forEach((otherBtn) => {
                if (otherBtn === btn) return;
                otherBtn.setAttribute('aria-expanded', 'false');
                if (otherBtn.nextElementSibling) {
                    otherBtn.nextElementSibling.style.maxHeight = null;
                }
            });

            btn.setAttribute('aria-expanded', String(!isOpen));
            answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
        });
    });
};

const initButtonEffects = () => {
    document.querySelectorAll('.btn-dark').forEach((btn) => {
        btn.addEventListener('pointermove', (e) => {
            const rect = btn.getBoundingClientRect();
            btn.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            btn.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    });
};

const initCtaForm = () => {
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
            if (ctaSuccess) ctaSuccess.hidden = false;
        });
    }
};

const initMobileStickyCta = () => {
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
};

const initIfnsPage = () => {
    const heading = document.getElementById('ifns-heading');
    if (!heading) return;

    const params = new URLSearchParams(window.location.search);
    const n = params.get('n');
    const label = n ? `ИФНС № ${n} по г. Москве` : 'ИФНС Москвы';

    heading.textContent = n ? `Свободные адреса — ${label}` : 'Свободные адреса по всем ИФНС';

    const crumb = document.getElementById('ifns-crumb');
    if (crumb) crumb.textContent = label;

    document.querySelectorAll('.js-ifns-label').forEach((el) => {
        el.textContent = label;
    });

    document.title = `Свободные адреса — ${label} — ADRES`;
};

const initFooterYear = () => {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
};

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initDropdowns();
    initFinderSubmit();
    initScrollReveal();
    initStatCounters();
    initFaqAccordion();
    initButtonEffects();
    initCtaForm();
    initIfnsPage();
    initMobileStickyCta();
    initFooterYear();
});