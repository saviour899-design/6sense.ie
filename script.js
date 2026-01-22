document.addEventListener("DOMContentLoaded", () => {
  // ---------- Year ----------
  const y = new Date().getFullYear();
  const yearEl = document.getElementById("year");
  const yearEl2 = document.getElementById("year2");
  if (yearEl) yearEl.textContent = y;
  if (yearEl2) yearEl2.textContent = y;

  // ---------- Mobile nav ----------
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const setMenuOpen = (open) => {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // ---------- Active nav highlight ----------
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = ["about", "gallery", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => a.classList.toggle("is-active", a.dataset.section === id));
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach(sec => navIO.observe(sec));

  // ---------- Your existing backend modal logic ----------
  const signupModal = document.getElementById("signup-modal");
  const memoriesModal = document.getElementById("memories-modal");

  const openSignupBtn = document.getElementById("open-signup");
  const openSignupBtn2 = document.getElementById("open-signup-2"); // extra button in Contact
  const openMemoriesBtn = document.getElementById("open-memories");

  const signupForm = document.getElementById("signup-form");
  const memoriesForm = document.getElementById("memories-form");

  const signupMsg = document.getElementById("signup-message");
  const memoriesMsg = document.getElementById("memories-message");

  const openModal = (m) => {
    if (!m) return;
    m.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const closeModal = (m) => {
    if (!m) return;
    m.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  openSignupBtn?.addEventListener("click", () => openModal(signupModal));
  openSignupBtn2?.addEventListener("click", () => openModal(signupModal));
  openMemoriesBtn?.addEventListener("click", () => openModal(memoriesModal));

  document.querySelectorAll("[data-close='signup']").forEach((el) => {
    el.addEventListener("click", () => closeModal(signupModal));
  });
  document.querySelectorAll("[data-close='memories']").forEach((el) => {
    el.addEventListener("click", () => closeModal(memoriesModal));
  });

  // Click outside modal closes
  [signupModal, memoriesModal].forEach((modal) => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(signupModal);
      closeModal(memoriesModal);
      setMenuOpen(false);
    }
  });

  // Join list submit
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (signupMsg) {
      signupMsg.textContent = "Submitting...";
      signupMsg.style.color = "#aaa";
    }

    const formData = new FormData(signupForm);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      const res = await fetch("/.netlify/functions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to submit.");

      if (signupMsg) {
        signupMsg.textContent = "You're on the list.";
        signupMsg.style.color = "#9affb5";
      }
      signupForm.reset();
    } catch (err) {
      if (signupMsg) {
        signupMsg.textContent = err.message || "Something went wrong.";
        signupMsg.style.color = "#ff8a8a";
      }
    }
  });

  // Memories submit (file upload)
  memoriesForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (memoriesMsg) {
      memoriesMsg.textContent = "Uploading...";
      memoriesMsg.style.color = "#aaa";
    }

    const formData = new FormData(memoriesForm);

    try {
      const res = await fetch("/.netlify/functions/memories", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      if (memoriesMsg) {
        memoriesMsg.textContent = "Memory received.";
        memoriesMsg.style.color = "#9affb5";
      }
      memoriesForm.reset();
    } catch (err) {
      if (memoriesMsg) {
        memoriesMsg.textContent = err.message || "Something went wrong.";
        memoriesMsg.style.color = "#ff8a8a";
      }
    }
  });
});
