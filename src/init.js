import * as yup from 'yup';
import axios from 'axios';
import watch from './view';

const corsProxy = 'https://cors-anywhere.herokuapp.com/';

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
  const state = {
    form: {
      processState: 'filling',
      inputUrl: '',
      validationState: 'invalid',
      errors: [],
    },
    feeds: [],
  };
  const schema = yup.object().shape({
    inputUrl: yup.string().url().required(),
  });
  const isValid = (value) => value === 'valid';
  document.querySelector('input')
    .addEventListener('input', ({ target }) => {
      state.form.processState = 'filling';
      state.form.inputUrl = target.value;
      schema
        .isValid(state.form, { strict: true, abortEarly: false })
        .then((valid) => {
          if (valid) {
            state.form.validationState = state.feeds.some(({ url }) => url === state.form.inputUrl)
              ? 'already added'
              : 'valid';
          } else {
            state.form.validationState = 'invalid';
          }
          console.log(state.form.validationState);
          if (isValid(state.form.validationState)) {
            state.form.errors = [];
          }
          return schema.validate(state.form, { strict: true, abortEarly: false });
        })
        .catch(({ errors }) => {
          if (errors.length > 0) {
            state.form.errors = [...errors];
          }
        });
    });
  document.querySelector('form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      state.form.processState = 'sending';
      state.form.errors = ['Sending request'];
      const url = state.form.inputUrl;
      axios.get([corsProxy, url].join(''))
        .then(({ data }) => {
          console.log('downloaded');
          state.form.inputUrl = '';
          return parse(data);
        })
        .then((rssFeed) => {
          console.log('parsed');
          state.feeds.push({
            id: state.feeds.length,
            url,
            ...rssFeed,
          });
          state.form.processState = 'downloaded';
        })
        .catch((error) => {
          const { message } = error;
          state.form.processState = 'failed';
          state.form.errors.push(message || error);
        });
    });
  watch(state);
};
