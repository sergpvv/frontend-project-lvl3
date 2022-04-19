import renderModal from '../renderers/modal.js';

export const getViewButtonHandler = (state) => (e) => {
  e.preventDefault();
  const id = e.target.getAttribute('data-id');
  state.uiState.viewed[id] = true;
  state.uiState.modal.postId = id;
  state.uiState.modal.show = true;
  renderModal(state);
};

export const getCloseModalButtonHandler = (state) => (e) => {
  e.preventDefault();
  state.uiState.viewed[state.uiState.modal.postId] = true;
  // state.uiState.modal.postId = null;
  state.uiState.modal.show = false;
};
