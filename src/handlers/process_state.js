const filling = (state) => {
  state.uiState.formDisabled = false;
};

const validating = (state) => {
  state.uiState.formDisabled = true;
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
  state.uiState.formDisabled = false;
};

const failed = (state) => {
  state.uiState.formDisabled = false;
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
  handleProcess[processState](state);
  state.processState = processState;
};
