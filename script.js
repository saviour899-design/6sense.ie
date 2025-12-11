// Wait until page is ready
document.addEventListener("DOMContentLoaded", () => {
  // Helpers
  const openModal = (modal) => {
    if (modal) modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = (modal) => {
    if (modal) modal.setAttribute("aria-hidden", "true");
  };

  // Get DOM elements
  const signupModal = document.getElementById("signup-modal");
  const memoriesModal = document.getElementById("memories-modal");

  const openSignupBtn = document.getElementById("open-signup");
  const openMemoriesBtn = document.getElementById("open-memories");

  // Open buttons
  if (openSignupBtn && signupModal) {
    openSignupBtn.addEventListener("click", () => openModal(signupModal));
  }

  if (openMemoriesBtn && memoriesModal) {
    openMemoriesBtn.addEventListener("click", () =>
      openModal(memoriesModal)
    );
  }

  // Close via [data-close]
  document.querySelectorAll("[data-close='signup']").forEach((el) => {
    el.addEventListener("click", () => closeModal(signupModal));
  });

  document.querySelectorAll("[data-close='memories']").forEach((el) => {
    el.addEventListener("click", () => closeModal(memoriesModal));
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(signupModal);
      closeModal(memoriesModal);
    }
  });

  // Prevent clicks inside the modal from closing it
  document.querySelectorAll(".modal-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (e) => e.stopPropagation());
  });

  // Clicking the dark backdrop closes the modal (the backdrop has data-close)
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        if (modal.id === "signup-modal") closeModal(signupModal);
        if (modal.id === "memories-modal") closeModal(memoriesModal);
      }
    });
  });

  // -----------------------------
  // JOIN THE LIST FORM (front-end only)
  // -----------------------------
  const signupForm = document.getElementById("signup-form");
  const signupMsg = document.getElementById("signup-message");

  if (signupForm && signupMsg) {
    signupForm.addEventListener("submit", (e) => {
      // If you later connect to Google Forms, remove this preventDefault
      e.preventDefault();

      signupMsg.textContent = "You’re on the list. We’ll be in touch.";
      signupMsg.classList.remove("error");
      signupMsg.classList.add("success");
      signupForm.reset();
    });
  }

  // -----------------------------
  // MEMORIES FORM (front-end only)
  // -----------------------------
  const memoriesForm = document.getElementById("memories-form");
  const memoriesMsg = document.getElementById("memories-message");
  const memFileInput = document.getElementById("mem-file");
  const memConsent = document.getElementById("mem-consent");

  if (memoriesForm && memoriesMsg) {
    memoriesForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!memFileInput || !memConsent) return;

      if (!memFileInput.files.length || !memConsent.checked) {
        memoriesMsg.textContent = "Please upload a file and confirm consent.";
        memoriesMsg.classList.remove("success");
        memoriesMsg.classList.add("error");
        return;
      }

      memoriesMsg.textContent = "Memory submitted. Thank you for sharing.";
      memoriesMsg.classList.remove("error");
      memoriesMsg.classList.add("success");
      memoriesForm.reset();
    });
  }
});
