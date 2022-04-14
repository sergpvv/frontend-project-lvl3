export default (url) => {
  const corsProxy = 'https://allorigins.hexlet.app';
  const proxifiedUrl = new URL('/get', corsProxy);
  proxifiedUrl.searchParams.append('disableCache', true);
  proxifiedUrl.searchParams.append('url', url);
  const result = proxifiedUrl.toString();
  // `${corsProxy}/get?${url}&disableCache=true`;//proxifiedUrl.toString();
  // console.log(`proxifiedUrl: ${proxifiedUrl}; toString: ${result}`);
  return result;
};
