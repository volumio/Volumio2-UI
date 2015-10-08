class PlayerButtonsDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('player-buttons', 'components/player-buttons'),
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
