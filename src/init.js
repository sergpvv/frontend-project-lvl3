import i18next from 'i18next';
import watch from './watcher.js';
import ru from './locales/ru.js';
import localizeApp from './localizer.js';
import getFormSubmitHandler from './handlers/main.js';
import checkFeedsUpdate from './updater.js';
import state from './state.js';
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
  const watchedState = watch(state, i18next);
  // localizeApp(i18next, watchedState);
  document.querySelector('form')
    .addEventListener('submit', getFormSubmitHandler(watchedState));

  document.querySelectorAll('#modal button[type="button"').forEach((button) => {
    button.addEventListener('click', getCloseModalButtonHandler(watchedState));
  });
  checkFeedsUpdate(watchedState);
};
