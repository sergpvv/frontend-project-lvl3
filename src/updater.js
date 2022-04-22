import axios from 'axios';
import parse from './utils/parser.js';
import proxify from './utils/proxifier.js';

export const processPosts = (state, posts) => {
  posts.forEach((post) => {
    if (!state.posts.some(({ title }) => title === post.title)) {
      state.posts.push(post);
    }
  });
};

const checkFeedsUpdate = (state) => {
  state.checkingFeedsUpdate = 'begined';
  Promise.all(state.feeds.map(({ url }) => axios
    .get(proxify(url))
    .then(({ data: { contents } }) => parse(contents))
    .then(({ posts }) => {
      processPosts(state, posts);
      state.checkingFeedsUpdate = 'finished';
    })))
    .catch(({ message }) => {
      console.error('checkFeedsUpdate failed with error:', message);
    })
    .finally(() => setTimeout(checkFeedsUpdate, 5000, state));
};

export default checkFeedsUpdate;
