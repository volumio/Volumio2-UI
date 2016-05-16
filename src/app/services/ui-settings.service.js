class UiSettingsService {
  constructor($rootScope, socketService, mockService, $log, themeManager, $document) {
    'ngInject';
    this.socketService = socketService;
    this.themeManager = themeManager;
    this.$document = $document;
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
      this.uiSettings = data;
      if (data.background.title === 'Default') {
        this.$document[0].body.style.background = `#333 url(${data.background.path}) repeat top left`;
        this.$document[0].body.style.backgroundSize = 'auto';
      } else {
        this.$document[0].body.style.background = `#333 url(${data.background.path}) no-repeat center center`;
        this.$document[0].body.style.backgroundSize = 'cover';
      }
    });
  }

  initService() {
    this.socketService.emit('getUiSettings');
  }
}

export default UiSettingsService;
