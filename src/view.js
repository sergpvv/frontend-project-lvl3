import { watch } from 'melanke-watchjs';

const addButtonSelector = '.btn';
const feedbackSelector = '.feedback';

const removeChilds = (element) => {
  while (element.firstChild && element.removeChild(element.firstChild));
};

const addButton = document.querySelector(addButtonSelector);

export const render = ({ form: { validationState } }) => {
  addButton.disabled = validationState !== 'valid';
};

const feedback = document.querySelector(feedbackSelector);

const renderFeedback = (state) => {
  removeChilds(feedback);
  if (state.form.errors.length > 0) {
    state.form.errors.forEach((error) => {
      const div = document.createElement('div');
      div.classList.add('alert', 'alert-danger');
      div.textContent = error;
      feedback.appendChild(div);
    });
  }
};

const stringify = (obj) => JSON.stringify(obj, null, '  ');

const renderFeeds = (state) => {
  state.feeds.map(stringify).forEach(console.log);
};

export default (state) => {
  watch(state.form, 'validationState', () => {
    // render(state);

    const { validationState } = state.form;
    switch (validationState) {
      case 'valid':
        if (addButton.disable) {
          addButton.disable = false;
        }
        break;
      default:
        if (!addButton.disable) {
          addButton.disable = true;
        }
    }
  });
  watch(state.form, 'processState', () => {
    const { processState } = state.form;
    switch (processState) {
      case 'filling':
        renderFeedback(state);
        break;
      case 'sending':
        addButton.disabled = true;
        break;
      case 'failed':
        render(state);
        renderFeedback(state);
        break;
      case 'downloaded':
        renderFeeds(state);
        break;
      default:
        throw new Error(`processState: ${processState}`);
    }
  });
};
