import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import parse from './parser.js';
import watch from './view.js';
import ru from './locales/ru.js';
import wrap from './utils/wrapper.js'; // CORS proxy url wrapper

const checkFeedsUpdate = (state) => {
  state.feeds.forEach(({ url }) => {
    axios.get(wrap(url))
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
      test: i18next.t('exists'),
      required: i18next.t('required'),
    },
    string: {
      url: i18next.t('invalid'),
    },
  });
  const state = watch({
    processState: 'filling', // validating, sending, failure, downloaded, processed
    rssLink: '',
    validationState: 'none', // invalid, valid
    feedback: [],
    feeds: [],
    posts: [],
  });
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
            i18next.t('exists'),
            (testUrl, { parent }) => {
              const { feeds } = parent;
              return !feeds.some(({ url }) => url === testUrl);
            },
          ),
      });
      schema
        .validate(state, { strict: true, abortEarly: false })
        .then((stateObject) => {
          console.log('validate then, stateObject: ', stateObject);
          state.validationState = 'valid';
          state.feedback.push(i18next.t('sending'));
          state.processState = 'sending';
          const url = state.rssLink;
          axios.get(wrap(url))
            .then(({ data }) => {
              console.log('downloaded, parse data..');
              state.feedback.push(i18next.t('downloaded'));
              state.processState = 'downloaded';
              return parse(data);
            })
            .then((parsedData) => {
              if (!parsedData) {
                console.log('parsedData: ', parsedData);
                state.feedback.push(i18next.t('parserror'));
                throw new Error('parserror');
              }
              console.log('..parsing complete; parsedData: ', parsedData);
              const { title, description, posts } = parsedData;
              state.feeds.push({ url, title, description });
              state.displayedPost = state.posts.push(
                ...posts.map((post) => ({ ...post, viewed: false })),
              );
              state.feedback.push(i18next.t('success'));
              state.processState = 'processed';
              state.rssLink = '';
              state.validationState = 'none';
            })
            .catch((error) => {
              const { message } = error;
              state.feedback.push(i18next.t('failure'));
              state.processState = 'failure';
              console.log(`axios.get cath, error: ${error}; ${message}`);
            });
        })
        .catch((errorMessage) => {
          console.log('errorMessage: ', errorMessage);
          state.feedback.push(errorMessage);
          state.validationState = 'invalid';
          state.processState = 'filling';
        });
    });
  checkFeedsUpdate(state);
};
