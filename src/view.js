import onChange from 'on-change';
import * as bs from 'bootstrap';

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const setAttributes = (element, ...attributes) => {
  attributes.forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
};

const renderFeedback = (message, type) => {
  const feedback = document.querySelector('.feedback');
  feedback.textContent = message;
  const classes = ['secondary', 'info', 'success', 'danger'];
  feedback.classList.remove(...classes.map((name) => `text-${name}`));
  if (message !== '') {
    feedback.classList.add(`text-${type}`);
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

const renderPosts = (state, i18nView) => {
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
    const {
      title, description, link, viewed,
    } = post;

    const li = document.createElement('li');
    li.classList.add(...liPostClasses);

    const a = document.createElement('a');
    if (viewed) {
      // a.classList.remove(aPostClass);
      a.classList.add(...aPostViewedClasses);
    } else {
      a.classList.add(aPostClass);
    }
    setAttributes(a, ['href', link], ...aPostAttributes, ['data-id', index]);
    a.textContent = title;
    li.append(a);

    const button = document.createElement('button');
    setAttributes(button, ...buttonPostAttributes, ['data-id', index]);
    button.classList.add(...buttonPostClasses);
    button.textContent = i18nView;

    const modalNode = document.querySelector('#modal');
    const modalBootstarpEl = new bs.Modal(
      modalNode,
      {
        backdrop: true,
        keyboard: true,
        focus: true,
      },
    );
    button.addEventListener('click', ({ target }) => {
      //e.preventDefault();
      //e.stopPropagation();
      const aPostEl = target.previousSibling;
      const getElement = (selector) => modalNode.querySelector(selector);
      const modalTitle = getElement('.modal-title');
      modalTitle.textContent = title;
      const modalBody = getElement('.modal-body');
      modalBody.textContent = description;
      const modalAButton = getElement('a.btn');
      modalAButton.setAttribute('href', link);
      const modalCloseButtons = modalNode.querySelectorAll('button[type="button"]');
      modalCloseButtons.forEach((modalCloseButton) => {
        modalCloseButton.addEventListener('click', (event) => {
          //event.preventDefault();
          //event.stopPropagation();
          modalBootstarpEl.hide();
        });
      });
      modalBootstarpEl.show();
      const id = target.getAttribute('data-id');
      state.posts[id].viewed = true;
      aPostEl.classList.remove(aPostClass);
      aPostEl.classList.add(...aPostViewedClasses);
    });
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
            case 'valid':
              renderFeedback('');
              input.classList.remove('is-invalid');
              input.classList.add('is-valid');
              break;
            case 'invalid':
              renderFeedback(i18n.t('invalid'), 'danger');
              addButton.disabled = false;
              input.classList.remove('is-valid');
              input.classList.add('is-invalid');
              input.removeAttribute('readonly');
              break;
            case null:
              input.classList.remove('is-valid');
              input.classList.remove('is-invalid');
              break;
            case 'exists':
              renderFeedback(i18n.t('exists'), 'danger');
              input.removeAttribute('readonly');
              addButton.disabled = false;
              input.value = '';
              break;
            default:
              console.log('validationState switch(value) default: ', value);
          }
          break;
        case 'processState':
          switch (value) {
            case 'parserror':
              renderFeedback(i18n.t('parserror'), 'danger');
              input.removeAttribute('readonly');
              addButton.disabled = false;
              break;
            case 'success':
              input.value = '';
              renderFeedback(i18n.t('success'), 'success');
              input.removeAttribute('readonly');
              addButton.disabled = false;
              break;
            case 'failure':
              renderFeedback(i18n.t('failure'), 'failure');
              input.removeAttribute('readonly');
              addButton.disabled = false;
              break;
            case 'validating':
              renderFeedback(i18n.t('validating'), 'info');
              input.setAttribute('readonly', true);
              addButton.disabled = true;
              break;
            case 'sending':
              renderFeedback(i18n.t('sending'), 'info');
              input.setAttribute('readonly', true);
              addButton.disabled = true;
              break;
            case 'downloaded':
              renderFeedback(i18n.t('downloaded'), 'info');
              input.setAttribute('readonly', true);
              addButton.disabled = true;
              break;
            default:
              renderFeedback(i18n.t('unknown'), 'secondary');
              console.log('processState switch(value) default: ', value);
          }
          break;
        case 'posts':
          renderPosts(state, i18n.t('view'));
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
