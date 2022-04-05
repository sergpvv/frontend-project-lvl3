export default (targetUrl) => [
  'https://allorigins.hexlet.app',
  '/raw?disableCache=true',
  `&url=${encodeURIComponent(targetUrl)}`,
].join('');
