import { removeChilds, setAttributes } from './helpers.js';
import { getViewButtonHandler } from '../handlers/buttons.js';

export default (state, i18nPosts, i18nView) => {
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
};
