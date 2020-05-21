import * as yup from 'yup';
import axios from 'axios';
import { watch } from 'melanke-watchjs';

const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const formSelector = 'form';
const inputSelector = 'input';
const addButtonSelector = '.btn';
const feedbackSelector = '.feedback';

export default () => {
  const state = {
    form: {
      processState: 'filling',
      inputUrl: '',
      validationState: 'invalid',
      errors: [],
    },
    feeds: [],
  };
  const schema = yup.object().shape({
    inputUrl: yup.string().url().required(),
  });
  const addButton = document.querySelector(addButtonSelector);
  addButton.disabled = true;
  const isValid = (value) => value === 'valid';
  document.querySelector(inputSelector)
    .addEventListener('input', ({ target }) => {
      state.form.processState = 'filling';
      state.form.inputUrl = target.value;
      schema
        .isValid(state.form, { strict: true, abortEarly: false })
        .then((valid) => {
          if (valid) {
            state.form.validatonState = state.feeds.some(({ url }) => url === state.form.inputUrl)
              ? 'already added'
              : 'valid';
          } else {
            state.form.validatonState = 'invalid';
          }
          console.log(state.form.validatonState);
          if (isValid(state.form.validatonState)) {
            // state.form.errors.push(`rss feed url ${state.form.validatonState}`);
            addButton.disabled = false;
            state.form.errors = [];
          }
          return schema.validate(state.form, { strict: true, abortEarly: false });
        })
        .catch(({ errors }) => {
          if (errors.length > 0) {
            state.form.errors = [...errors];
          }
        });
    });
  document.querySelector(formSelector)
    .addEventListener('submit', (e) => {
      e.preventDefault();
      state.form.processState = 'sending';
      axios.get([corsProxy, state.form.inputUrl].join(''))
        .then(() => {
          // const feed = parse(response);
          console.log('downloaded');
        })
        .catch((error) => {
          state.form.errors.push(error.message);
        });
    });
  const removeChilds = (element) => {
    while (element.firstChild && element.removeChild(element.firstChild));
  };

  watch(state.form, 'validationState', () => {
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
    /*
    if (processState === 'filling') {
      addButton.disabled = isInvalid();
    }
*/
    if (processState === 'sending') {
      addButton.disabled = true;
      setTimeout(() => {
        state.form.processState = 'downloaded';
        state.form.errors = [];
      },
      3000);
    }
    if (processState === 'downloaded') {
      state.feeds.push({ id: state.feeds.length, url: state.form.inputUrl });
      state.form.processState = 'filling';
    }
  });

  watch(state, 'feeds', () => {
    console.log(state.feeds.map(JSON.stringify).join('\n'));
  });

  watch(state.form, 'errors', () => {
    const feedback = document.querySelector(feedbackSelector);
    removeChilds(feedback);
    if (state.form.errors.length > 0) {
      state.form.errors.forEach((error) => {
        const div = document.createElement('div');
        div.classList.add('alert', 'alert-danger');
        div.textContent = error;
        feedback.appendChild(div);
      });
    }
  });
};
