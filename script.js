(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Year
  $$("#year").forEach(el => el.textContent = new Date().getFullYear());

  // Profile data
  if (window.MIKINCH_PROFILE) {
    const p = window.MIKINCH_PROFILE;
    $$("[data-profile-name]").forEach(el => el.textContent = p.name);
    $$("[data-profile-location]").forEach(el => el.textContent = p.location);
    $$("[data-profile-intro]").forEach(el => el.textContent = p.intro);
    $$("[data-profile-bio]").forEach(el => el.textContent = p.bio);
    $$("[data-profile-headline]").forEach(el => el.textContent = p.headline);
    $$("[data-profile-description]").forEach(el => el.textContent = p.description);

    $$("[data-contact]").forEach(el => {
      const type = el.dataset.contact;
      const value = p.contacts?.[type] || "#";
      el.href = value;
      if (value === "#") {
        el.addEventListener("click", e => e.preventDefault());
      }
    });
  }

  // Active navigation
  const current = document.body.dataset.page;
  $$("[data-nav]").forEach(link => {
    if (link.dataset.nav === current) link.classList.add("active");
  });

  // Mobile menu
  const menuToggle = $(".menu-toggle");
  const nav = $(".main-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const opened = menuToggle.classList.toggle("open");
      nav.classList.toggle("open", opened);
      menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
      document.body.classList.toggle("menu-open", opened);
    });
    $$(".main-nav a").forEach(link => link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
    }));
  }

  // Cursor glow — desktop only
  const glow = $(".cursor-glow");
  if (glow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", e => {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });
  }

  // Reveal
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => io.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  // Tilt cards
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".tilt-card").forEach(card => {
      const strength = 7;
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 2 - 1;
        const y = ((e.clientY - r.top) / r.height) * 2 - 1;
        card.style.transform = `perspective(900px) rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(x * strength).toFixed(2)}deg) translateZ(0)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Magnetic buttons
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(x * 0.08).toFixed(2)}px, ${(y * 0.08).toFixed(2)}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // Smooth local anchors
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
