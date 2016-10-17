class TrackInfoBarButtonsDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/track-info-bar/track-info-bar-buttons.html',
      scope: {},
      controller: TrackInfoBarButtonsController,
      controllerAs: 'trackInfoBarButtons',
      bindToController: true
    };
    return directive;
  }
}

class TrackInfoBarButtonsController {
  constructor(playerService, playQueueService, modalService) {
    'ngInject';
    this.playerService = playerService;
    this.playQueueService = playQueueService;
    this.modalService = modalService;
  }

  addToPlaylist() {
    let
    templateUrl = 'app/browse/components/modal/modal-playlist.html',
    controller = 'ModalPlaylistController',
    params = {
      title: 'Add to playlist',
      addQueue: true
    };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'sm');
  }
}

export default TrackInfoBarButtonsDirective;
