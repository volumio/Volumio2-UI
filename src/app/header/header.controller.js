class HeaderController {
  constructor(themeManager, matchmediaService, socketService, $injector) {
    'ngInject';
    this.themeManager = themeManager;
    this.matchmediaService = matchmediaService;
    this.socketService = socketService;

    this.canUseSocket = this.canUseSocket();

    if(this.canUseSocket){
      this.playerService = $injector.get('playerService');
      this.uiSettingsService = $injector.get('uiSettingsService');
    }
  }

  canUseSocket(){
    return this.socketService.host !== null;
  }

}

export default HeaderController;
