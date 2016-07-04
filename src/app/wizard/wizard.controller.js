class WizardController {
  constructor($log, $scope, mockService, $state, socketService, $translate, uiSettingsService, CgMailChimpService,
      $window, matchmediaService) {
    'ngInject';
    this.$log = $log;
    this.mockService = mockService;
    this.$state = $state;
    this.$scope = $scope;
    this.socketService = socketService;
    this.$translate = $translate;
    this.$window = $window;
    this.uiSettingsService = uiSettingsService;
    this.CgMailChimpService = CgMailChimpService;
    this.matchmediaService = matchmediaService;
    this.init();
  }


  init() {
    this.$window.contentWrapper.style.zIndex = 5;
    this.$window.wizardScrim.style.display = 'block';
    this.registerListner();
    this.initService();
    this.wizardDetails = {};
    this.wizardData = {
      deviceName: '',
      showI2sOption: false,
      donationAmount: 20,
      customAmount: 150
    };

    //Start mock
    this.wizardDetails = this.mockService.get('wizard');
    this.setBrowserLangAsDefault();
    console.log(this.wizardDetails);
    //End mock

    this.currentStep = this.wizardDetails.steps[0];
    this.wizardData.defaultLanguage = this.wizardDetails.language.defaultLanguage;

    this.$scope.$on('$destroy', () => {
      this.$window.contentWrapper.style.zIndex = 1;
      this.$window.wizardScrim.style.display = 'none';
    });
  }

  gotoStep(step) {
    console.log(step);
    let emitPayload;
    this.$log.log('go from step', this.currentStep.toLowerCase());
    //From step actions
    switch (this.currentStep.toLowerCase()) {
      case 'language':
        this.$log.debug('setLanguage', this.wizardDetails.language);
        this.socketService.emit('setLanguage', this.wizardDetails.language);
        this.$translate.use(this.wizardDetails.language.defaultLanguage.code);
        break;
      case 'name':
        if (this.deviceNameform.$valid) {
          this.$log.debug('setDeviceName', this.wizardData.deviceName.replace(' ', '-'));
          this.socketService.emit('setDeviceName', this.wizardData.deviceName.replace(' ', '-'));
        }
        break;
      case 'output':
        if (this.wizardData.showI2sOption) {
          emitPayload = this.wizardData.selectedI2s;
        } else {
          emitPayload = this.wizardData.selectedDevice;
        }
        this.$log.debug('setOutputDevices', emitPayload);
        this.socketService.emit('setOutputDevices', emitPayload);
        break;
    }

    this.currentStep = step;

    //To step actions
    switch (this.currentStep.toLowerCase()) {
      case 'name':
        if (!this.wizardDetails.deviceName) {
          this.socketService.emit('getDeviceName');
        }
        break;
      case 'output':
        this.socketService.emit('getOutputDevices');
        break;
      case 'done':
        if (!this.wizardDetails.donation) {
          this.socketService.emit('getDonationAmounts');
        }
        break;
    }
  }

  setDonationAmount(amount) {
    this.wizardData.donationAmount = amount;
  }

  subscribeToMailList() {
    if (this.mailListForm.$valid) {
      console.log(this.wizardData.mailListData);
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

  getStepIndex(step = this.currentStep) {
    return this.wizardDetails.steps.indexOf(step);
  }

  isLastStep() {
    return this.getStepIndex(this.currentStep) === this.wizardDetails.steps.length - 1;
  }

  done() {
    if (this.wizardData.showI2sOption) {
      this.$log.log('getFirstConfig {action: "reboot"}');
      this.socketService.emit('getFirstConfig', {action: 'reboot'});
    } else {
      this.$state.go('volumio.playback');
    }
  }

  skipWizard() {
    this.socketService.emit('getFirstConfig', {action: 'skip'});
    this.$state.go('volumio.playback');
  }

  addToBookmark(event) {
    var bookmarkURL = window.location.href;
    var bookmarkTitle = document.title;

    if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
      // Mobile browsers
      window.addToHomescreen({ autostart: false, startDelay: 0 }).show(true);
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

  setBrowserLangAsDefault() {
    const browserLang = this.uiSettingsService.getBrowserDefaultLanguage();
    let isLangAvailable = this.wizardDetails.language.available.find((lang) => {
      return lang.code === browserLang;
    });
    if (isLangAvailable) {
      this.wizardDetails.language.defaultLanguage = isLangAvailable;
    }
  }

  registerListner() {
    this.socketService.on('pushWizardSteps', (data) => {
      this.$log.debug('pushWizardSteps', data);
      // this.wizardDetails.steps = data;
    });

    this.socketService.on('pushAvailableLanguages', (data) => {
      this.$log.debug('pushAvailableLanguages', data);
      // this.wizardDetails.language = data;
      this.setBrowserLangAsDefault();
    });

    this.socketService.on('pushDeviceName', (data) => {
      this.$log.debug('pushDeviceName', data);
      // this.wizardDetails.deviceName = data;
    });

    this.socketService.on('pushOutputDevices', (data) => {
      this.$log.debug('pushOutputDevices', data);
      // this.wizardDetails.pushOutputDevices = data;
    });

    this.socketService.on('pushDonationAmounts', (data) => {
      this.$log.debug('pushDonationAmounts', data);
      // this.wizardDetails.donation = data;
      // this.wizardData.defaultAmount = data.defaultAmount;
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
}

export default WizardController;
