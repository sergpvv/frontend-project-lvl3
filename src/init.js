import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import parse from './parser';
import watch from './view';
import en from './locales/en';
import wrap from './utils/wrapper'; // CORS proxy url wrapper

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  });
  const state = watch({
    processState: 'filling', // validating, sending, failure, downloaded, processed
    rssLink: '',
    validationState: 'none', // invalid, valid
    feedback: [],
    feeds: [],
    posts: [],
    displayedPost: -1,
  });
  document.querySelector('form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      state.rssLink = e.target.querySelector('#url-input').value;
      state.processState = 'validating';
      const schema = yup.object().shape({
        rssLink: yup.string()
          .url(i18next.t('invalid'))
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
              state.displayedPost = state.posts.push(...posts);
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
};
