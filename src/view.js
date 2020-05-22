import { watch } from 'melanke-watchjs';

const input = document.querySelector('input');
const addButton = document.querySelector('button');
const feedback = document.querySelector('.feedback');
const rssItems = document.querySelector('.rss-items');
const rssLinks = document.querySelector('.rss-links');

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const renderFeedback = (state) => {
  removeChilds(feedback);
  if (state.form.errors.length > 0) {
    state.form.errors.forEach((error) => {
      const div = document.createElement('div');
      div.classList.add('alert', 'alert-danger');
      div.textContent = error;
      feedback.appendChild(div);
    });
  }
};

const renderRssItems = (state) => {
  removeChilds(rssItems);
  removeChilds(rssLinks);
  state.feeds.forEach(({ title, description, articles }) => {
    const divItem = document.createElement('div');
    divItem.textContent = [title, description].join(': ');
    rssItems.append(divItem);
    articles.forEach(({ title: article, link }) => {
      const divLink = document.createElement('div');
      const a = document.createElement('a');
      a.setAttribute('href', link);
      a.textContent = article;
      divLink.append(a);
      rssLinks.append(divLink);
    });
  });
};

export default (state) => {
  watch(state.form, ['validationState', 'inputUrl', 'processState'], () => {
    const { validationState, inputUrl, processState } = state.form;
    switch (validationState) {
      case 'valid':
        addButton.disabled = false;
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        break;
      default:
        addButton.disabled = true;
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        break;
    }
    switch (inputUrl) {
      case '':
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
        break;
      default:
    }
    switch (processState) {
      case 'filling':
        renderFeedback(state);
        break;
      case 'sending':
        addButton.disabled = true;
        break;
      case 'failed':
        renderFeedback(state);
        break;
      case 'downloaded':
        renderRssItems(state);
        break;
      default:
        throw new Error(`processState: ${processState}`);
    }
  });
};
