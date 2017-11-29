class FooterController {
  constructor(themeManager, matchmediaService, $injector, socketService) {
    'ngInject';
    this.themeManager = themeManager;
    this.socketService = socketService;
    this.test = true;

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

export default FooterController;
