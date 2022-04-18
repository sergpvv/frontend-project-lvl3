import axios from 'axios';
import handleProcessState from './process_state.js';
import validate from '../utils/validator.js';
import proxify from '../utils/proxifier.js';
import parse from '../utils/parser.js';

export default (state) => (e) => {
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
      state.posts.push(...posts);
      handleProcessState(state, 'processed');
    })
    .catch(({ message }) => {
      state.error = message;
      // console.log('catch error: ', message);
      handleProcessState(state, 'failed');
    });
};
