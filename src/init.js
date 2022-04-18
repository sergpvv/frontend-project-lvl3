import i18next from 'i18next';
import { setLocale } from 'yup';
import watch from './watcher.js';
import ru from './locales/ru.js';
import localizeApp from './localizer.js';
import getFormSubmitHandler from './handlers/main.js';
import checkFeedsUpdate from './updater.js';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });
  localizeApp(i18next);
  setLocale({
    mixed: {
      test: 'exists',
      required: 'required',
    },
    string: {
      url: 'invalid',
    },
  });
  const watchedState = watch(
    {
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
        // modalVisibility: 'hidden', // shown
        // modalContainsPost: null, // index of post
        formDisabled: false,
        feedback: {
          style: null, // danger success info secondary
          key: null, // required valid invalid exists parserror failure (network error) unknown
        },
        viewed: [], // [0: true, 1: false, ...]
      },
      feeds: [],
      posts: [],
    },
    i18next,
  );
  document.querySelector('form').addEventListener('submit', getFormSubmitHandler(watchedState));
  checkFeedsUpdate(watchedState);
};
