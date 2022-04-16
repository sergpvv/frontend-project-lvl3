const filling = (state) => {
  state.uiState.formFilling = true;
};

const validating = (state) => {
  state.uiState.formFilling = false;
};

const sending = (state) => {
  state.validationState = 'valid';
  state.uiState.feedback.style = 'info';
  state.uiState.feedback.key = 'sending';
};

const downloaded = (state) => {
  state.uiState.feedback.style = 'info';
  state.uiState.feedback.key = 'downloaded';
};

const processed = (state) => {
  state.uiState.feedback.style = 'success';
  state.uiState.feedback.key = 'success';
  state.validationState = null;
};

const failed = (state) => {
  state.uiState.formFilling = true;
  const { error } = state;
  const isNetworkError = error === 'Network Error';
  const isKnown = error in [
    'required',
    'invalid',
    'exists',
    'parserror',
  ];
  const isUnknown = !(isNetworkError && isKnown);
  if (isUnknown) {
    state.uiState.feedback.key = 'unknown';
    state.uiState.feedback.style = 'secondary';
    return;
  }
  state.uiState.feedback.style = 'danger';
  const key = isNetworkError ? 'failure' : error;
  state.uiState.feedback.key = key;
  if (key in ['required', 'invalid', 'exists']) {
    state.validationState = key;
  }
};

const handleProcess = {
  filling,
  validating,
  sending,
  downloaded,
  processed,
  failed,
};

export default (state, processState) => {
  state.processState = processState;
  handleProcess[processState](state);
};
