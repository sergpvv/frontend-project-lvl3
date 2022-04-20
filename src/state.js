export default {
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
};
