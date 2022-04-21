import axios from 'axios';
import { handleProcessState } from '../state.js';
import validate from '../utils/validator.js';
import proxify from '../utils/proxifier.js';
import parse from '../utils/parser.js';
import { processPosts } from '../updater.js';

export default (state) => (e) => {
  e.preventDefault();
  handleProcessState(state, 'validating');
  const rssUrl = e.target.querySelector('#url-input').value;
  validate(rssUrl, state.feeds)
    .then((validUrl) => {
      handleProcessState(state, 'sending');
      return axios.get(proxify(validUrl));
    })
    .then(({ data: { contents } }) => {
      handleProcessState(state, 'downloaded');
      return parse(contents);
    })
    .then((parsedData) => {
      const { title, description, posts } = parsedData;
      if (!state.feeds.some((feed) => feed.title === title)) {
        state.feeds.push({ url: rssUrl, title, description });
        processPosts(state, posts);
      }
      handleProcessState(state, 'processed');
    })
    .catch(({ message }) => {
      state.error = message;
      handleProcessState(state, 'failed');
    });
};
