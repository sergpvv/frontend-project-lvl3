import onChange from 'on-change';
import { getViewButtonHandler } from './handlers.js';

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const setAttributes = (element, ...attributes) => {
  attributes.forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
};

const renderFeedback = (value, i18n) => {
  const feedback = document.querySelector('.feedback');
  if (!value) {
    feedback.textContent = '';
    return;
  }
  const { style, key } = value;
  feedback.textContent = i18n.t(key);
  const classes = ['secondary', 'info', 'success', 'danger'];
  feedback.classList.remove(...classes.map((name) => `text-${name}`));
  feedback.classList.add(`text-${style}`);
};

const renderFeeds = (feeds) => {
  const feedsParent = document.querySelector('.feeds');
  let ul = feedsParent.querySelector('ul');
  if (!ul) {
    ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    feedsParent.querySelector('.card').append(ul);
  }
  feeds.forEach(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = title;
    li.append(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;
    li.append(p);
    ul.append(li);
  });
};

const renderPosts = (state, i18nView) => {
  const aPostAttributes = [
    ['target', '_blank'],
    ['rel', 'noopener noreferrer'],
  ];
  const liPostClasses = [
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  ];
  const buttonPostAttributes = [

    ['type', 'button'],
    ['data-bs-toggle', 'modal'],
    ['data-bs-target', '#modal'],
  ];
  const buttonPostClasses = [
    'btn',
    'btn-outline-primary',
    'btn-sm',
  ];
  const postsParent = document.querySelector('.posts');

  let ul = postsParent.querySelector('ul');
  if (!ul) {
    ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    postsParent.querySelector('.card').append(ul);
  }
  removeChilds(ul);
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const { posts } = state;
  posts.forEach((post, index) => {
    // if (index < state.pointerToNewPosts) return;
    const { title, link } = post;

    const li = document.createElement('li');
    li.classList.add(...liPostClasses);

    const a = document.createElement('a');
    a.className = (state.uiState.viewed.length > 0) && state.uiState.viewed[index]
      ? 'fw-normal link-secondary'
      : 'fw-bold';
    setAttributes(a, ['href', link], ...aPostAttributes, ['data-id', index]);
    a.textContent = title;
    li.append(a);

    const button = document.createElement('button');
    setAttributes(button, ...buttonPostAttributes, ['data-id', index]);
    button.classList.add(...buttonPostClasses);
    button.textContent = i18nView;

    button.addEventListener('click', getViewButtonHandler(state, post));
    li.append(button);
    ul.append(li);
  });
  postsParent.querySelector('.card').append(ul);
};

export default (state, i18n) => {
  const input = document.querySelector('#url-input');
  const addButton = document.querySelector('button[type=submit]');
  return onChange(
    state,
    (path, value) => {
      console.log(`path: ${path}; value: ${value}`);
      switch (path) {
        case 'validationState':
          switch (value) {
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
              console.log(value);
              // addButton.disabled = false;
              // input.readOnly = false;
              break;
            case 'validating':
              console.log(value);
              // addButton.disabled = true;
              // input.readOnly = true;
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
              // addButton.disabled = false;
              // input.readOnly = false;
              break;
            case 'failed':
              renderFeedback(state.uiState.feedback, i18n);
              // addButton.disabled = false;
              // input.readOnly = false;
              break;
            default:
              console.error('processState switch(value) default: ', value);
          }
          break;
        case 'posts':
          renderPosts(state, i18n.t('view'));
          break;
        case 'feeds':
          renderFeeds(state.feeds);
          break;
        case 'uiState.feedback.style':
          console.log('uiState.feedback.style: ', value);
          break;
        case 'uiState.feedback.key':
          console.log('uiState.feedback.key: ', value);
          break;
        default:
          console.error('switch(path) default: ', path);
      }
    },
  );
};
