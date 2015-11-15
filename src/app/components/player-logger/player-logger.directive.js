class PlayerLoggerDirective {
  constructor() {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/player-logger/player-logger.html',
      scope: false,
      controller: PlayerLoggerController,
      controllerAs: 'playerLogger',
      bindToController: true
    };

    return directive;
  }
}

class PlayerLoggerController {
  constructor(loggerService) {
    'ngInject';
    this.loggerService = loggerService;
  }
}

export default PlayerLoggerDirective;
