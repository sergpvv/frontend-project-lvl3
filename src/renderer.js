import { getViewButtonHandler } from './handlers/buttons.js';
// import renderModal from './renderers/modal.js';

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const setAttributes = (element, ...attributes) => {
  attributes.forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
};

export const renderFeedback = (value, i18n) => {
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
  // console.log(feedback.outerHTML);
};

export const renderFeeds = (feeds, i18nFeeds) => {
  const feedsParent = document.querySelector('.feeds');
  feedsParent.querySelector('.card-title').textContent = i18nFeeds;
  const ul = feedsParent.querySelector('ul');
  if (ul.hasChildNodes()) removeChilds(ul);
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
  // console.log(feedsParent.outerHTML);
};

export const renderPosts = (state, i18nPosts, i18nView) => {
  const aAttributes = [
    ['target', '_blank'],
    ['rel', 'noopener noreferrer'],
  ];
  const liClasses = [
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  ];
  const buttonAttributes = [
    ['type', 'button'],
    ['role', 'button'],
    ['data-bs-toggle', 'modal'],
    ['data-bs-target', '#modal'],
  ];
  const buttonClasses = [
    'btn',
    'btn-outline-success',
    'btn-sm',
  ];
  const postsParent = document.querySelector('.posts');
  postsParent.querySelector('.card-title').textContent = i18nPosts;
  const ul = postsParent.querySelector('ul');
  if (ul.hasChildNodes()) removeChilds(ul);
  // const { posts } = state;
  // const { length } = posts;
  // let i = state.posts.length - 1;
  // while (i >= 0) {
  // const post = state.posts[i];
  state.posts.forEach((post, i) => {
    const { title, link } = post;
    const li = document.createElement('li');
    li.classList.add(...liClasses);
    const a = document.createElement('a');
    a.className = (state.uiState.viewed.length > 0) && state.uiState.viewed[i]
      ? 'fw-normal link-secondary'
      : 'fw-bold';
    setAttributes(a, ['href', link], ...aAttributes, ['data-id', i]);
    a.textContent = title;
    li.append(a);
    const button = document.createElement('button');
    setAttributes(button, ...buttonAttributes, ['data-id', i]);
    button.classList.add(...buttonClasses);
    button.textContent = i18nView;
    button.addEventListener('click', getViewButtonHandler(state));
    li.append(button);
    ul.append(li);
    // i -= 1;
  });
  // console.log(postsParent.outerHTML);
};
/*
export const markViewedPost = (id) => {
  const postElement = document.querySelector(`.posts a[data-id="${id}"]`);
  postElement.className = 'fw-normal link-secondary';
};
*/
export const renderBorder = (key) => {
  const input = document.querySelector('#url-input');
  input.classList.add('is-valid', 'is-invalid');
  switch (key) {
    case 'none':
      input.classList.remove('is-valid', 'is-invalid');
      break;
    case 'valid':
      input.classList.remove('is-invalid');
      break;
    case 'invalid':
      input.classList.remove('is-valid');
      break;
    default:
      console.error(`renderBorder unknown key: ${key}`);
  }
};
