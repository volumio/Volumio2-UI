class PlayerStatusDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/player-status/player-status.html',
      scope: false,
      controller: PlayerStatusController,
      controllerAs: 'playerStatus',
      bindToController: true
    };

    return directive;
  }
}

class PlayerStatusController {
  constructor (player) {
    'ngInject';
    this.player = player;
    console.log(this.player);
  }
}

export default PlayerStatusDirective;
