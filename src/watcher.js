import onChange from 'on-change';
import { renderFeedback, renderFeeds, renderPosts } from './renderer.js';

export default (state, i18n) => {
  const input = document.querySelector('#url-input');
  const addButton = document.querySelector('button[type=submit]');
  return onChange(
    state,
    (path, value) => {
      // console.log(`path: ${path}; value: ${value}`);
      switch (path) {
        case 'validationState':
          switch (value) {
            case 'exists':
              console.log('validationState: ', value);
              break;
            case 'required':
              input.className.replace('is-valid', 'is-invalid');
              break;
            case 'valid':
              input.className.replace('is-invalid', 'is-valid');
              renderFeedback(null);
              break;
            case 'invalid':
              input.className.replace('is-valid', 'is-invalid');
              renderFeedback(state.uiState.feedback, i18n);
              break;
            case null:
              input.classList.remove('is-valid', 'is-invalid');
              renderFeedback(state.uiState.feedback, i18n);
              break;
            default:
              console.error('validationState switch(value) default: ', value);
          }
          break;
        case 'uiState.formDisabled':
          addButton.disabled = value;
          input.readOnly = value;
          break;
        case 'processState':
          switch (value) {
            case 'filling':
              console.log('processState: ', value);
              break;
            case 'validating':
              console.log('processState: ', value);
              break;
            case 'sending':
              renderFeedback(state.uiState.feedback, i18n);
              break;
            case 'downloaded':
              renderFeedback(state.uiState.feedback, i18n);
              break;
            case 'processed':
              renderFeedback(state.uiState.feedback, i18n);
              input.value = '';
              break;
            case 'failed':
              renderFeedback(state.uiState.feedback, i18n);
              break;
            default:
              console.error('processState switch(value) default: ', value);
          }
          break;
        case 'posts':
          renderPosts(state, i18n.t('posts'), i18n.t('view'));
          break;
        case 'feeds':
          renderFeeds(state.feeds, i18n.t('feeds'));
          break;
        case 'uiState.feedback.style':
          console.log('uiState.feedback.style: ', value);
          break;
        case 'uiState.feedback.key':
          console.log('uiState.feedback.key: ', value);
          break;
        case 'error':
          console.log('state.error: ', value);
          break;
        default:
          console.error('switch(path) default: ', path);
      }
    },
  );
};
