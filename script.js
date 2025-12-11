function toggleModal(id, show) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.setAttribute("aria-hidden", show ? "false" : "true");
}

const openSignup = document.getElementById("open-signup");
const openMemories = document.getElementById("open-memories");

if (openSignup) {
  openSignup.addEventListener("click", () => toggleModal("signup-modal", true));
}
if (openMemories) {
  openMemories.addEventListener("click", () =>
    toggleModal("memories-modal", true)
  );
}

document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const closeType = target.getAttribute("data-close");
  if (closeType === "signup") toggleModal("signup-modal", false);
  if (closeType === "memories") toggleModal("memories-modal", false);
});

document.querySelectorAll(".modal-close").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-close");
    if (type === "signup") toggleModal("signup-modal", false);
    if (type === "memories") toggleModal("memories-modal", false);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    toggleModal("signup-modal", false);
    toggleModal("memories-modal", false);
  }
});

// JOIN THE LIST FORM
const signupForm = document.getElementById("signup-form");
const signupMsg = document.getElementById("signup-message");

if (signupForm && signupMsg) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // TODO: hook to a backend or email service
    signupMsg.textContent = "You’re on the list. We’ll be in touch.";
    signupMsg.classList.remove("error");
    signupMsg.classList.add("success");
    signupForm.reset();
  });
}

// MEMORIES FORM
const memoriesForm = document.getElementById("memories-form");
const memoriesMsg = document.getElementById("memories-message");

if (memoriesForm && memoriesMsg) {
  memoriesForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("mem-file");
    const consent = document.getElementById("mem-consent");

    if (!fileInput.files.length || !consent.checked) {
      memoriesMsg.textContent = "Please upload a file and confirm consent.";
      memoriesMsg.classList.remove("success");
      memoriesMsg.classList.add("error");
      return;
    }

    // TODO: send to backend / storage
    memoriesMsg.textContent = "Memory submitted. Thank you for sharing.";
    memoriesMsg.classList.remove("error");
    memoriesMsg.classList.add("success");
    memoriesForm.reset();
  });
}
