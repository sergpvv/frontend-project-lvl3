export default (url) => [
  'https://hexlet-allorigins.herokuapp.com',
  `/raw?url=${encodeURIComponent(url)}&disableCache=true`,
].join('');
