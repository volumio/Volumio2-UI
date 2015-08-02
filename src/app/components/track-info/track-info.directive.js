class TrackInfoDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/track-info/track-info.html',
      scope: false,
      controller: TrackInfoController,
      controllerAs: 'trackInfo',
      bindToController: true
    };

    return directive;
  }
}

class TrackInfoController {
  constructor (playerService) {
    'ngInject';
    this.playerService = playerService;
  }
}

export default TrackInfoDirective;
