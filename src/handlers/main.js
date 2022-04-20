import axios from 'axios';
import handleProcessState from './process_state.js';
import validate from '../utils/validator.js';
import proxify from '../utils/proxifier.js';
import parse from '../utils/parser.js';
import { processPosts } from '../updater.js';

export default (state) => (e) => {
  e.preventDefault();
  state.counter += 1;
  handleProcessState(state, 'validating');
  const rssUrl = e.target.querySelector('#url-input').value;
  validate(rssUrl, state.feeds)
    .then(
      (validUrl) => {
      // console.log('Valid url: ', validUrl);
        handleProcessState(state, 'sending');
        return axios.get(proxify(validUrl));
      }, /* ,
      ({ message }) => {
        console.log(`validate failed with error: ${message}`);
        throw new Error(message);
      }, */
    )
    .then(
      ({ data }) => {
      // console.log('downloaded, parse data: ', data);
        handleProcessState(state, 'downloaded');
        return parse(data);
      }, /* ,
      ({ message }) => {
        console.log(`axios.get failed with error: ${message}`);
        throw new Error(message);
      }, */
    )
    .then(
      (parsedData) => {
      // console.log('..parsing complete; parsedData: ', parsedData);
        const { title, description, posts } = parsedData;
        if (!state.feeds.some((feed) => feed.title === title)) {
          state.feeds.push({ url: rssUrl, title, description });
          processPosts(state, posts);
        }
        handleProcessState(state, 'processed');
      }, /* ,
      ({ message }) => {
        console.log(`parsing failed with error: ${message}`);
        throw new Error(message);
      }, */
    )
    .catch(({ message }) => {
      state.error = message;
      // console.log('catch error: ', message);
      handleProcessState(state, 'failed');
    });
};
