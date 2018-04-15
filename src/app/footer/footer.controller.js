class FooterController {
  constructor(matchmediaService, socketService, $scope, $injector) {
    'ngInject';
    this.matchmediaService = matchmediaService;

    $scope.$watch(() => socketService.host, () => {
      if(socketService.host) {
        this.isSocketReady = true;
        this.playerService = $injector.get('playerService');
      } else {
        this.isSocketReady = false;
      }
    });
  }
}

export default FooterController;
