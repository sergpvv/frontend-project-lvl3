import * as yup from 'yup';
import axios from 'axios';
import watch, { render } from './view';

const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const formSelector = 'form';
const inputSelector = 'input';

const parse = (str) => {
  const parser = new DOMParser();
  return parser.parseFromString(str, 'text/xml')
    .then((data) => {
      const title = data.querySelector('title').textContent;
      const articles = [];
      data.querySelectorAll('item').forEach((element) => {
        articles.push(
          `<article>
          <img src="${element.querySelector('link').innerHTML}/image/large.png" alt="">
          <h2>
            <a href="${element.querySelector('link').innerHTML}" target="_blank" rel="noopener">
              ${element.querySelector('title').innerHTML}
            </a>
          </h2>
        </article>
      `,
        );
      });
      return { title, articles };
    });
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
  document.querySelector(inputSelector)
    .addEventListener('input', ({ target }) => {
      state.form.processState = 'filling';
      state.form.inputUrl = target.value;
      schema
        .isValid(state.form, { strict: true, abortEarly: false })
        .then((valid) => {
          if (valid) {
            state.form.validatonState = state.feeds.some(({ url }) => url === state.form.inputUrl)
              ? 'already added'
              : 'valid';
          } else {
            state.form.validatonState = 'invalid';
          }
          console.log(state.form.validatonState);
          if (isValid(state.form.validatonState)) {
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
  document.querySelector(formSelector)
    .addEventListener('submit', (e) => {
      e.preventDefault();
      state.form.processState = 'sending';
      const url = state.form.inputUrl;
      axios.get([corsProxy, url].join(''))
        .then(({ data }) => {
          console.log('downloaded');
          return parse(data);
        })
        .then((feed) => {
          console.log('parsed');
          state.feeds.push({
            id: state.feeds.length,
            url,
            ...feed,
          });
          state.form.processState = 'downloaded';
        })
        .catch((error) => {
          state.form.processState = 'failed';
          state.form.errors.push(error.message);
        });
    });
  render(state);
  watch(state);
};
