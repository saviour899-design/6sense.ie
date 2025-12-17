document.addEventListener("DOMContentLoaded", () => {
  const signupModal = document.getElementById("signup-modal");
  const memoriesModal = document.getElementById("memories-modal");

  document.getElementById("open-signup").onclick = () =>
    signupModal.setAttribute("aria-hidden", "false");

  document.getElementById("open-memories").onclick = () =>
    memoriesModal.setAttribute("aria-hidden", "false");

  document.querySelectorAll("[data-close='signup']").forEach(el =>
    el.onclick = () => signupModal.setAttribute("aria-hidden", "true")
  );

  document.querySelectorAll("[data-close='memories']").forEach(el =>
    el.onclick = () => memoriesModal.setAttribute("aria-hidden", "true")
  );

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      signupModal.setAttribute("aria-hidden", "true");
      memoriesModal.setAttribute("aria-hidden", "true");
    }
  });

  document.getElementById("signup-form").onsubmit = e => {
    e.preventDefault();
    document.getElementById("signup-message").textContent =
      "You're on the list.";
    e.target.reset();
  };

  document.getElementById("memories-form").onsubmit = e => {
    e.preventDefault();
    document.getElementById("memories-message").textContent =
      "Memory received.";
    e.target.reset();
  };
});
