export default (url) => {
  const corsProxy = 'https://allorigins.hexlet.app';
  const proxifiedUrl = new URL('/get', corsProxy);
  proxifiedUrl.searchParams.append('disableCache', true);
  proxifiedUrl.searchParams.append('url', url);
  return proxifiedUrl;
};
