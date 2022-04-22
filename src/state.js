export default () => ({
  processState: 'filling',
  /* filling ->
   * validating (-> validation returned error -> filling) ->
   * sending (-> received failure response -> filling) ->
   * (-> parsing returned error -> filling) ->
   * processed -> filling
 */
  checkingFeedsUpdate: 'begined', // finished
  error: {
    name: '', // validation | network | parsing
    message: '', // required, valid, invalid, exists | failure | parserror
  },
  uiState: {
    modal: {
      postId: null, // index of post being viewed
      show: false,
    },
    viewed: [], // posts viewed [0: true, 1: false, ...]
  },
  feeds: [],
  posts: [],
});
