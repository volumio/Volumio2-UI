class TrackInfoDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/themes/axiom/components/track-info/axiom-track-info.html',
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
