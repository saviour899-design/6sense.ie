document.addEventListener("DOMContentLoaded", () => {
  const signupModal = document.getElementById("signup-modal");
  const memoriesModal = document.getElementById("memories-modal");

  const openSignupBtn = document.getElementById("open-signup");
  const openMemoriesBtn = document.getElementById("open-memories");

  const signupForm = document.getElementById("signup-form");
  const memoriesForm = document.getElementById("memories-form");

  const signupMsg = document.getElementById("signup-message");
  const memoriesMsg = document.getElementById("memories-message");

  const openModal = (m) => m && m.setAttribute("aria-hidden", "false");
  const closeModal = (m) => m && m.setAttribute("aria-hidden", "true");

  // Open modals
  openSignupBtn?.addEventListener("click", () => openModal(signupModal));
  openMemoriesBtn?.addEventListener("click", () => openModal(memoriesModal));

  // Close modals
  document.querySelectorAll("[data-close='signup']").forEach((el) => {
    el.addEventListener("click", () => closeModal(signupModal));
  });
  document.querySelectorAll("[data-close='memories']").forEach((el) => {
    el.addEventListener("click", () => closeModal(memoriesModal));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(signupModal);
      closeModal(memoriesModal);
    }
  });

  // Join list submit
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupMsg.textContent = "Submitting...";
    signupMsg.style.color = "#aaa";

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

      signupMsg.textContent = "You're on the list.";
      signupMsg.style.color = "#9affb5";
      signupForm.reset();
    } catch (err) {
      signupMsg.textContent = err.message || "Something went wrong.";
      signupMsg.style.color = "#ff8a8a";
    }
  });

  // Memories submit (file upload)
  memoriesForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    memoriesMsg.textContent = "Uploading...";
    memoriesMsg.style.color = "#aaa";

    const formData = new FormData(memoriesForm);

    // Convert consent checkbox to a value the backend understands
    // (Netlify multipart sends "on" automatically when checked — that’s fine)
    try {
      const res = await fetch("/.netlify/functions/memories", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      memoriesMsg.textContent = "Memory received.";
      memoriesMsg.style.color = "#9affb5";
      memoriesForm.reset();
    } catch (err) {
      memoriesMsg.textContent = err.message || "Something went wrong.";
      memoriesMsg.style.color = "#ff8a8a";
    }
  });
});
