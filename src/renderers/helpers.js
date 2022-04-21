export const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

export const setAttributes = (element, ...attributes) => {
  attributes.forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
};
