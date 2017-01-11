export default class TrackAciotnsBtnDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('track-actions-btn', 'components/track-actions-btn'),
      scope: {},
      controller: TrackActionsBtnController,
      controllerAs: 'trackActionsBtn',
      bindToController: true
    };
    return directive;
  }
}

class TrackActionsBtnController {
  constructor($log, playerService, modalService) {
    'ngInject';
    this.playerService = playerService;
    this.modalService = modalService;
    this.$log = $log;
  }

  trackActions() {
    if (!this.playerService.state.title && !this.playerService.album && !this.playerService.artist) {
      return false;
    }
    let templateUrl = 'app/components/track-manager/components/modals/modal-track-manager-actions.html';
    let controller = 'ModalTrackManagerActionsController';
    this.modalService.openModal(
      controller,
      templateUrl,
      null,
      'sm',
      true
    );
  }
}
