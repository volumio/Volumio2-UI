class FooterController {
  constructor(matchmediaService, socketService, $scope, $injector, $state) {
    'ngInject';
    this.matchmediaService = matchmediaService;
    this.state = $state;

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
