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
  Promise.all(state.feeds.map(({ url }) => axios
    .get(proxify(url))
    .then(({ data }) => parse(data))
    .then(({ posts }) => processPosts(state, posts))
    .then(() => setTimeout(checkFeedsUpdate, 5000, state))
    .catch((error) => {
      console.error('checkFeedsUpdate catch error: ', error);
    })));
    // .then(() => setTimeout(checkFeedsUpdate, 5000, state));
};

export default checkFeedsUpdate;
