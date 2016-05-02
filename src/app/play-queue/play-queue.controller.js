class PlayQueueController {
  constructor(playQueueService, matchmediaService) {
    'ngInject';
    this.playQueueService = playQueueService;
    this.matchmediaService = matchmediaService;
  }
}

export default PlayQueueController;
