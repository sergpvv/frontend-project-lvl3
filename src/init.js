import axios from 'axios';
import i18next from 'i18next';
import { setLocale } from 'yup';
import parse from './parser.js';
import watch from './view.js';
import ru from './locales/ru.js';
import proxify from './proxifier.js';
import validate from './validator.js';

const processPosts = (posts, state) => {
  posts.forEach((post) => {
    if (!state.posts.some(({ title }) => title === post.title)) {
      state.posts.push(post);
    }
  });
};

const checkFeedsUpdate = (state) => {
  Promise.all(state.feeds.map(({ url }) => (
    axios.get(proxify(url))
      .then(({ data }) => parse(data))
      .then(({ posts }) => processPosts(posts, state))
      .catch((error) => {
        console.log('checkFeedsUpdate axios.get catch error: ', error);
      })
  )))
    .then(() => setTimeout(checkFeedsUpdate, 5000, state));
};

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });
  setLocale({
    mixed: {
      test: 'exists',
      required: 'required',
    },
    string: {
      url: 'invalid',
    },
  });
  const state = watch({
    processState: null, // validating, sending, failure, downloaded, success
    validationState: null, // required, valid, invalid
    feeds: [],
    posts: [],
    pointerToNewPosts: null,
  }, i18next);
  /*
  const modal = document.querySelector('#modal');
  const getElement = (selector) => modal.querySelector(selector);
  modal.addEventListener('shown.bs.modal', (event) => {
    const buttonView = event.relatedTarget;
    const id = buttonView.getAttribute('data-id');
    const { title, description, link } = state.posts[id];
    const modalTitle = getElement('.modal-title');
    modalTitle.textContent = title;
    const modalBody = getElement('.modal-body');
    modalBody.textContent = description;
    const modalAButton = getElement('a.btn');
    modalAButton.setAttribute('href', link);
  });
*/
  /*
 *  const getFormHandler = (state) => (event) => {
 *    event.preventDefault();
 *    state.processState = 'validating';
 *    const rssUrl = event.target.querySelector('#url-input').value;
 *    validate(rssUrl)
 *      .then((validUrl) => getHtml(validUrl))
 *      .then((recaivedHtml) => parse(recaivedHtml))
 *      .then((parsedData) => processPosts(parsedData, state))
 *      .cath((error) => processError(error, state));
 *    })
 *   };
 *  inputForm.addListener(getFormHandler(watchedState));
 *
 *  const checkFeedsUpdate = (state) => {
 *    Promise.all(state.feeds.map((feed) => (
 *      getHtml(feed.link)
 *        .then((recaivedHtml) => parse(recaivedHtml))
 *        .then((parsedData) => processPosts(parsedData, state))
 *        .cath((error) => processError(error, state));
 *    )))
 *    .then((error) => {
 *      console.log('updating error: ', error);
 *      setTimeout(checkFeedsUpdate, 5000, state);
 *    });
 *  });
 *
 *  checkFeedsUpdate(watchedState);
 */
  document.querySelector('form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      state.processState = 'validating';
      const rssUrl = e.target.querySelector('#url-input').value;
      validate(rssUrl, state.feeds)
        .then((validUrl) => {
          state.validationState = 'valid';
          state.processState = 'sending';
          return axios.get(proxify(validUrl));
        })
        .then(({ data }) => {
          console.log('downloaded, parse data: ', data);
          state.processState = 'downloaded';
          return parse(data);
        })
        .then((parsedData) => {
          console.log('..parsing complete; parsedData: ', parsedData);
          const { title, description, posts } = parsedData;
          state.feeds.push({ url: rssUrl, title, description });
          state.pointerToNewPosts = state.posts.length;
          state.posts = [
            ...state.posts,
            ...posts,
          ];
          state.processState = 'success';
          state.validationState = null;
        })
        .catch((error) => {
          // console.error('catch: ', error);
          let errorMessage = 'unknown';
          switch (typeof error) {
            case 'object':
              errorMessage = error.message;
              break;
            case 'string':
              errorMessage = error.split(' ', 2).pop();
              break;
            default:
              console.log('switch typeof(error) default: ', typeof error);
          }
          switch (errorMessage) {
            case 'exists':
              state.validationState = 'exists';
              break;
            case 'invalid':
              state.validationState = 'invalid';
              break;
            case 'required':
              state.validationState = 'required';
              break;
            case 'parserror':
              state.processState = 'parserror';
              break;
            case 'Network Error':
              state.processState = 'failure';
              break;
            default:
              console.log('schema validate catch, switch(errorMessage) default: ', errorMessage);
          }
        });
    });
  checkFeedsUpdate(state);
};
