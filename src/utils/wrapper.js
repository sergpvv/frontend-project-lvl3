export default (targetUrl) => [
  'https://allorigins.hexlet.app',
  '/get?disableCache=true',
  `&url=${encodeURIComponent(targetUrl)}`,
].join('');
