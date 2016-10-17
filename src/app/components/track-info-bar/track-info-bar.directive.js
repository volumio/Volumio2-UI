class TrackInfoBarDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/track-info-bar/track-info-bar.html',
      scope: false,
      controller: TrackInfoBarController,
      controllerAs: 'trackInfoBar',
      bindToController: true
    };
    return directive;
  }
}

class TrackInfoBarController {
  constructor(playerService, playQueueService, modalService, $state, $translate) {
    'ngInject';
    this.playerService = playerService;
    this.playQueueService = playQueueService;
    this.modalService = modalService;
    this.$state = $state;
    this.$translate = $translate;
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

export default TrackInfoBarDirective;
