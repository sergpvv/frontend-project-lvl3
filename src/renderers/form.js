export const toggleDisabling = (flagValue) => {
  document.querySelector('#url-input').readOnly = flagValue;
  document.querySelector('button[type=submit]').disabled = flagValue;
};

export const clearInputForm = () => {
  document.querySelector('#url-input').value = '';
};

export const renderFeedback = (value, i18n) => {
  const feedback = document.querySelector('.feedback');
  if (!value) {
    feedback.textContent = '';
    return;
  }
  const { style, key } = value;
  feedback.textContent = i18n.t(key);
  const classes = ['secondary', 'info', 'success', 'danger'];
  feedback.classList.remove(...classes.map((name) => `text-${name}`));
  feedback.classList.add(`text-${style}`);
};

export const renderBorder = (key) => {
  const input = document.querySelector('#url-input');
  input.classList.add('is-valid', 'is-invalid');
  switch (key) {
    case 'none':
      input.classList.remove('is-valid', 'is-invalid');
      break;
    case 'valid':
      input.classList.remove('is-invalid');
      break;
    case 'invalid':
      input.classList.remove('is-valid');
      break;
    default:
      console.error(`renderBorder unknown key: ${key}`);
  }
};
