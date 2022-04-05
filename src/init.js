import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import watch from './view';
import en from './locales/en';
import wrapUrl from './utils/wrapper'; // CORS proxy url wrapper

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

const getInputUrl = (form) => {
  const input = form.querySelector('input');
  // console.log('input.value: ', input.value);
  return input.value;
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
  watch(state);
  const schema = yup.object().shape({
    inputUrl: yup.string().url().required(),
  });
  const isInvalid = (value) => value === 'invalid';
  /*  document.querySelector('input')
    .addEventListener('input', ({ target }) => {
      // state.processState = 'filling';
      state.inputUrl = target.value;
    }); */
  document.querySelector('form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.inputUrl = getInputUrl(e.target);
      state.processState = 'validating';
      // validate input url
      schema
        .isValid(state, { strict: true, abortEarly: false })
        .then((valid) => {
          if (valid) {
            if (state.rssItems.some(({ url }) => url === state.inputUrl)) {
              state.ValidationState = 'exists';
              throw Error('Already exists');
            } else {
              state.ValidationState = 'valid';
            }
          } else {
            state.validationState = 'invalid';
          }
        })
      /* console.log(state.validationState);
          if (isValid(state.validationState)) {
            state.errors = [];
            return { errors: [] };
          }
          return schema.validate(state, { strict: true, abortEarly: false });
        })
        .then((valid) => {
          // console.log(JSON.stringify(valid, null, '  '));
          console.log('valid: ', valid);
        }) */
        .catch(({ errors }) => {
          if (errors && errors.length > 0) {
            state.errors = [...errors];
            state.validationState = 'invalid';
            state.processState = 'filling';
          }
        });
      if (isInvalid(state.validationState)) {
        state.errors.push('Please, input correct url!');
        state.processState = 'filling';
        //        state.inputUrl = '';
        return;
      }
      state.processState = 'sending';
      const url = state.inputUrl;
      axios.get(wrapUrl(url))
        .then(({ data }) => {
          console.log('downloaded, parse data..');
          return parse(data);
        })
        .then((parsedRssFeed) => {
          console.log('..parsing complete; parsedRssFed: ', parsedRssFeed);
          const id = state.rssItems.length;
          state.rssItems.push({ id, url, ...parsedRssFeed });
          state.displayedRssItem = id;
          state.processState = 'downloaded';
          state.inputUrl = '';
          state.validationState = 'invalid';
        })
        .catch((error) => {
          const { message } = error;
          state.errors.push(message || error);
          state.processState = 'filling';
        });
    });
};
