export default (str) => {
  const doc = (new DOMParser()).parseFromString(str, 'text/xml');
  const isParserror = doc.documentElement.nodeName === 'parsererror';
  if (isParserror || doc.querySelector('parsererror')) {
    const error = new Error('parserror');
    error.isParseError = true;
    throw error;
  }
  const getContent = (element, name) => element.querySelector(name).textContent;
  const title = getContent(doc, 'title');
  const description = getContent(doc, 'description');
  const posts = [...doc.querySelectorAll('item')]
    .map((e) => ({
      title: getContent(e, 'title'),
      description: getContent(e, 'description'),
      link: getContent(e, 'link'),
    }));
  return { title, description, posts };
};
