export default class AddTrackToPlaylistBtnDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('add-track-to-playlist-btn', 'components/add-track-to-playlist-btn'),
      scope: {},
      controller: AddTrackToPlaylistBtnController,
      controllerAs: 'addTrackToPlaylistBtn',
      bindToController: true
    };
    return directive;
  }
}

class AddTrackToPlaylistBtnController {
  constructor($log, playerService, modalService) {
    'ngInject';
    this.playerService = playerService;
    this.modalService = modalService;
    this.$log = $log;
  }

  addToPlaylist() {
    if (this.playerService.state.trackType !== 'webradio') {
      let
      templateUrl = 'app/browse/components/modal/modal-playlist.html',
      controller = 'ModalPlaylistController',
      params = {
        title: 'Add to playlist',
        item: this.playerService.state
      };
      this.modalService.openModal(
        controller,
        templateUrl,
        params,
        'sm');
    }
  }
}
