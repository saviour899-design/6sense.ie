const joinModal = document.getElementById('joinModal');
const uploadModal = document.getElementById('uploadModal');

const openJoin = document.getElementById('openJoin');
const closeJoin = document.getElementById('closeJoin');

const openUpload = document.getElementById('openUpload');
const closeUpload = document.getElementById('closeUpload');

function openModal(modal) {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

openJoin.addEventListener('click', () => openModal(joinModal));
closeJoin.addEventListener('click', () => closeModal(joinModal));

openUpload.addEventListener('click', () => openModal(uploadModal));
closeUpload.addEventListener('click', () => closeModal(uploadModal));

// Close when clicking outside modal
[joinModal, uploadModal].forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

// ESC closes
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal(joinModal);
    closeModal(uploadModal);
  }
});
