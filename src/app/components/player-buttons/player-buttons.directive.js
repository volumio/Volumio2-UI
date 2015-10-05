class PlayerButtonsDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/themes/volumio/components/player-status/volumio-player-status.html',
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
