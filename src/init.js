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
  const { value } = form.querySelector('input');
  // console.log('form.input.value: ', value);
  return value;
};

export default () => {
/*
  const testSchema = yup.object().shape({
    url: yup.string().url('incorrect')
      .test(
        'isNew',
        'url already exists',
        (testUrl, context) => {
          // const stringifyContext = JSON.stringify(context, null, '  ');
          // console.log(`testUrl: ${testUrl}; context: ${stringifyContext}`);
          const { items } = context.parent;
          console.log(`testUrl: ${testUrl}; items: ${items}`);
          return !items.includes(testUrl);
        },
      ),
  });
  const testState = {
    foo: 'bar',
    url: 'http://foo.bar/baz',
    items: ['lorem', 'http://foo.bar/baz'],
  };
  testSchema
    .validate(testState, { strict: true, abortEarly: false })
    .then((value) => {
      console.log('testShema.validate.then, value:', value);
    })
    .catch((value) => {
      console.log('testSchema.validate.cath, value: ', value);
    });
*/
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  });
  const state = watch({
    processState: 'filling', // validating, sending, failure, downloaded, processed
    inputUrl: '',
    validationState: 'none', // invalid, valid
    errors: [],
    rssItems: [],
    displayedRssItem: -1,
  });
  // console.log(`watched state: ${JSON.stringify(state, null, '  ')}`);
  document.querySelector('form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      // e.stopPropagation();
      state.inputUrl = getInputUrl(e.target);
      state.processState = 'validating';
      const schema = yup.object().shape({
        inputUrl: yup.string()
          .url(i18next.t('invalid'))
          .test(
            'isNewUrl',
            i18next.t('exists'),
            (testUrl, { parent }) => {
              const { rssItems } = parent;
              return !rssItems.some(({ url }) => url === testUrl);
            },
          ),
      });
      schema
        .validate(state, { strict: true, abortEarly: false })
        .then((stateObject) => {
          console.log('validate then, stateObject: ', stateObject);
          state.validationState = 'valid';
          state.errors.push(i18next.t('sending'));
          state.processState = 'sending';
          const url = state.inputUrl;
          axios.get(wrapUrl(url))
            .then(({ data }) => {
              console.log('downloaded, parse data..');
              state.errors.push(i18next.t('downloaded'));
              state.processState = 'downloaded';
              return parse(data);
            })
            .then((parsedRssFeed) => {
              console.log('..parsing complete; parsedRssFed: ', parsedRssFeed);
              const id = state.rssItems.length;
              state.rssItems.push({ id, url, ...parsedRssFeed });
              state.displayedRssItem = id;
              state.errors.push(i18next.t('success'));
              state.processState = 'processed';
              state.inputUrl = '';
              state.validationState = 'none';
            })
            .catch((error) => {
              const { message } = error;
              // state.errors.push(message || error);
              state.errors.push(i18next.t('failure'));
              state.processState = 'failure';
              console.log(`axios.get, cath, error message: ${message}; state.errors: ${state.errors}`);
            });
        })
        .catch((errorMessage) => {
          console.log('errorMessage: ', errorMessage);
          state.errors.push(errorMessage);
          state.validationState = 'invalid';
          state.processState = 'filling';
        });
    });
};
