const filling = (state) => {
  state.uiState.formDisabled = false;
};

const validating = (state) => {
  state.uiState.formDisabled = true;
};

const sending = (state) => {
  state.validationState = 'valid';
  state.uiState.feedback.style = 'info';
  state.uiState.feedback.key = 'sending';
};

const downloaded = (state) => {
  state.uiState.feedback.style = 'info';
  state.uiState.feedback.key = 'downloaded';
};

const processed = (state) => {
  state.uiState.feedback.style = 'success';
  state.uiState.feedback.key = 'success';
  state.validationState = null;
  state.uiState.formDisabled = false;
};

const failed = (state) => {
  state.uiState.formDisabled = false;
  const { error } = state;
  const isNetworkError = error === 'Network Error';
  const isKnown = [
    'required',
    'invalid',
    'exists',
    'parserror',
  ].includes(error);
  const isUnknown = !(isNetworkError || isKnown);
  if (isUnknown) {
    state.uiState.feedback.key = 'unknown';
    state.uiState.feedback.style = 'secondary';
    return;
  }
  state.uiState.feedback.style = 'danger';
  const key = isNetworkError ? 'failure' : error;
  state.uiState.feedback.key = key;
  if (['required', 'invalid', 'exists'].includes(key)) {
    state.validationState = key;
  }
};

const handleProcess = {
  filling,
  validating,
  sending,
  downloaded,
  processed,
  failed,
};

export default (state, processState) => {
  handleProcess[processState](state);
  state.processState = processState;
};

export const getViewButtonHandler = (state, { title, description, link }) => (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { target } = e;
  const aPostEl = target.previousSibling;
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
    modalCloseButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
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
  const id = target.getAttribute('data-id');
  state.uiState.viewed[id] = true;
  aPostEl.classList.remove('fw-bold');
  aPostEl.classList.add('fw-normal', 'link-secondary');
};
