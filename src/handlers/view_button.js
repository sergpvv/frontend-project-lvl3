export default (state, { title, description, link }) => ({ target }) => {
  // event.preventDefault();
  // event.stopPropagation();
  // const { target } = event;
  const id = target.getAttribute('data-id');
  state.uiState.viewed[id] = true;

  const aSibling = target.previousSibling;
  aSibling.classList.remove('fw-bold');
  aSibling.classList.add('fw-normal', 'link-secondary');

  const modal = document.querySelector('#modal');
  const body = document.querySelector('body');
  const getElement = (selector) => modal.querySelector(selector);
  const modalTitle = getElement('.modal-title');
  modalTitle.textContent = title;
  const modalBody = getElement('.modal-body');
  modalBody.textContent = description;
  const modalAButton = getElement('a.btn');
  modalAButton.setAttribute('href', link);
  const modalCloseButtons = modal.querySelectorAll('button[type="button"]');
  modalCloseButtons.forEach((modalCloseButton) => {
    modalCloseButton.addEventListener('click', () => {
      // e.preventDefault();
      // e.stopPropagation();
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      modal.className = 'modal fade';
      body.classList.remove('modal-open');
      body.removeAttribute('data-bs-overflow');
      body.removeAttribute('data-bs-padding-right');
      body.removeAttribute('style');
    });
  });
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', 'true');
  body.classList.add('modal-open');
  body.setAttribute('data-bs-overflow', 'hidden');
  body.setAttribute('data-bs-padding-right', '0px');
  body.style = 'overflow: hidden; padding-right: 0px;';
  modal.style.display = 'block';
  modal.className = 'modal fade show';
};
