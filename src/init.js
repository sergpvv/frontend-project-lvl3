import i18next from 'i18next';
import watch from './watcher.js';
import ru from './locales/ru.js';
import localizeApp from './localizer.js';
import getFormSubmitHandler from './handlers/main.js';
import checkFeedsUpdate from './updater.js';
import initializeState from './state.js';
import { getCloseModalButtonHandler } from './handlers/buttons.js';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });
  localizeApp(i18next);
  const watchedState = watch(initializeState(), i18next);
  document.querySelector('form')
    .addEventListener('submit', getFormSubmitHandler(watchedState));
  document.querySelectorAll('#modal button[type="button"').forEach((button) => {
    button.addEventListener('click', getCloseModalButtonHandler(watchedState));
  });
  checkFeedsUpdate(watchedState);
};
