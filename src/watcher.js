import onChange from 'on-change';

import renderModal from './renderers/modal.js';
import {
  renderFeedback,
  renderFeeds,
  renderPosts,
  // markViewedPost,
  renderBorder,
}
  from './renderer.js';

export default (state, i18n) => {
  const input = document.querySelector('#url-input');
  const addButton = document.querySelector('button[type=submit]');
  return onChange(
    state,
    (path, value) => {
      // console.log(`path: ${path}; value: ${JSON.stringify(value, null, '  ')}`);
      // console.log(`onChange path: ${path}`);
      switch (path) {
        case 'counter':
          console.log(`!!!--------------> ${value} <--------------!!!`);
          break;
        case 'validationState':
          // console.log('validationState', value);
          break;
        case 'uiState.form.disabled':
          // console.log('uiState.form.disabled', value);
          addButton.disabled = value;
          input.readOnly = value;
          break;
        case 'uiState.form.border':
          // console.log('uiState.form.border:', value);
          renderBorder(value);
          break;
        case 'uiState.feedback.key':
          renderFeedback(state.uiState.feedback, i18n);
          // console.log('uiState.feedback.key:', value);
          break;
        case 'uiState.modal.show':
          // console.log('uiState.modal.show:', value);
          // renderModal(state);
          if (!value) {
            // markViewedPost(state.uiState.modal.postId);
            renderModal(state);
          }
          break;
        case 'processState':
          switch (value) {
            case 'filling':
              // console.log('processState:', value);
              break;
            case 'validating':
              // console.log('processState:', value);
              console.log(
                'validating, feeds:\t',
                JSON.stringify(state.feeds, null, '  '),
                '\tposts:',
                JSON.stringify(state.posts, null, '  '),
              );
              break;
            case 'sending':
              // console.log('processState:', value);
              // renderFeedback(state.uiState.feedback, i18n);
              break;
            case 'downloaded':
              // console.log('processState:', value);
              // renderFeedback(state.uiState.feedback, i18n);
              break;
            case 'processed':
              // console.log('processState:', value);
              // renderFeedback(state.uiState.feedback, i18n);
              input.value = '';
              renderBorder('none');
              console.log(
                'processed, feeds:\t',
                JSON.stringify(state.feeds, null, '  '),
                '\tposts:',
                JSON.stringify(state.posts, null, '  '),
              );
              break;
            case 'failed':
              // console.log('processState:', value);
              // renderFeedback(state.uiState.feedback, i18n);
              // input.value = '';
              break;
            default:
              console.error('processState unknown value:', value);
          }
          break;
        case 'posts':
          // console.log(JSON.stringify(state.posts, null, '  '));
          renderPosts(state, i18n.t('posts'), i18n.t('view'));
          break;
        case 'feeds':
          // console.log(JSON.stringify(state.feeds, null, '  '));
          renderFeeds(state.feeds, i18n.t('feeds'));
          break;
        case 'uiState.feedback.style':
          // console.log('uiState.feedback.style:', value);
          break;
        case 'error':
          // console.log('state.error:', value);
          break;
        default:
          console.error('unknown path:', path);
      }
    },
  );
};
