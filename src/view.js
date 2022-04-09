/* eslint no-param-reassign: ["error", { "props": false }] */

import onChange from 'on-change';

const input = document.querySelector('input#url-input');
const addButton = document.querySelector('button[type=submit]');
const feedback = document.querySelector('p.feedback');
const postsParent = document.querySelector('div.posts');
const feedsParent = document.querySelector('div.feeds');

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const renderFeedback = (state) => {
  feedback.textContent = '';
  const { processState } = state;
  console.log(`renderFeedback processState: ${processState}; feedback: ${state.feedback}`);
  if (state.feedback.length > 0) {
    feedback.classList.remove('text-*');
    const alerts = {
      sending: 'secondary',
      downloaded: 'info',
      processed: 'success',
    };
    const type = alerts[processState] || 'danger';
    feedback.classList.add(`text-${type}`);
    feedback.textContent = state.feedback.pop();
  }
};

const renderFeeds = (feeds) => {
  let ul = feedsParent.querySelector('ul');
  if (ul) {
    removeChilds(ul);
  } else {
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

const renderPosts = (posts) => {
  let ul = postsParent.querySelector('ul');
  if (ul) {
    removeChilds(ul);
  } else {
    ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
  }
  posts.forEach(({ title, link }, index) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('data-id', index);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('href', link);
    a.textContent = title;
    li.append(a);
    ul.append(li);
  });
  postsParent.querySelector('div.card').append(ul);
};

export default (state) => onChange(
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
        renderPosts(state.posts);
        break;
      case 'feeds':
        renderFeeds(state.feeds);
        break;
      default:
        console.log('switch(path) default: ', path);
    }
  },
);
