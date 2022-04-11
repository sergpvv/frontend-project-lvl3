export default (rssLink) => {
  const url = new URL('/get?', 'https://allorigins.hexlet.app');
  url.searchParams.append('disableCache', true);
  url.searchParams.append('charset', 'utf-8');
  url.searchParams.append('url', rssLink);
  return url.toString();
};
