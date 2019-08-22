class FooterController {
  constructor(matchmediaService, socketService, $scope, $injector, $state, themeManager) {
    'ngInject';
    this.matchmediaService = matchmediaService;
    this.state = $state;
    this.themeManager = themeManager;
    this.$scope = $scope;

    $scope.$watch(() => socketService.host, () => {
      if(socketService.host) {
        this.isSocketReady = true;
        this.playerService = $injector.get('playerService');
      } else {
        this.isSocketReady = false;
      }
    });

    this.updateTabbar();
    $scope.$on('$locationChangeStart', (event, next, current) => {
      this.updateTabbar();
    });
  }

  updateTabbar(){
    this.showPlayerFooter = this.state.$current.name === 'volumio.playback' && this.themeManager.theme === 'volumio3';
  }
}

export default FooterController;
