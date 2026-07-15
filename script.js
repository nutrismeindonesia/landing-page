/* ============================================================
   SIMSALACLEAN — Landing Page Script
   - Lead form validation & submission
   - Scroll-reveal animations
   - Counter animation
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function setError(inputEl, errorEl, msg) {
    if (!inputEl || !errorEl) return;
    errorEl.textContent = msg;
    if (msg) {
      inputEl.classList.add('invalid');
      inputEl.setAttribute('aria-invalid', 'true');
    } else {
      inputEl.classList.remove('invalid');
      inputEl.removeAttribute('aria-invalid');
    }
  }

  function clearError(inputEl, errorEl) {
    setError(inputEl, errorEl, '');
  }

  /* ── Form ────────────────────────────────────────────────── */

  const form        = $('#leadForm');
  const formSuccess = $('#formSuccess');
  const successName = $('#successName');
  const submitBtn   = $('#submitBtn');
  const btnText     = submitBtn ? $('.btn-text', submitBtn) : null;
  const btnSpinner  = submitBtn ? $('.btn-spinner', submitBtn) : null;

  const fields = {
    fullName : { el: $('#fullName'), err: $('#fullNameError') },
    phone    : { el: $('#phone'),    err: $('#phoneError') },
    area     : { el: $('#area'),     err: $('#areaError') },
    consent  : { el: $('#consent'),  err: $('#consentError') },
  };

  // Wrap phone input's parent div for .invalid class
  function phoneWrapper() {
    return fields.phone.el ? fields.phone.el.closest('.input-with-prefix') : null;
  }

  function validateFullName() {
    const val = (fields.fullName.el.value || '').trim();
    if (!val) {
      setError(fields.fullName.el, fields.fullName.err, 'Nama lengkap wajib diisi.');
      return false;
    }
    if (val.length < 2) {
      setError(fields.fullName.el, fields.fullName.err, 'Nama terlalu pendek.');
      return false;
    }
    clearError(fields.fullName.el, fields.fullName.err);
    return true;
  }

  function validatePhone() {
    const raw = (fields.phone.el.value || '').replace(/\D/g, '');
    const wrapper = phoneWrapper();

    if (!raw) {
      fields.phone.err.textContent = 'Nomor WhatsApp wajib diisi.';
      if (wrapper) wrapper.classList.add('invalid');
      fields.phone.el.setAttribute('aria-invalid', 'true');
      return false;
    }
    if (raw.length < 8 || raw.length > 13) {
      fields.phone.err.textContent = 'Nomor tidak valid (8–13 digit).';
      if (wrapper) wrapper.classList.add('invalid');
      fields.phone.el.setAttribute('aria-invalid', 'true');
      return false;
    }
    fields.phone.err.textContent = '';
    if (wrapper) wrapper.classList.remove('invalid');
    fields.phone.el.removeAttribute('aria-invalid');
    return true;
  }

  function validateArea() {
    if (!fields.area.el.value) {
      setError(fields.area.el, fields.area.err, 'Pilih kecamatan kamu.');
      return false;
    }
    clearError(fields.area.el, fields.area.err);
    return true;
  }

  function validateConsent() {
    if (!fields.consent.el.checked) {
      fields.consent.err.textContent = 'Kamu perlu menyetujui untuk melanjutkan.';
      return false;
    }
    fields.consent.err.textContent = '';
    return true;
  }

  // Live validation (on blur)
  if (fields.fullName.el) {
    fields.fullName.el.addEventListener('blur', validateFullName);
    fields.fullName.el.addEventListener('input', function () {
      if (fields.fullName.el.classList.contains('invalid')) validateFullName();
    });
  }

  if (fields.phone.el) {
    fields.phone.el.addEventListener('blur', validatePhone);
    fields.phone.el.addEventListener('input', function () {
      if (phoneWrapper() && phoneWrapper().classList.contains('invalid')) validatePhone();
    });
  }

  if (fields.area.el) {
    fields.area.el.addEventListener('change', validateArea);
  }

  if (fields.consent.el) {
    fields.consent.el.addEventListener('change', validateConsent);
  }

  // Submit
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const ok = [
        validateFullName(),
        validatePhone(),
        validateArea(),
        validateConsent(),
      ].every(Boolean);

      if (!ok) {
        // Focus first invalid field
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      if (btnText)    btnText.textContent = 'Mendaftarkan...';
      if (btnSpinner) btnSpinner.hidden = false;

      // Simulate async submission (replace with real API call)
      setTimeout(function () {
        const name = (fields.fullName.el.value || '').trim().split(' ')[0];

        // Show success
        form.hidden = true;
        if (formSuccess) {
          formSuccess.hidden = false;
          if (successName) successName.textContent = name;
        }

        // Bump counter
        animateCounterBump();

        // Reset button (in case user navigates back)
        submitBtn.disabled = false;
        if (btnText)    btnText.textContent = 'Klaim Diskon 30% Sekarang';
        if (btnSpinner) btnSpinner.hidden = true;
      }, 1600);
    });
  }

  /* ── Counter animation ───────────────────────────────────── */

  const counterEl = $('#counterNum');
  let counterStarted = false;

  function animateCounter(target, duration) {
    if (!counterEl) return;
    const start = parseInt(counterEl.textContent, 10) || 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counterEl.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function animateCounterBump() {
    if (!counterEl) return;
    const current = parseInt(counterEl.textContent, 10) || 248;
    animateCounter(current + 1, 600);
  }

  /* ── FAQ accordion ──────────────────────────────────────── */

  function initFaq() {
    var items = $$('.faq-question');

    items.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var answerId = btn.getAttribute('aria-controls');
        var answer   = document.getElementById(answerId);

        if (!answer) return;

        if (expanded) {
          // Close
          btn.setAttribute('aria-expanded', 'false');
          // Animate height to 0
          answer.style.overflow  = 'hidden';
          answer.style.maxHeight = answer.scrollHeight + 'px';
          requestAnimationFrame(function () {
            answer.style.transition = 'max-height 0.3s ease, opacity 0.25s ease';
            answer.style.opacity    = '0';
            answer.style.maxHeight  = '0';
          });
          answer.addEventListener('transitionend', function onEnd() {
            answer.hidden = true;
            answer.style.cssText = '';
            answer.removeEventListener('transitionend', onEnd);
          });
        } else {
          // Close any other open item first
          items.forEach(function (other) {
            if (other !== btn && other.getAttribute('aria-expanded') === 'true') {
              other.setAttribute('aria-expanded', 'false');
              var otherId  = other.getAttribute('aria-controls');
              var otherAns = document.getElementById(otherId);
              if (otherAns) {
                otherAns.style.overflow   = 'hidden';
                otherAns.style.maxHeight  = otherAns.scrollHeight + 'px';
                requestAnimationFrame(function () {
                  otherAns.style.transition = 'max-height 0.3s ease, opacity 0.25s ease';
                  otherAns.style.opacity    = '0';
                  otherAns.style.maxHeight  = '0';
                });
                otherAns.addEventListener('transitionend', function onOtherEnd() {
                  otherAns.hidden = true;
                  otherAns.style.cssText = '';
                  otherAns.removeEventListener('transitionend', onOtherEnd);
                });
              }
            }
          });

          // Open this item
          btn.setAttribute('aria-expanded', 'true');
          answer.hidden     = false;
          answer.style.overflow   = 'hidden';
          answer.style.maxHeight  = '0';
          answer.style.opacity    = '0';
          requestAnimationFrame(function () {
            answer.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
            answer.style.maxHeight  = answer.scrollHeight + 'px';
            answer.style.opacity    = '1';
          });
          answer.addEventListener('transitionend', function onOpen() {
            answer.style.maxHeight = 'none';
            answer.style.overflow  = '';
            answer.removeEventListener('transitionend', onOpen);
          });
        }
      });

      // Keyboard: open with Space / Enter (already default for button, but guard anyway)
    });
  }

  /* ── Scroll-reveal ───────────────────────────────────────── */

  function initReveal() {
    const targets = $$('.step-card, .feature-card, .testi-card, .pricing-card, .faq-item, .how-it-works h2, .features h2, .testimonials h2, .pricing h2, .faq h2');

    targets.forEach(function (el) {
      el.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all immediately
      targets.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ── Counter reveal on scroll ────────────────────────────── */

  function initCounterReveal() {
    if (!counterEl || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !counterStarted) {
          counterStarted = true;
          animateCounter(248, 1400);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    obs.observe(counterEl);
  }

  /* ── Smooth scroll for CTA anchor ───────────────────────── */

  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Navbar shadow on scroll ─────────────────────────────── */

  const navbar = $('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 16px rgba(13,43,110,0.10)';
      } else {
        navbar.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ── Init ────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initCounterReveal();
    initFaq();
  });

})();
