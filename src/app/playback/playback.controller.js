class PlaybackController {
  constructor(playerService, matchmediaService) {
    'ngInject';
    this.playerService = playerService;
    this.matchmediaService = matchmediaService;
  }
}

export default PlaybackController;
