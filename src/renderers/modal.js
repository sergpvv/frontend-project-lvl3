export default (state) => {
  const modal = document.querySelector('#modal');
  const body = document.querySelector('body');
  if (state.uiState.modal.show) {
    const id = state.uiState.modal.postId;
    document.querySelector(`.posts a[data-id="${id}"]`)
      .className = 'fw-normal link-secondary';
    const { title, description, link } = state.posts[id];
    const getElement = (selector) => modal.querySelector(selector);
    const modalTitle = getElement('.modal-title');
    modalTitle.textContent = title;
    const modalBody = getElement('.modal-body');
    modalBody.textContent = description;
    const modalAButton = getElement('a.btn');
    modalAButton.setAttribute('href', link);
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    body.classList.add('modal-open');
    body.setAttribute('data-bs-overflow', 'hidden');
    body.setAttribute('data-bs-padding-right', '0px');
    body.style = 'overflow: hidden; padding-right: 0px;';
    modal.style.display = 'block';
    modal.className = 'modal fade show';
    return;
  }
  // else close modal
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  modal.className = 'modal fade';
  body.classList.remove('modal-open');
  body.removeAttribute('data-bs-overflow');
  body.removeAttribute('data-bs-padding-right');
  body.removeAttribute('style');
};
