class PlaylistController {
  constructor (playQueueService) {
    'ngInject';
    this.playQueueService = playQueueService;
  }

  remove(trackIndex) {
    this.playQueueService.remove(trackIndex);
  }
}

export default PlaylistController;
