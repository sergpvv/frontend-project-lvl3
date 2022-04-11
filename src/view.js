/* eslint no-param-reassign: ["error", { "props": false }] */

import onChange from 'on-change';

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const setAttributes = (element, ...attributes) => {
  attributes.forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
};

const renderFeedback = (state) => {
  const feedback = document.querySelector('.feedback');
  feedback.textContent = '';
  const { processState } = state;
  // console.log(`renderFeedback processState: ${processState}; feedback: ${state.feedback}`);
  if (state.feedback.length > 0) {
    const alerts = {
      sending: 'secondary',
      downloaded: 'info',
      processed: 'success',
    };
    const classes = ['secondary', 'info', 'success', 'danger'];
    const type = alerts[processState] || 'danger';
    feedback.classList.remove(...classes.map((name) => `text-${name}`));
    feedback.classList.add(`text-${type}`);
    feedback.textContent = state.feedback.pop();
  }
};

const renderFeeds = (feeds) => {
  const feedsParent = document.querySelector('.feeds');
  let ul = feedsParent.querySelector('ul');
  if (!ul) {
    ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
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
  feedsParent.querySelector('div.card').append(ul);
};

const renderPosts = (state) => {
  const aPostAttributes = [
    ['target', '_blank'],
    ['rel', 'noopener noreferrer'],
  ];
  const aPostClass = 'fw-bold';
  const aPostViewedClasses = [
    'fw-normal',
    'link-secondary',
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
  if (ul) {
    removeChilds(ul);
  } else {
    ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
  }
  const { posts } = state;
  posts.forEach((post, index) => {
    const { title, link, viewed } = post;
    const li = document.createElement('li');
    li.classList.add(...liPostClasses);
    const a = document.createElement('a');
    if (viewed) {
      a.classList.add(...aPostViewedClasses);
    } else {
      a.classList.add(aPostClass);
    }
    setAttributes(a, ['href', link], ...aPostAttributes, ['data-id', index]);
    a.textContent = title;
    li.append(a);
    const button = document.createElement('button');
    setAttributes(button, ...buttonPostAttributes, ['data-id', index]);
    button.addEventListener('click', () => {
      posts[index].viewed = true;
      a.classList.remove(aPostClass);
      a.classList.add(...aPostViewedClasses);
    });
    button.classList.add(...buttonPostClasses);
    button.textContent = 'Просмотр';
    li.append(button);
    ul.append(li);
  });
  postsParent.querySelector('.card').append(ul);
};

export default (state) => {
  const input = document.querySelector('#url-input');
  const addButton = document.querySelector('button[type=submit]');
  return onChange(
    state,
    (path, value) => {
      console.log(`path: ${path}; value: ${value}`);
      switch (path) {
        case 'validationState':
          switch (value) {
            case 'valid':
              input.classList.remove('is-invalid');
              input.classList.add('is-valid');
              break;
            case 'invalid':
              addButton.disabled = false;
              input.classList.remove('is-valid');
              input.classList.add('is-invalid');
              break;
            case 'none':
              input.classList.remove('is-valid');
              input.classList.remove('is-invalid');
              break;
            default:
              console.log('validationState switch(value) default: ', value);
          }
          break;
        case 'processState':
          renderFeedback(state);
          switch (value) {
            case 'filling':
              addButton.disabled = false;
              break;
            case 'failure':
              addButton.disabled = false;
              state.processState = 'filling';
              break;
            case 'validating':
              addButton.disabled = true;
              break;
            case 'sending':
              addButton.disabled = true;
              break;
            case 'downloaded':
              addButton.disabled = true;
              break;
            case 'processed':
              addButton.disabled = false;
              state.processState = 'filling';
              break;
            default:
              console.log('processState switch(value) default: ', value);
          }
          break;
        case 'posts':
          renderPosts(state);
          break;
        case 'feeds':
          renderFeeds(state.feeds);
          break;
        default:
          console.log('switch(path) default: ', path);
      }
    },
  );
};
