class UiSettingsService {
  constructor($rootScope, socketService, mockService, $log, themeManager) {
    'ngInject';
    this.socketService = socketService;
    this.themeManager = themeManager;
    this.$log = $log;

    this.currentTheme = themeManager.theme;
    this.defaultUiSettings = {
      backgroundImg: 'default bkg'
    };

    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.$log.debug('UiSettingsService is listening');
    this.socketService.on('pushUiSettings', (data) => {
      this.$log.debug('pushUiSettings', data);
      //TODO chose merge strategy or pull entire set from BE
      this.uiSettings = data;
    });
  }

  initService() {
    this.socketService.emit('getUiSettings');
  }
}

export default UiSettingsService;
