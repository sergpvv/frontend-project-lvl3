import onChange from 'on-change';

const input = document.querySelector('input');
const addButton = document.querySelector('button');
const feedback = document.querySelector('.feedback');
const rssItemsParent = document.querySelector('.rss-items');
const rssLinksParent = document.querySelector('.rss-links');

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const renderFeedback = (state) => {
  removeChilds(feedback);
  if (state.errors.length > 0) {
    state.errors.forEach((error) => {
      const div = document.createElement('div');
      div.classList.add('alert', 'alert-danger');
      div.textContent = error;
      feedback.appendChild(div);
    });
  }
};

const getArticles = (rssItems, rssItemId) => {
  const { articles } = rssItems.find(({ id }) => id === rssItemId);
  return articles || [];
};

const renderArticles = (articles) => {
  removeChilds(rssLinksParent);
  if (articles.length > 0) {
    articles.forEach(({ title: article, link }) => {
      const div = document.createElement('div');
      const a = document.createElement('a');
      a.setAttribute('href', link);
      a.textContent = article;
      div.append(a);
      rssLinksParent.append(div);
    });
  }
};

const renderRssLinks = ({ rssItems, displayedRssItem }) => {
  const articles = getArticles(rssItems, displayedRssItem);
  renderArticles(articles);
};

const renderRssItems = (state) => {
  removeChilds(rssItemsParent);
  state.rssItems.forEach(({
    id, title, description, articles,
  }) => {
    const div = document.createElement('div');
    div.setAttribute('rss-item-id', id);
    div.textContent = [title, description].join(': ');
    div.addEventListener('click', () => {
      renderArticles(articles);
    });
    rssItemsParent.append(div);
  });
  renderRssLinks(state);
};

export default (state) => {
  const watchedObject = onChange(state, (path, value) => {
    switch (path) {
      case 'validationState':
        if (value === 'valid') {
          addButton.disabled = false;
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          addButton.disabled = true;
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');
        }
        break;
      case 'inputUrl':
        if (value === '') {
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid');
        }
        break;
      case 'processState':
        switch (value) {
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
            renderRssLinks(state);
            break;
          default:
            throw new Error(`processState: ${value}`);
        }
        break;
      case 'displayedRssItem':
        renderRssLinks(state);
        break;
      default:
    }
  });
  return watchedObject;
  /*
  watch(state, ['validationState', 'inputUrl', 'processState'], () => {
    const { validationState, inputUrl, processState } = state;
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
        // renderRssLinks(state);
        break;
      default:
        throw new Error(`processState: ${processState}`);
    }
  });
  watch(state.displayedRssItem, () => {
    renderRssLinks(state);
  });
  */
};
