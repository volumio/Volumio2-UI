class UiSettingsService {
  constructor($rootScope, socketService, mockService, $log, themeManager, $document, $translate, $http) {
    'ngInject';
    this.socketService = socketService;
    this.themeManager = themeManager;
    this.$document = $document;
    this.$log = $log;
    this.$translate = $translate;
    this.$http = $http;

    this.currentTheme = themeManager.theme;
    this.uiSettings = {};

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
    this.$translate.use(this.uiSettings.language);
  }

  registerListner() {
    this.socketService.on('pushUiSettings', (data) => {
      if (data.background) {
        if (data.background.path.indexOf(this.socketService.host) === -1) {
          var bg = `${this.socketService.host}/backgrounds/${data.background.path}`;
          data.background.path = bg;
        }
      }

      // Page title
      if (data.pageTitle) {
        this.themeManager.defaultPageTitle = data.pageTitle;
      }

      //Check for language switch
      if (this.uiSettings.language && this.uiSettings.language !== data.language) {
        location.reload();
      }

      angular.merge(this.uiSettings, data);

      this.$log.debug('pushUiSettings', this.uiSettings);
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
  }

  initService() {
    let settingsUrl =
        `/app/themes/${this.themeManager.theme}/assets/variants/${this.themeManager.variant}`;
    settingsUrl += `/${this.themeManager.variant}-settings.json`;
    this.$http.get(settingsUrl)
      .then((response) => {
        this.uiSettings = response.data;
        this.$log.debug('Variant settings', response.data);
      })
      .finally(() => {
        this.socketService.emit('getUiSettings');
      });
  }
}

export default UiSettingsService;
