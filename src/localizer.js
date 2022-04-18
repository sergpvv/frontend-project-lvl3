export default (i18n) => {
  Object.entries({
    about: 'footer a',
    add: 'button[type="submit"]',
    close: '#modal .btn-secondary',
    read: '#modal .full-article',
    start: 'p.lead',
    rssLink: 'label[for="url-input"]',
    example: 'main p.text-muted',
  })
    .forEach(([key, selector]) => {
      document.querySelector(selector).textContent = i18n.t(key);
    });
};
