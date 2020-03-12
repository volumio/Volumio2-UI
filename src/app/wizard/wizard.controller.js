class WizardController {
  constructor($log, $scope, mockService, $state, socketService, $translate, uiSettingsService,
      $window, matchmediaService, themeManager, modalService, $filter) {
    'ngInject';
    this.$log = $log;
    this.mockService = mockService;
    this.$state = $state;
    this.$scope = $scope;
    this.socketService = socketService;
    this.$translate = $translate;
    this.$window = $window;
    this.uiSettingsService = uiSettingsService;
    this.matchmediaService = matchmediaService;
    this.modalService = modalService;
    this.filteredTranslate = $filter('translate');
    this.themeManager = themeManager;
    this.init();
  }


  init() {
    this.$window.contentWrapper.style.zIndex = 5;
    this.$window.wizardScrim.style.display = 'block';
    this.registerListner();
    this.initService();
    this.wizardDetails = {
      steps: []
    };
    this.wizardData = {
      deviceName: '',
      showI2sOption: false
    };

    //Start mock
    // this.wizardDetails = this.mockService.get('wizard');
    // let browserLanguage = this.setBrowserLangAsDefault();
    // console.log(this.wizardDetails);
    //End mock



    this.$scope.$on('$destroy', () => {
      this.$window.contentWrapper.style.zIndex = 1;
      this.$window.wizardScrim.style.display = 'none';
    });
  }

  gotoStep(step) {
    let emitPayload;
    this.$log.log('go from step', this.currentStep.name.toLowerCase());
    //From step actions
    switch (this.currentStep.name.toLowerCase()) {
      case 'language':
        this.$log.debug('setLanguage', this.wizardDetails.language);
        this.wizardDetails.language.disallowReload = true;
        this.socketService.emit('setLanguage', this.wizardDetails.language);
        //Prefetching network scan
        this.socketService.emit('getWirelessNetworks', '');
        this.$translate.use(this.wizardDetails.language.defaultLanguage.code);
        break;
      case 'name':
        if (this.deviceNameform.$valid) {
          this.$log.debug('setDeviceName', this.wizardDetails.deviceName);
          this.socketService.emit('setDeviceName', this.wizardDetails.deviceName);
        }
        break;
      case 'output':
        if (this.wizardDetails.outputDevices.i2s && this.wizardDetails.outputDevices.i2s.enabled) {
          emitPayload = {
            'i2s': true,
            'i2sid': {
              'value': this.wizardData.selectedI2s.id,
              'label': this.wizardData.selectedI2s.name
            },
            'output_device': {
              'value': 1,
              'label': this.wizardData.selectedI2s.name
            }
          };
        } else {
          emitPayload = {
            'i2s': false,
            'output_device': {
              'value': this.wizardData.selectedDevice.id,
              'label': this.wizardData.selectedDevice.name
            }
          };
        }
        this.$log.debug('setOutputDevices', emitPayload);
        this.socketService.emit('setOutputDevices', emitPayload);
        break;
        case 'advancedsettings':
          this.$log.debug('setExperienceAdvancedSettings', this.wizardDetails.experienceAdvancedSettings.status.id);
          this.socketService.emit('setExperienceAdvancedSettings', this.wizardDetails.experienceAdvancedSettings.status.id);
        break;
    }

    this.currentStep = step;

    //To step actions
    switch (this.currentStep.name.toLowerCase()) {
      case 'name':
        if (!this.wizardDetails.deviceName) {
          this.socketService.emit('getDeviceName');
        }
        break;
      case 'output':
        this.socketService.emit('getOutputDevices');
        break;
      case 'advancedsettings':
        this.socketService.emit('getExperienceAdvancedSettings');
        break;
      case 'done':
        this.socketService.emit('getDonePage');
        break;
    }
  }

  setDonationAmount(amount) {
    this.wizardData.donationAmount = amount;
  }

  subscribeToMailList() {
    if (this.mailListForm.$valid) {
      this.CgMailChimpService.subscribe(this.wizardData.mailListData)
      .then(() => {
          this.wizardData.mailListSubscribed = true;
        },
        (reason) => {
          this.$log.log('Mailchimp subscription error', reason);
        });
    }
  }

  gotoNextStep() {
    this.gotoStep(this.wizardDetails.steps[this.getStepIndex() + 1]);
  }

  gotoPrevStep() {
    this.gotoStep(this.wizardDetails.steps[this.getStepIndex() - 1]);
  }

  getStepIndex(step = this.currentStep) {
    return this.wizardDetails.steps.indexOf(step);
  }

  isLastStep() {
    return this.getStepIndex(this.currentStep) === this.wizardDetails.steps.length - 1;
  }

  isFirstStep() {
    return this.getStepIndex(this.currentStep) === 0;
  }

  getStepPos() {
    return (this.getStepIndex(this.currentStep)+1) + '/' + this.wizardDetails.steps.length;
  }

  done() {
    this.$state.go('volumio.playback');
    this.socketService.emit('setWizardAction', {action: 'close'});
  }

  skipWizard() {
    this.socketService.emit('setWizardAction', {action: 'skip'});
    this.$state.go('volumio.playback');
  }

  addToBookmark(event) {
    let bookmarkURL = window.location.href;
    let bookmarkTitle = document.title;

    if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
      // Mobile browsers
      window.addToHomescreen({autostart: false, startDelay: 0}).show(true);
    } else if (window.sidebar && window.sidebar.addPanel) {
      // Firefox version < 23
      window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
    } else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
      // Firefox version >= 23 and Opera Hotlist
      $(this).attr({
        href: bookmarkURL,
        title: bookmarkTitle,
        rel: 'sidebar'
      }).off(event);
      return true;
    } else if (window.external && ('AddFavorite' in window.external)) {
      // IE Favorite
      window.external.AddFavorite(bookmarkURL, bookmarkTitle);
    } else {
      // Other browsers (mainly WebKit - Chrome/Safari)
      alert('Press ' + (/Mac/i.test(navigator.userAgent) ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
    }
  }

  donate(currency) {
    let
      templateUrl = 'app/components/modals/modal-crypto.html',
      controller = 'ModalCryptoController',
      params = {name:'Bitcoin',address:'3HxbUDkrQAuX2XPPLg8xYNuEA8tJ2s6UjF'};
      switch(currency) {
    case 'ltc':
        params = {name:'Litecoin',address:'LKjJWNwYMGfhmCRBj11yLFjfM1yG3TKTCZ', alias: 'ltc'};
        break;
        case 'xrp':
        params = {name:'Ripple',address:'rnCRvU45awv3ZySymzLCLFq3HCKfma2Utb', alias: 'xrp'};
        break;
    default:
        params = {name:'Bitcoin',address:'3HxbUDkrQAuX2XPPLg8xYNuEA8tJ2s6UjF', alias: 'btc'};
}
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'md');
  }


  setBrowserLangAsDefault() {
    const browserLang = this.uiSettingsService.getBrowserDefaultLanguage();
    let isLangAvailable = this.wizardDetails.language.available.find((lang) => {
      return lang.code === browserLang;
    });
    if (isLangAvailable) {
      this.wizardDetails.language.defaultLanguage = isLangAvailable;
      this.$translate.use(isLangAvailable.code);
    } else {
      this.$translate.use('en');
    }
  }

  setDeviceCode() {
    var emitPayload = {code: this.wizardDetails.deviceCode.code};
    this.socketService.emit('setDeviceActivationCode', emitPayload);
  }

  registerListner() {
    this.socketService.on('pushWizardSteps', (data) => {
      this.$log.debug('pushWizardSteps', data);
      this.wizardDetails.steps = data;
      this.currentStep = this.wizardDetails.steps[0];
    });

    this.socketService.on('pushAvailableLanguages', (data) => {
      this.$log.debug('pushAvailableLanguages', data);
      this.wizardDetails.language = data;
      this.wizardData.defaultLanguage = this.wizardDetails.language.defaultLanguage.code;
      this.setBrowserLangAsDefault();
    });

    this.socketService.on('pushDeviceName', (data) => {
      this.$log.debug('pushDeviceName', data);
      this.wizardDetails.deviceName = data;
    });

    this.socketService.on('pushOutputDevices', (data) => {
      this.$log.debug('pushOutputDevices', data);
      this.wizardDetails.outputDevices = data;
      this.wizardData.selectedDevice = {name: data.devices.active.name, id: data.devices.active.id};
      if (data.i2s && data.i2s.enabled) {
        this.wizardData.selectedI2s = {name: data.i2s.active};
      }
    });

    this.socketService.on('pushDonePage', (data) => {
      this.$log.debug('pushDonePage', data);
      this.wizardDetails.done = data;
      if (data.donation) {
        this.setDonationAmount(data.donationAmount.donationAmount);
      }
    });

    this.socketService.on('pushDeviceActivationCodeResult', (data) => {
      this.$log.debug('pushDeviceActivationCodeResult', data);
      this.wizardDetails.deviceCode.activated = data.activated;
      this.wizardDetails.deviceCode.error = data.error;
    });

    this.socketService.on('pushExperienceAdvancedSettings', (data) => {
      this.$log.debug('pushExperienceAdvancedSettings', data);
      this.wizardDetails.experienceAdvancedSettings = data;
    });

    this.socketService.on('closeWizard', () => {
      this.$log.debug('closeWizard');
      this.$state.go('volumio.playback');
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushWizardSteps');
      this.socketService.off('pushAvailableLanguages');
      this.socketService.off('pushDeviceName');
    });
  }

  initService() {
    this.socketService.emit('getWizardSteps');
    this.socketService.emit('getAvailableLanguages');

  }

  isVolumio3Theme(){
    return this.themeManager.theme === 'volumio3';
  }
}

export default WizardController;
