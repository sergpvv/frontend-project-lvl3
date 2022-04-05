import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import watch from './view';
import en from './locales/en';

const corsProxy = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

const parse = (str) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(str, 'text/xml');
  const title = dom.querySelector('title').textContent;
  const description = dom.querySelector('description').textContent;
  const articles = [...dom.querySelectorAll('item')]
    .map((element) => ({
      title: element.querySelector('title').textContent,
      link: element.querySelector('link').textContent,
    }));
  return { title, description, articles };
};

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  });
  const state = {
    processState: 'filling',
    inputUrl: '',
    validationState: 'invalid',
    errors: [],
    rssItems: [],
    displayedRssItem: -1,
  };
  const schema = yup.object().shape({
    inputUrl: yup.string().url().required(),
  });
  const isValid = (value) => value === 'valid';
  document.querySelector('input')
    .addEventListener('input', ({ target }) => {
      state.processState = 'filling';
      state.inputUrl = target.value;
      schema
        .isValid(state, { strict: true, abortEarly: false })
        .then((valid) => {
          if (valid) {
            state.validationState = state.rssItems.some(({ url }) => url === state.inputUrl)
              ? 'exists'
              : 'valid';
          } else {
            state.form.validationState = 'invalid';
          }
          console.log(state.validationState);
          if (isValid(state.validationState)) {
            state.errors = [];
            return { errors: [] };
          }
          return schema.validate(state, { strict: true, abortEarly: false });
        })
        .then((valid) => {
          console.log(JSON.stringify(valid, null, '  '));
        })
        .catch(({ errors }) => {
          if (errors && errors.length > 0) {
            state.errors = [...errors];
            state.validationState = 'invalid';
          }
        });
    });
  document.querySelector('form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isValid(state.validationState)) {
        state.errors.push('Please, input correct url!');
        state.inputUrl = '';
        return;
      }
      state.processState = 'sending';
      state.errors.push('Sending request');
      const url = state.inputUrl;
      axios.get([corsProxy, url].join(''))
        .then(({ data }) => {
          console.log('downloaded');
          return parse(data);
        })
        .then((parsedRssFeed) => {
          console.log('parsed');
          const id = state.rssItems.length;
          state.rssItems.push({ id, url, ...parsedRssFeed });
          state.inputUrl = '';
          state.processState = 'downloaded';
          state.validationState = 'invalid';
          state.displayedRssItem = id;
        })
        .catch((error) => {
          const { message } = error;
          state.processState = 'failed';
          state.errors.push(message || error);
        });
    });
  watch(state);
};
