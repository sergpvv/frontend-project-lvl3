export default (i18n/* , watchedState */) => {
  /* // <---
  const div = document.createElement('div');
  div.className = 'col-md-10 col-lg-8 mx-auto order-0 order-lg-1';
  const button = document.createElement('button');
  button.className = 'btn btn-outline-success btn-sm';
  button.textContent = 'uiState';
  button.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.uiState.modal.show = true;
    console.log(JSON.stringify(watchedState.uiState, null, '  '));
  });
  div.append(button);
  document.querySelector('main>section>div.row').append(div);
  // --->
*/
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
