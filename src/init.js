import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import parse from './parser.js';
import watch from './view.js';
import ru from './locales/ru.js';
import proxify from './proxifier.js';

const checkFeedsUpdate = (state) => {
  state.feeds.forEach(({ url }) => {
    axios.get(proxify(url))
      .then(({ data }) => {
        const { posts } = parse(data);
        posts.forEach((post) => {
          if (!state.posts.some(({ title }) => title === post.title)) {
            state.posts.push({ ...post, viewed: false });
          }
        });
      })
      .catch((error) => {
        console.log('checkFeedsUpdate axios.get catch error:', error);
      });
  });
  setTimeout(checkFeedsUpdate, 5000, state);
};

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });
  yup.setLocale({
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
    rssLink: null,
    validationState: null, // required, valid, invalid
    feeds: [],
    posts: [],
  }, i18next);
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
  document.querySelector('form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      state.rssLink = e.target.querySelector('#url-input').value;
      state.processState = 'validating';
      const schema = yup.object().shape({
        rssLink: yup.string()
          .required()
          .url()
          .test(
            'isNewUrl',
            'exists',
            (testUrl, { parent }) => {
              const { feeds } = parent;
              return !feeds.some(({ url }) => url === testUrl);
            },
          ),
      });
      schema
        .validate(state, { strict: true, abortEarly: false })
        .then((/* stateObject */) => {
          // console.log('schema validate then, stateObject: ', stateObject);
          state.validationState = 'valid';
          state.processState = 'sending';
          const url = state.rssLink;
          axios.get(proxify(url))
            .then(({ data }) => {
              // console.log('downloaded, parse data: ', data);
              state.processState = 'downloaded';
              return parse(data);
            })
            .then((parsedData) => {
              if (!parsedData) {
                // console.log('parsedData: ', parsedData);
                state.processState = 'parserror';
                throw new Error('parserror');
              }
              // console.log('..parsing complete; parsedData: ', parsedData);
              const { title, description, posts } = parsedData;
              state.feeds.push({ url, title, description });
              state.posts = [
                ...state.posts,
                ...posts.map((post) => ({ ...post, viewed: false })),
              ];
              state.rssLink = '';
              state.processState = 'success';
              state.validationState = null;
            })
            .catch(({ message }) => {
              if (message === 'parserror') {
                state.processState = 'parserror';
                return;
              }
              state.processState = 'failure';
              console.log(`axios.get cath: ${message}`);
            });
        })
        .catch((error) => {
          console.log('schema validate catch: ', error);
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
            default:
              console.log('schema validate catch, switch(errorMessage) default: ', errorMessage);
          }
        });
    });
  checkFeedsUpdate(state);
};
