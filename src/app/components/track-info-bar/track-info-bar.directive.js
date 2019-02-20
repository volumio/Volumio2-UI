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
  constructor(playerService, playQueueService, modalService, $state, $translate, browseService) {
    'ngInject';
    this.playerService = playerService;
    this.playQueueService = playQueueService;
    this.modalService = modalService;
    this.$state = $state;
    this.$translate = $translate;
    this.browseService = browseService;
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

  goTo(type) {
    this.$state.go('volumio.browse');
    let emitPayload = {
      type: type,
      value: this.playerService.state[type],
      artist: this.playerService.state.artist,
      album: this.playerService.state.album
    };
    this.browseService.goTo(emitPayload);
  }
}

export default TrackInfoBarDirective;
