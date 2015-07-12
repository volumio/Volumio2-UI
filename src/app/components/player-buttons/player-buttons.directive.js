class PlayerButtonsDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/player-buttons/player-buttons.html',
      scope: false,
      controller: PlayerButtonsController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }
}

class PlayerButtonsController {
  constructor (player) {
    'ngInject';
    this.player = player;
  }
}

export default PlayerButtonsDirective;
