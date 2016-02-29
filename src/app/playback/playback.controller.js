class PlaybackController {
  constructor(playerService, matchmediaService, $state) {
    'ngInject';
    this.playerService = playerService;
    this.matchmediaService = matchmediaService;
    this.$state = $state;
  }
}

export default PlaybackController;
