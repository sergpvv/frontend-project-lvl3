import axios from 'axios';
import validate from '../utils/validator.js';
import proxify from '../utils/proxifier.js';
import parse from '../utils/parser.js';
import { processPosts } from '../updater.js';

export default (state) => (e) => {
  e.preventDefault();
  state.processState = 'validating';
  const rssUrl = e.target.querySelector('#url-input').value;
  validate(rssUrl, state.feeds)
    .then((validUrl) => {
      state.processState = 'sending';
      return axios.get(proxify(validUrl));
    })
    .then(({ data: { contents } }) => parse(contents))
    .then((parsedData) => {
      const { title, description, posts } = parsedData;
      if (!state.feeds.some((feed) => feed.title === title)) {
        state.feeds.push({ url: rssUrl, title, description });
        processPosts(state, posts);
      }
      state.processState = 'processed';
    })
    .catch((error) => {
      const {
        name, message, isAxiosError, isParseError,
      } = error;
      if (isAxiosError) {
        state.error.message = 'failure';
        state.processState = 'failed';
        return;
      }
      if (isParseError) {
        state.error.message = message;
        state.processState = 'failed';
        return;
      }
      if (name === 'Validation Error') {
        state.error.name = 'validation';
        state.error.message = message;
        state.processState = 'failed';
        return;
      }
      state.error.name = 'unknown';
      state.error.message = message;
      state.processState = 'failed';
    });
};
