export default ({ contents }) => {
  const doc = (new DOMParser()).parseFromString(contents, 'text/xml');
  // console.log((new XMLSerializer()).serializeToString(doc));
  const isParserror = doc.documentElement.nodeName === 'parsererror';
  if (isParserror || doc.querySelector('parserror')) return null;
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
