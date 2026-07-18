const NUTRISME_BUILD = "2026-07-18-2";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("currentYear");
  const menu = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  year.textContent = new Date().getFullYear();

  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("mobile-open");
    menu.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("mobile-open"));
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("visible"));
  }

  const modal = document.getElementById("orderModal");
  const dialog = modal.querySelector(".modal-dialog");
  const orderBackdrop = document.getElementById("orderBackdrop");
  const openers = document.querySelectorAll("[data-open-order]");
  const closers = modal.querySelectorAll("[data-close-order]");
  const selectedPlan = document.getElementById("selectedPlan");

  const privacyModal = document.getElementById("privacyModal");
  const privacyDialog = privacyModal.querySelector(".privacy-dialog");
  const privacyToggle = document.getElementById("privacyToggle");
  const privacyClosers = privacyModal.querySelectorAll("[data-close-privacy]");

  const form = document.getElementById("orderForm");
  const fullName = document.getElementById("fullName");
  const instagram = document.getElementById("instagram");
  const address = document.getElementById("address");
  const phone = document.getElementById("phone");
  const consent = document.getElementById("consent");
  const submit = document.getElementById("submitOrder");
  const status = document.getElementById("formStatus");
  const success = document.getElementById("orderSuccess");
  const formView = document.getElementById("orderFormView");
  const reset = document.getElementById("resetOrder");
  const website = document.getElementById("website");

  let lastFocus = null;
  let privacyLastFocus = null;

  const syncBodyLock = () => {
    const hasOpenModal = modal.classList.contains("open") || privacyModal.classList.contains("open");
    document.body.style.overflow = hasOpenModal ? "hidden" : "";
  };

  const normalizePhone = (value) => String(value || "")
    .replace(/\D/g, "")
    .replace(/^62/, "")
    .replace(/^0/, "")
    .slice(0, 15);

  const normalizeIg = (value) => String(value || "").trim().replace(/^@/, "");

  phone.addEventListener("input", () => {
    phone.value = normalizePhone(phone.value);
  });

  instagram.addEventListener("input", () => {
    instagram.value = normalizeIg(instagram.value);
  });

  const valid = {
    fullName: () => fullName.value.trim().length >= 3,
    instagram: () => /^[A-Za-z0-9._]{2,50}$/.test(normalizeIg(instagram.value)),
    address: () => address.value.trim().length >= 10,
    phone: () => /^8\d{7,14}$/.test(normalizePhone(phone.value)),
    consent: () => consent.checked
  };

  const fields = {
    fullName: fullName.closest("[data-field]"),
    instagram: instagram.closest("[data-field]"),
    address: address.closest("[data-field]"),
    phone: phone.closest("[data-field]")
  };

  const mark = (key, force = false) => {
    const isValid = valid[key]();
    const field = fields[key];
    if (field) {
      const input = document.getElementById(key);
      field.classList.toggle("invalid", !isValid && (force || input.value.length > 0));
    }
    return isValid;
  };

  const update = () => {
    const isValid = valid.fullName()
      && valid.instagram()
      && valid.address()
      && valid.phone()
      && valid.consent();

    submit.disabled = !isValid;
    status.textContent = isValid
      ? "Data lengkap. Silakan kirim formulir."
      : "Lengkapi seluruh data dan persetujuan.";
  };

  const resetOrderForm = ({ focus = false } = {}) => {
    form.reset();
    selectedPlan.value = "Belum menentukan";
    Object.values(fields).forEach((field) => field.classList.remove("invalid"));
    submit.removeAttribute("aria-busy");
    success.hidden = true;
    formView.hidden = false;
    dialog.scrollTop = 0;
    update();

    if (focus && modal.classList.contains("open")) {
      window.setTimeout(() => fullName.focus(), 0);
    }
  };

  const openModal = (event) => {
    if (!success.hidden) resetOrderForm();
    lastFocus = document.activeElement;
    const plan = event.currentTarget.dataset.plan;
    if (plan) selectedPlan.value = plan;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    syncBodyLock();
    window.setTimeout(() => dialog.focus(), 20);
  };

  const closeModal = () => {
    if (privacyModal.classList.contains("open")) closePrivacy({ restoreFocus: false });
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    syncBodyLock();
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  };

  const openPrivacy = () => {
    privacyLastFocus = document.activeElement;
    privacyModal.classList.add("open");
    privacyModal.setAttribute("aria-hidden", "false");
    dialog.setAttribute("aria-hidden", "true");
    dialog.setAttribute("inert", "");
    privacyDialog.scrollTop = 0;
    syncBodyLock();
    window.setTimeout(() => privacyDialog.focus(), 20);
  };

  function closePrivacy({ restoreFocus = true } = {}) {
    privacyModal.classList.remove("open");
    privacyModal.setAttribute("aria-hidden", "true");
    dialog.removeAttribute("aria-hidden");
    dialog.removeAttribute("inert");
    syncBodyLock();
    if (restoreFocus && privacyLastFocus instanceof HTMLElement) privacyLastFocus.focus();
  }

  openers.forEach((button) => button.addEventListener("click", openModal));
  closers.forEach((button) => button.addEventListener("click", closeModal));
  privacyToggle.addEventListener("click", openPrivacy);
  privacyClosers.forEach((button) => button.addEventListener("click", () => closePrivacy()));

  orderBackdrop.addEventListener("click", () => {
    if (!success.hidden) {
      resetOrderForm({ focus: true });
      return;
    }
    closeModal();
  });

  dialog.addEventListener("click", (event) => {
    if (success.hidden) return;
    if (event.target.closest("[data-close-order], #resetOrder")) return;
    resetOrderForm({ focus: true });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (privacyModal.classList.contains("open")) {
      closePrivacy();
    } else if (modal.classList.contains("open")) {
      closeModal();
    }
  });

  [fullName, instagram, address, phone].forEach((input) => {
    input.addEventListener("input", () => {
      mark(input.id);
      update();
    });
    input.addEventListener("blur", () => mark(input.id, true));
  });

  consent.addEventListener("change", update);
  update();

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxN0ZfvGFX1RPp8pFj4Afxk1Q3JECumWYuaZYel8PY-Fc4OvleOvyzHSq_Ljr1sx69X/exec";

  const createRequestId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const checks = [
      mark("fullName", true),
      mark("instagram", true),
      mark("address", true),
      mark("phone", true),
      valid.consent()
    ];

    if (!checks.every(Boolean)) {
      status.textContent = "Periksa kembali data yang belum valid.";
      return;
    }

    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    status.textContent = "Mengirim data...";

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        cache: "no-store",
        body: new URLSearchParams({
          action: "createOrder",
          build: NUTRISME_BUILD,
          requestId: createRequestId(),
          nama: fullName.value.trim(),
          instagram: normalizeIg(instagram.value),
          alamat: address.value.trim(),
          telepon: normalizePhone(phone.value),
          paket: selectedPlan.value,
          consent: "yes",
          source: window.location.href,
          waktuKlien: new Date().toISOString(),
          website: website.value.trim()
        }),
        signal: controller.signal
      });

      formView.hidden = true;
      success.hidden = false;
      dialog.scrollTop = 0;
    } catch (error) {
      status.textContent = error && error.name === "AbortError"
        ? "Pengiriman terlalu lama. Coba lagi."
        : "Data belum berhasil dikirim. Coba lagi.";
      submit.disabled = false;
    } finally {
      window.clearTimeout(timer);
      submit.removeAttribute("aria-busy");
    }
  });

  reset.addEventListener("click", (event) => {
    event.stopPropagation();
    resetOrderForm({ focus: true });
  });
});
