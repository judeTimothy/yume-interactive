(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);

  /* Portfolio filters */
  function initFilters() {
    const filters = $("#filters");
    const grid = $("#portfolioGrid");
    if (!filters || !grid) return;
    const cards = [...grid.querySelectorAll(".portfolio-card")];

    const applyFilter = (filter) => {
      cards.forEach((card) => {
        const show = filter === "featured"
          ? card.dataset.featured === "true"
          : card.dataset.categories.split("|").includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
    };

    filters.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-filter]");
      if (!btn) return;
      filters.querySelectorAll(".chip").forEach((chip) => {
        chip.classList.remove("is-active");
        chip.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      applyFilter(btn.dataset.filter);
    });
  }

  /* Mobile navigation */
  function initMobileNav() {
    const toggle = $("#menuToggle");
    const panel = $("#mobileNav");
    if (!toggle || !panel) return;

    const closeNav = () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    panel.addEventListener("click", (event) => event.stopPropagation());

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains("nav-open")) return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      closeNav();
    });

    document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  /* Contact form (progressive: posts natively to Formspree if JS is unavailable) */
  function initContactForm() {
    const form = $("#contactForm");
    const error = $("#formError");
    const success = $("#formSuccess");
    if (!form) return;
    const defaultError = error.textContent;
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.style.display = "none";
      success.style.display = "none";

      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !validEmail) {
        error.textContent = defaultError;
        error.style.display = "block";
        return;
      }

      button.disabled = true;
      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        });
        if (!response.ok) throw new Error("Form submission failed.");
        success.style.display = "block";
        form.reset();
      } catch (err) {
        error.textContent = "Something went wrong while sending the form. Please try again or email us directly.";
        error.style.display = "block";
      } finally {
        button.disabled = false;
      }
    });
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  initFilters();
  initMobileNav();
  initContactForm();
})();
