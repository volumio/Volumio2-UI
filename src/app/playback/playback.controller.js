class PlaybackController {
  constructor($rootScope, playerService, matchmediaService, $state) {
    'ngInject';
    this.playerService = playerService;
    this.matchmediaService = matchmediaService;
    this.$state = $state;
    this.previousState = 'volumio.browse';

    $rootScope.$on('$stateChangeStart', (event, toState, toStateParams, fromState, fromParams) => {
      this.previousState = fromState.name;
      //$rootScope.previousStateParams = fromParams;
    });
  }

  goBack() {
    this.$state.go(this.previousState);
  }
}

export default PlaybackController;
