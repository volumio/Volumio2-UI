class TrackManagerDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/playback/elements/track-manager/track-manager.html',
      scope: false,
      controller: TrackManagerController,
      controllerAs: 'vm',
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
