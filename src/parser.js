const getContent = (element, name) => element.querySelector(name).textContent;

export default (data) => {
  const doc = (new DOMParser()).parseFromString(data, 'text/xml');
  if (doc.querySelector('parserror')) return null;
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
