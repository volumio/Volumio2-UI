class PlayerLoggerDirective {
  constructor () {
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
  constructor (socketService) {
    'ngInject';
    socketService.on('printConsoleMessage', (data) => {
      this.log = '<br/>' + data + this.log;
    });
  }

  clear() {
    this.log = '';
  }
}

export default PlayerLoggerDirective;
