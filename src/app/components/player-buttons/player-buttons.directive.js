class PlayerButtonsDirective {
  constructor() {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/player-buttons/player-buttons.html',
      scope: false,
      controller: PlayerButtonsController,
      controllerAs: 'playerButtons',
      bindToController: true
    };
    return directive;
  }
}

class PlayerButtonsController {
  constructor(playerService) {
    'ngInject';
    this.playerService = playerService;
  }
}

export default PlayerButtonsDirective;
