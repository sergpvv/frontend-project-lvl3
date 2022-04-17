import axios from 'axios';
import i18next from 'i18next';
import { setLocale } from 'yup';
import parse from './parser.js';
import watch from './view.js';
import ru from './locales/ru.js';
import proxify from './proxifier.js';
import validate from './validator.js';
import handleProcessState from './handlers.js';

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
  )))
    .then(() => setTimeout(checkFeedsUpdate, 5000, state))
    .catch((error) => {
      console.error('checkFeedsUpdate catch error: ', error);
    });
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
  const watchedState = watch(
    {
      processState: null,
      /* filling =>
       * validating (=> failed => filling) =>
       * sending (loading => failed => filling) =>
       * downloaded (parsing received data => failed => filling) =>
       * processed (posts added) => filling
      */
      validationState: null, // valid invalid exists required
      error: '', // required, invalid, exists, parserror, network error

      uiState: {
        modalVisibility: 'hidden', // shown
        modalContainsPost: null, // index of post
        formDisabled: false,
        feedback: {
          style: null, // danger success info secondary
          key: null, // required valid invalid exists parserror failure (network error) unknown
        },
        viewed: [], // [0: true, 1: false, ...]
      },

      feeds: [],
      posts: [],
    },
    i18next,
  );

  const getFormHandler = (state) => (e) => {
    e.preventDefault();
    handleProcessState(state, 'validating');
    const rssUrl = e.target.querySelector('#url-input').value;
    validate(rssUrl, state.feeds)
      .then((validUrl) => {
        // console.log('Valid url: ', validUrl);
        handleProcessState(state, 'sending');
        return axios.get(proxify(validUrl));
      })
      .then(({ data }) => {
        // console.log('downloaded, parse data: ', data);
        handleProcessState(state, 'downloaded');
        return parse(data);
      })
      .then((parsedData) => {
        // console.log('..parsing complete; parsedData: ', parsedData);
        const { title, description, posts } = parsedData;
        state.feeds.push({ url: rssUrl, title, description });
        // state.pointerToNewPosts = state.posts.length;
        state.posts.push(...posts);
        handleProcessState(state, 'processed');
      })
      .catch(({ message }) => {
        state.error = message;
        handleProcessState(state, 'failed');
        console.error('catch error: ', message);
      });
  };
  document.querySelector('form').addEventListener('submit', getFormHandler(watchedState));
  checkFeedsUpdate(watchedState);
};
