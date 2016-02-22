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
  constructor(playerService) {
    'ngInject';
    this.playerService = playerService;
  }
}

export default TrackInfoBarDirective;
