document.addEventListener("DOMContentLoaded", () => {
  const signupModal = document.getElementById("signup-modal");
  const memoriesModal = document.getElementById("memories-modal");

  const openSignupBtn = document.getElementById("open-signup");
  const openMemoriesBtn = document.getElementById("open-memories");

  const openModal = (modal) => {
    if (modal) modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = (modal) => {
    if (modal) modal.setAttribute("aria-hidden", "true");
  };

  // Open buttons
  if (openSignupBtn && signupModal) {
    openSignupBtn.addEventListener("click", () => openModal(signupModal));
  }

  if (openMemoriesBtn && memoriesModal) {
    openMemoriesBtn.addEventListener("click", () => openModal(memoriesModal));
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

  // Close when clicking the dark backdrop
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        if (modal.id === "signup-modal") closeModal(signupModal);
        if (modal.id === "memories-modal") closeModal(memoriesModal);
      }
    });
  });

  // Prevent clicks inside dialog from closing modal
  document.querySelectorAll(".modal-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (e) => e.stopPropagation());
  });
});
