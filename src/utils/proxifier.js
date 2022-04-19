export default (url) => {
  const corsProxy = 'https://allorigins.hexlet.app';
  // const proxifiedUrl = new URL('/get', corsProxy);
  // proxifiedUrl.searchParams.append('disableCache', true);
  // proxifiedUrl.searchParams.append('url', url);
  // console.log(`proxifiedUrl: ${proxifiedUrl}`);
  // return proxifiedUrl;
  return `${corsProxy}/get?url=${url}&disableCache=true`;
  // const result = proxifiedUrl.toString();
  // console.log(`proxifiedUrl: ${proxifiedUrl}; toString: ${result}`);
  // return result;
};
