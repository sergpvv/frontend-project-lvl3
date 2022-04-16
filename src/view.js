import onChange from 'on-change';

// const removeChilds = (element) => {
//  while (element.firstChild && element.removeChild(element.firstChild));
// };

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
  // feedsParent.querySelector('div.card').append(ul);
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
  if (!ul) {
    ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    postsParent.querySelector('.card').append(ul);
  }
  const { posts } = state;
  posts.forEach((post, index) => {
    if (index < state.pointerToNewPosts) return;
    const {
      title, description, link,
    } = post;

    const li = document.createElement('li');
    li.classList.add(...liPostClasses);

    const a = document.createElement('a');
    a.classList.add(aPostClass);
    setAttributes(a, ['href', link], ...aPostAttributes, ['data-id', index]);
    a.textContent = title;
    li.append(a);

    const button = document.createElement('button');
    setAttributes(button, ...buttonPostAttributes, ['data-id', index]);
    button.classList.add(...buttonPostClasses);
    button.textContent = i18nView;

    const modal = document.querySelector('#modal');
    const body = document.querySelector('body');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { target } = e;
      const aPostEl = target.previousSibling;
      const getElement = (selector) => modal.querySelector(selector);
      const modalTitle = getElement('.modal-title');
      modalTitle.textContent = title;
      const modalBody = getElement('.modal-body');
      modalBody.textContent = description;
      const modalAButton = getElement('a.btn');
      modalAButton.setAttribute('href', link);
      const modalCloseButtons = modal.querySelectorAll('button[type="button"]');
      modalCloseButtons.forEach((modalCloseButton) => {
        modalCloseButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          modal.setAttribute('aria-hidden', 'true');
          modal.style.display = 'none';
          modal.className = 'modal fade';
          body.classList.remove('modal-open');
          body.removeAttribute('data-bs-overflow');
          body.removeAttribute('data-bs-padding-right');
          body.removeAttribute('style');
        });
      });
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      body.classList.add('modal-open');
      body.setAttribute('data-bs-overflow', 'hidden');
      body.setAttribute('data-bs-padding-right', '0px');
      body.style = 'overflow: hidden; padding-right: 0px;';
      modal.style.display = 'block';
      modal.className = 'modal fade show';
      // const id = target.getAttribute('data-id');
      // state.posts[id].viewed = true;
      aPostEl.classList.remove(aPostClass);
      aPostEl.classList.add(...aPostViewedClasses);
    });
    li.append(button);
    ul.append(li);
  });
};

export default (state, i18n) => {
  const input = document.querySelector('#url-input');
  const addButton = document.querySelector('button[type=submit]');
  return onChange(
    state,
    (path, value) => {
      console.log(`path: ${path}; value: ${value}`);
      switch (path) {
        case 'uiState.formFilling':
          addButton.disabled = !value;
          input.readOnly = !value;
          if (value) input.value = '';
          break;
        case 'uiState.state.uiState.feedback':
          renderFeedback(value, i18n);
          break;
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
              break;
            case null:
              input.classList.remove('is-valid', 'is-invalid');
              input.value = '';
              break;
            default:
              console.error('validationState switch(value) default: ', value);
          }
          break;
        case 'posts':
          renderPosts(state, i18n.t('view'));
          break;
        case 'feeds':
          renderFeeds(state.feeds);
          break;
        default:
          console.error('switch(path) default: ', path);
      }
    },
  );
};
