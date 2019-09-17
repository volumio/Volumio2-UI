class LayoutController {
  constructor($state, $scope, themeManager, $log, matchmediaService) {
    'ngInject';
    this.$state = $state;
    this.$scope = $scope;
    this.themeManager = themeManager;
    this.$log = $log;
    this.matchmediaService = matchmediaService;

    this.wrapperColumnClass = '';
    
    this.initMainMenu();

    this.updateTabbar();
    $scope.$on('$locationChangeStart', (event, next, current) => {
      this.updateTabbar();
    });
  }

  updateTabbar(){
    this.isWithPlaybackBar = this.$state.$current.name === 'volumio.playback' && this.themeManager.theme === 'volumio3';
  }

  initMainMenu(){
    this.wrapperColumnClass = this.matchmediaService.isPhone ?
      '' :
      'col-md-20' ;
  }

  swipeLeft() {
    const currentState = this.$state.current.name;
    this.$log.debug(this.$state.current.name);
    switch (currentState) {
      case 'volumio.browse':
        this.$state.go('volumio.playback');
        break;
      case 'volumio.playback':
        this.$state.go('volumio.play-queue');
        break;
    }
  }

  swipeRight() {
    const currentState = this.$state.current.name;
    switch (currentState) {
      case 'volumio.play-queue':
        this.$state.go('volumio.playback');
        break;
      case 'volumio.playback':
        this.$state.go('volumio.browse');
        break;
    }
  }
}

export default LayoutController;
