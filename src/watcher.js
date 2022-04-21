import onChange from 'on-change';
import renderModal from './renderers/modal.js';
import renderFeeds from './renderers/feeds.js';
import renderPosts from './renderers/posts.js';
import {
  renderFeedback,
  renderBorder,
  toggleDisabling,
  clearInputForm,
}
  from './renderers/form.js';

export default (state, i18n) => onChange(
  state,
  (path, value) => {
    // console.log(`${path}: ${value}`);
    switch (path) {
      case 'updateState':
        if (value === 'finished') {
          renderPosts(state, i18n.t('posts'), i18n.t('view'));
        }
        break;
      case 'uiState.form.disabled':
        toggleDisabling(value);
        break;
      case 'uiState.form.border':
        renderBorder(value);
        break;
      case 'uiState.feedback.key':
        renderFeedback(state.uiState.feedback, i18n);
        break;
      case 'uiState.modal.show':
        if (!value) {
          // markViewedPost(state.uiState.modal.postId);
          renderModal(state);
        }
        break;
      case 'processState':
        if (value === 'processed') {
          clearInputForm();
          renderFeeds(state.feeds, i18n.t('feeds'));
          renderPosts(state, i18n.t('posts'), i18n.t('view'));
        }
        break;
      case 'posts':
        // console.log(JSON.stringify(state.posts, null, '  '));
        break;
      case 'feeds':
        // console.log(JSON.stringify(state.feeds, null, '  '));
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
