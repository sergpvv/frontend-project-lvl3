import i18next from 'i18next';
import watch from './watcher.js';
import ru from './locales/ru.js';
import localizeApp from './localizer.js';
import getFormSubmitHandler from './handlers/main.js';
import checkFeedsUpdate from './updater.js';
// import state from './state.js';
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
  const watchedState = watch({
    processState: null,
    /* filling ->
   * validating (-> failed [required || invalid || exists] -> filling) ->
   * sending (-> failed [network error] -> filling) ->
   * downloaded (-> failed [parsing error] -> filling) ->
   * processed -> filling
*/
    validationState: null, // valid invalid exists required
    error: '', // required, invalid, exists, parserror, network error
    uiState: {
      modal: {
        postId: null, // index of post being viewed
        show: false,
      },
      form: {
        disabled: false,
        border: 'none', // valid invalid
      },
      feedback: {
        style: null, // danger success info secondary
        key: null, // required valid invalid exists parserror failure (network error) unknown
      },
      viewed: [], // posts viewed [0: true, 1: false, ...]
    },
    feeds: [],
    posts: [],
    counter: 0,
  }, i18next);
  // const watchedState = watch(state, i18next);
  // localizeApp(i18next, watchedState);
  document.querySelector('form')
    .addEventListener('submit', getFormSubmitHandler(watchedState));
  document.querySelectorAll('#modal button[type="button"').forEach((button) => {
    button.addEventListener('click', getCloseModalButtonHandler(watchedState));
  });
  // checkFeedsUpdate(watchedState);
};
