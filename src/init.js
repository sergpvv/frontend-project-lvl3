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
      input: '',
      validationState: 'invalid',
      errors: [],
    },
    feeds: [],
  };
  const schema = yup.mixed().object().shape({
    input: yup.string().url(),
  });
  document.querySelector(inputSelector)
    .addEventListener('input', ({ target }) => {
      state.form.processState = 'filling';
      state.form.input = target.value;
      schema
        .validate({ input: state.form.input }, { strict: true, abortEarly: false })
        .then(({ input }) => {
          state.form.validatonState = 'valid';
          state.errors = [`is correct:${input}`];
        })
        .catch(({ errors }) => {
          state.form.errors = [...errors];
        });
    });
  document.querySelector(formSelector)
    .addEventListener('submit', (e) => {
      e.preventDefault();
      state.form.processState = 'sending';
      axios.get([corsProxy, state.form.input].join(''))
        .then(() => {
          // const feed = parse(response);
          setTimeout(() => {
            state.form.processState = 'filling';
            state.form.errors = [];
          },
          3000);
        })
        .catch((error) => {
          state.form.errors.push(error.message);
        });
    });
  const isInvalid = () => state.form.validationState === 'invalid';
  const removeChilds = (element) => {
    while (element.firstChild && element.removeChild(element.firstChild));
  };
  const addButton = document.querySelector(addButtonSelector);
  addButton.disabled = isInvalid();

  watch(state.form, 'processState', () => {
    if (state.form.processState === 'sending') {
      addButton.disabled = true;
    }
  });

  watch(state.form, 'validationState', () => {
    addButton.disabled = isInvalid();
  });

  watch(state.form, 'errors', () => {
    const feedback = document.querySelector(feedbackSelector);
    removeChilds(feedback);
    if (state.form.errors.length > 0) {
      state.form.errors.forEach((error) => {
        const div = document.createElement('div');
        div.classList.add('alert', 'alert-danger', 'pb-0', 'pt-0', 'mb-1');
        div.textContent = error;
        feedback.appendChild(div);
      });
    }
  });
};
