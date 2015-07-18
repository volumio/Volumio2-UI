class TrackManagerDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/track-manager/track-manager.html',
      scope: false,
      controller: TrackManagerController,
      controllerAs: 'trackManager',
      bindToController: true
    };

    return directive;
  }
}

class TrackManagerController {
  constructor (playerService) {
    'ngInject';
    this.playerService = playerService;
  }
}

export default TrackManagerDirective;
