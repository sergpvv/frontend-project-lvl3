export default () => ({
  processState: 'filling',
  /* filling ->
   * validating (-> failed [required || invalid || exists] -> filling) ->
   * sending (-> failed [network error] -> filling) ->
   * downloaded (-> failed [parsing error] -> filling) ->
   * processed -> filling
 */
  updateState: 'begined', // finished
  error: '',
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
});

export const handleProcessState = (state, processState) => {
  switch (processState) {
    case 'validating':
      state.uiState.form.disabled = true;
      break;
    case 'sending':
      state.uiState.form.border = 'valid';
      state.uiState.feedback.style = 'info';
      state.uiState.feedback.key = 'sending';
      break;
    case 'downloaded':
      state.uiState.feedback.style = 'info';
      state.uiState.feedback.key = 'downloaded';
      break;
    case 'processed':
      state.uiState.form.disabled = false;
      state.uiState.form.border = 'none';
      state.uiState.feedback.style = 'success';
      state.uiState.feedback.key = 'success';
      break;
    case 'failed':
      state.uiState.form.disabled = false;
      const { error } = state;
      const isNetworkError = error === 'Network Error';
      const isKnown = [
        'required',
        'invalid',
        'exists',
        'parserror',
      ].includes(error);
      const isUnknown = !(isNetworkError || isKnown);
      if (isUnknown) {
        state.uiState.feedback.key = 'unknown';
        state.uiState.feedback.style = 'secondary';
        return;
      }
      state.uiState.feedback.style = 'danger';
      const key = isNetworkError ? 'failure' : error;
      state.uiState.feedback.key = key;
      if (['required', 'invalid', 'exists'].includes(key)) {
        state.uiState.form.border = 'invalid';
      }
      break;
    default:
      console.error(`unknown processState: ${processState}`);
  }
  state.processState = processState;
};
