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
  constructor (player) {
    'ngInject';
    this.player = player;
  }
}

export default TrackManagerDirective;
