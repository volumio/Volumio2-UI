class UiSettingsService {
  constructor($rootScope, socketService, $state, mockService, $log, themeManager, $document, $translate, $http, $q, statisticsService, $window) {
    'ngInject';
    this.socketService = socketService;
    this.themeManager = themeManager;
    this.$document = $document;
    this.$log = $log;
    this.$translate = $translate;
    this.$http = $http;
    this.$q = $q;
    this.$state = $state;
    this.statisticsService = statisticsService;
    this.$window = $window;

    this.currentTheme = themeManager.theme;
    this.uiSettings = undefined;
    this.enableVolumioKioskMode = false;
    this.enableMemorySavingTouchUi = false;
    this.enableTouchUi = false;

    this.defaultUiSettings = {
      backgroundImg: 'default bkg'
    };

    this.detectVolumioTouschreenViaUserAgent();


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
      if (this.uiSettings.background && this.uiSettings.background.title === 'Default') {
        this.$document[0].body.style.background = `#333 url(${this.defaultBackgroundUrl}) repeat top left`;
        this.$document[0].body.style.backgroundSize = 'auto';
      } else {
        if (this.uiSettings.background && this.uiSettings.background.path) {
          this.$document[0].body.style.background = `#333 url(${this.uiSettings.background.path}) no-repeat center center`;
          this.$document[0].body.style.backgroundSize = 'cover';
        }
      }
    }
  }

  setLanguage(lang = null) {
    this.$log.debug('setLanguage');
    if (lang) {
      this.$translate.use(lang);
      return;
    }
    //TODO GET FROM DB
    if (!this.socketService.isSocketAvalaible()) {
      this.$translate.use(this.getBrowserDefaultLanguage());
      return;
    }
    if (~location.href.indexOf('wizard')) {
      this.browserLanguage = this.getBrowserDefaultLanguage();
    } else {
      if(this.uiSettings && this.uiSettings.language) {
        this.$translate.use(this.uiSettings.language);
      } else {
        setTimeout(function(){
          this.setLanguage();
        }.bind(this), 3000);
      }
    }
  }

  setLoadingBar() {
    this.socketService.loadingBarEnabled = this.uiSettings.loadingBar === false ? false : true;
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
    this.socketService.on('pushUiSettings', (data) => {
      if (data.background) {
        delete this.uiSettings.color;
        if (data.background.path.indexOf(this.socketService.host) === -1) {
          var bg = `${this.socketService.host}/backgrounds/${data.background.path}`;
          data.background.path = bg;
        }
      }

      // Page title
      this.defaultPageTitle = this.uiSettings.pageTitle || 'Audiophile music player';

      //Check for language switch
      if (this.uiSettings.language && this.uiSettings.language !== data.language) {
        location.reload();
      }

      angular.merge(this.uiSettings, data);

      this.$log.debug('pushUiSettings', this.uiSettings);
      this.setLanguage();
      this.setBackground();
      this.setLoadingBar();
      this.statisticsService.initStats();
    });

    this.socketService.on('pushBackgrounds', (data) => {
      this.$log.debug('pushBackgrounds', data);
      this.backgrounds = data;
      this.backgrounds.list = data.available.map((background) => {
          background.path = `${this.socketService.host}/backgrounds/${background.path}`;
          background.thumbnail = `${this.socketService.host}/backgrounds/${background.thumbnail}`;
          return background;
        });
      this.setBackground();
    });

    this.socketService.on('pushWizard', (data) => {
      this.$log.debug('pushWizard', data);
      if (data.openWizard) {
        this.$state.go('volumio.wizard');
      }
    });

    this.socketService.on('reloadUi', (data) => {
      this.$log.debug('reloadUi');
      window.location.reload(true);
    });

    this.socketService.on('pushPrivacySettings', (data) => {
      this.$log.debug('pushPrivacySettings');
      this.statisticsService.pushPrivacySettings(data);
    });
  }

  initService() {
    let settingsUrl =
        `/app/themes/${this.themeManager.theme}/assets/variants/${this.themeManager.variant}`;
    settingsUrl += `/${this.themeManager.variant}-settings.json`;
    // Return pending promise or cached results
    if (this.uiSettings) {
      return this.$q.resolve(this.uiSettings);
    } else if (this.settingsPromise) {
      return this.settingsPromise;
    }
    this.settingsPromise = this.$http.get(settingsUrl)
      .then((response) => {
        this.uiSettings = response.data;
        this.$log.debug('Variant settings', response.data);
        return this.uiSettings;
      })
      .finally(() => {
		if (this.socketService.isSocketAvalaible()) {
        	this.socketService.emit('getUiSettings');
        	this.socketService.emit('getWizard');
          this.socketService.emit('getPrivacySettings');
		}
      });
    return this.settingsPromise;

  }

  detectVolumioTouschreenViaUserAgent() {
    // If user agent is volumiokiosk-memorysave we will enable a special mode for low memory devices
    if (this.$window.navigator.userAgent.includes('volumiokiosk')) {
      this.enableVolumioKioskMode = true;
      this.removeHoverEffects();
    }

    if (this.$window.navigator.userAgent.includes('memorysave')) {
      this.enableMemorySavingTouchUi = true;
      this.removeHoverEffects();
    }

    if (this.$window.navigator.userAgent.includes('touch')) {
      this.enableTouchUi = true;
      this.increaseScrollbarWidth();
      this.removeMultiroomDock();
    }
  }

  removeHoverEffects(){
    let style = document.createElement('style');
    style.textContent = '.music-item:hover {background-color: transparent!important;}';
    document.head.append(style);
  }

  increaseScrollbarWidth(){
    let style = document.createElement('style');
    style.textContent = '::-webkit-scrollbar {width: 20px!important;height: 10px!important;}';
    document.head.append(style);
  }

  removeMultiroomDock(){
    let style = document.createElement('style');
    style.textContent = 'div#multiRoomDockWrapper {display: none;}';
    document.head.append(style);
  }

  isVolumioKioskModeEnabled() {
    return this.enableVolumioKioskMode;
  }

  isMemorySavingTouchUiEnabled() {
    return this.enableMemorySavingTouchUi;
  }

  isTouchUiEnabled() {
    return this.enableTouchUi;
  }
}

export default UiSettingsService;
