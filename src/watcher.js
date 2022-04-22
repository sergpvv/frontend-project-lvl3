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
    switch (path) {
      case 'checkingFeedsUpdate':
        if (value === 'finished') {
          renderPosts(state, i18n.t('posts'), i18n.t('view'));
        }
        break;
      case 'uiState.modal.show':
        if (!value) {
          renderModal(state);
        }
        break;
      case 'error.name':
        if (value === 'validation') {
          renderBorder('invalid');
        }
        break;
      case 'processState':
        switch (value) {
          case 'validating':
            toggleDisabling(true);
            break;
          case 'sending':
            renderBorder('valid');
            renderFeedback({ key: 'sending', style: 'info' }, i18n);
            break;
          case 'processed':
            toggleDisabling(false);
            renderBorder('none');
            clearInputForm();
            renderFeedback({ key: 'success', style: 'success' }, i18n);
            renderFeeds(state.feeds, i18n.t('feeds'));
            renderPosts(state, i18n.t('posts'), i18n.t('view'));
            break;
          case 'failed':
            toggleDisabling(false);
            renderFeedback({ key: state.error.message, style: 'danger' }, i18n);
            break;
          default:
            console.error('unknown processState:', value);
        }
        break;
      default:
        // console.log(`${path}: ${value}`);
    }
  },
);
