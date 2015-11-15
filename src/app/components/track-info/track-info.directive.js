class TrackInfoDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('track-info', 'components/track-info'),
      scope: false,
      controller: TrackInfoController,
      controllerAs: 'trackInfo',
      bindToController: true
    };
    return directive;
  }
}

class TrackInfoController {
  constructor(playerService) {
    'ngInject';
    this.playerService = playerService;
  }
}

export default TrackInfoDirective;
