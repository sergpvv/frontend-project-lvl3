/* eslint no-param-reassign: ["error", { "props": false }] */

import onChange from 'on-change';

// const form = document.querySelector('form');
const input = document.getElementById('url-input');
const addButton = document.querySelector('button[type=submit]');
const feedback = document.querySelector('p.feedback');
const postsDiv = document.querySelector('div.posts');
const feedsDiv = document.querySelector('div.feeds');

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const renderFeedback = (state) => {
  feedback.textContent = '';
  const { processState } = state;
  console.log(`renderFeedback processState: ${processState}; feedback: ${state.feedback}`);
  if (state.feedback.length > 0) {
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
            renderFeedback(state);
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
            renderRssItems(state);
            renderRssLinks(state);
            addButton.disabled = false;
            state.processState = 'filling';
            break;
          default:
            console.log('processState switch(value) default: ', value);
        }
        break;
        /*
        case 'displayedRssItem':
          renderRssLinks(state);
        break; */
      default:
        console.log('switch(path) default: ', path);
    }
  },
);
