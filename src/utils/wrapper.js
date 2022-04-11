export default (targetUrl) => [
  'https://allorigins.hexlet.app',
  '/get?disableCache=true',
  `&url=${targetUrl}`,
  // `&url=${encodeURIComponent(targetUrl)}`,
].join('');
