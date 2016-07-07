class UiSettingsPluginController {
  constructor($scope, socketService, mockService, $log, themeManager, $document, Upload, uiSettingsService) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.$document = $document;
    this.themeManager = themeManager;
    this.Upload = Upload;
    this.uiSettingsService = uiSettingsService;

    this.init();
  }

  selectBackground(background) {
    this.$log.debug('setBackgrounds', background);
    this.socketService.emit('setBackgrounds', background);
  }

  selectBackgroundColor(color) {
    if (color.length >= 4) {
      this.socketService.emit('setBackgrounds', {color});
    }
  }

  deleteBackground(background) {
    this.$log.debug('deleteBackground', background);
    this.socketService.emit('deleteBackground', background);
  }

  uploadBackground() {
    this.Upload.upload({
        url: `${this.socketService.host}/backgrounds-upload`,
        data: {filename: this.backgroundFile}
    }).then((resp) => {
      this.uploadPercentage = false;
    }, (resp) => {
      this.uploadPercentage = false;
      this.$log.debug('Error status: ' + resp.status);
    }, (evt)  => {
        this.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
        if (this.uploadPercentage === 100) {
          this.uploadPercentage = false;
        }
    });
  }

  init() {
    this.registerListner();
    this.initService();
    this.backgroundColorSet = ['#000', '#999', '#CCC', '#C44', '#CAF', '#388'];
    let isCustomColor = !this.backgroundColorSet.find((color) => {
      return this.uiSettingsService.uiSettings.color && color === this.uiSettingsService.uiSettings.color;
    });
    if (this.uiSettingsService.uiSettings.color && isCustomColor) {
      this.customBackgroundColor = this.uiSettingsService.uiSettings.color;
    } else {
      this.customBackgroundColor = '#DDD';
    }
  }

  registerListner() {
  }

  initService() {
    this.socketService.emit('getBackgrounds');
  }
}

export default UiSettingsPluginController;
