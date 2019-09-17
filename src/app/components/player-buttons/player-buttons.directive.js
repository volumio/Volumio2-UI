class PlayerButtonsDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('player-buttons', 'components/player-buttons'),
      scope: {
        isInFooter: "@"
      },
      controller: PlayerButtonsController,
      controllerAs: 'playerButtons',
      bindToController: true
    };
    return directive;
  }
}

class PlayerButtonsController {
  constructor($scope, playerService) {
    'ngInject';
    this.$scope = $scope;
    this.playerService = playerService;

    this.isInFooter = this.$scope.isInFooter || false;
  }
}

export default PlayerButtonsDirective;
