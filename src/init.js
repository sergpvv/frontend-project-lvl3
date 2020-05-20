import * as yup from 'yup';
import axios from 'axios';
import { watch } from 'melanke-watchjs';

const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const formSelector = '.form';
const inputSelector = '.form-control';
const addButtonSelector = '.btn';

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
  const schema = yup.object().shape({
    input: yup.string().required().url(),
  });
  document.querySelector(inputSelector)
    .addEventListener('input', ({ target }) => {
      state.form.state = 'filling';
      state.form.input = target.value;
      schema
        .validate(state.form)
        .then(() => {
          state.form.validatonState = 'valid';
          state.errors = [];
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
          state.form.errors = [];
        })
        .catch((error) => {
          state.form.errors.push(error.message);
        });
    });
  const addButton = document.querySelector(addButtonSelector);
  watch(state.form, 'validationState', () => {
    addButton.disabled = state.form.validationState === 'invalid';
  });
  watch(state.form, 'errors', () => {
    const errorContainer = document.querySelector('.error-container');
    if (errorContainer.childNodes) {
      errorContainer.innerHTML = '';
    }
    if (state.form.errors.length > 0) {
      state.form.errors.forEach((error) => {
        const div = document.createElement('div');
        div.classList.add('alert', 'alert-danger', 'pb-0', 'pt-0', 'mb-1');
        div.innerHTML = `<strong>${error}</strong>`;
        errorContainer.appendChild(div);
      });
    }
  });
};
