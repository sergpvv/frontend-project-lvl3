import { removeChilds } from './helpers.js';

export default (feeds, i18nFeeds) => {
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
};
