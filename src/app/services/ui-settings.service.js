class UiSettingsService {
  constructor($rootScope, socketService, mockService, $log, themeManager, $document, $translate, $state, $timeout) {
    'ngInject';
    this.socketService = socketService;
    this.themeManager = themeManager;
    this.$document = $document;
    this.$log = $log;
    this.$translate = $translate;
    this.$state = $state;
    this.$timeout = $timeout;

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

    this.defaultThumbnailBackgroundUrl =
        `${this.socketService.host}/app/themes/${this.themeManager.theme}/assets/graphics/thumb-${this.themeManager.theme}-bg.jpg`;
    this.defaultBackgroundUrl =
        `${this.socketService.host}/app/themes/${this.themeManager.theme}/assets/graphics/${this.themeManager.theme}-bg.jpg`;
  }

  setBackground() {
    if (this.uiSettings.color) {
      this.$document[0].body.style.background = '';
      this.$document[0].body.style.backgroundColor = this.uiSettings.color;
    } else {
      if (this.uiSettings.background.title === 'Default') {
        this.$document[0].body.style.background = `#333 url(${this.defaultBackgroundUrl}) repeat top left`;
        this.$document[0].body.style.backgroundSize = 'auto';
      } else {
        this.$document[0].body.style.background =
            `#333 url(${this.uiSettings.background.path}) no-repeat center center`;
        this.$document[0].body.style.backgroundSize = 'cover';
      }
    }
  }

  setLanguage() {
    if (~location.href.indexOf('wizard')) {
      this.browserLanguage = this.getBrowserDefaultLanguage();
    } else {
      this.$translate.use(this.uiSettings.language);
    }
  }

  getBrowserDefaultLanguage() {
    const browserLanguagePropertyKeys = ['languages', 'language', 'browserLanguage', 'userLanguage', 'systemLanguage'];
    let langArray = [];
    browserLanguagePropertyKeys.forEach((prop) => {
      if (prop in window.navigator) {
        if (angular.isArray(window.navigator[prop])) {
          langArray.push(...window.navigator[prop]);
        } else {
          langArray.push(window.navigator[prop]);
        }
      }
    });
    this.$log.debug('Navigator defaultLanguage', langArray[0]);
    return langArray[0].substr(0, 2) || 'en';
  }

  registerListner() {
    this.$log.debug('UiSettingsService is listening');

    this.socketService.on('pushUiSettings', (data) => {
      if (data.background.path.indexOf(this.socketService.host) === -1) {
        var bg = `${this.socketService.host}/backgrounds/${data.background.path}`;
        data.background.path = bg;
      }
      this.$log.debug('pushUiSettings', data);
      //Check for language switch
      if (this.uiSettings && this.uiSettings.language !== data.language) {
        location.reload();
      }
      this.uiSettings = data;
      this.setLanguage();
      this.setBackground();
    });

    this.socketService.on('pushBackgrounds', (data) => {
      this.$log.debug('pushBackgrounds', data);
      this.backgrounds = data;
      this.backgrounds.list = [{
        path: this.defaultBackgroundUrl,
        thumbnail: this.defaultThumbnailBackgroundUrl,
        notDeletable: true,
        name: 'Default'}]
        .concat(data.available.map((background) => {
          background.path = `${this.socketService.host}/backgrounds/${background.path}`;
          background.thumbnail = `${this.socketService.host}/backgrounds/${background.thumbnail}`;
          return background;
        }));
      this.setBackground();
    });

    this.socketService.on('pushWizard', (data) => {
      this.$log.debug('pushWizard', data);
      if (data.openWizard) {
        this.$state.go('volumio.wizard');
      }
    });
  }

  initService() {
    this.socketService.emit('getUiSettings');
    this.socketService.emit('getWizard');
  }
}

export default UiSettingsService;
