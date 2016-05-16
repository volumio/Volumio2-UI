class ThemePluginController {
  constructor($scope, socketService, mockService, $log, themeManager, $document, Upload) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.$document = $document;
    this.themeManager = themeManager;
    this.Upload = Upload;
    //this.wirelessNetworks = mockService.get('wirelessNetworks');
    this.defaultBackgroundUrl =
        `${socketService.host}/app/themes/${themeManager.theme}/assets/graphics/${themeManager.theme}-bg.png`;
    console.log(this.defaultBackgroundUrl);
    this.init();
  }

  selectBackground(background) {
    this.$log.debug('setBackgrounds', background);
    this.socketService.emit('setBackgrounds', background);
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
      console.log(evt, 'aa');
        this.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
        if (this.uploadPercentage === 100) {
          this.uploadPercentage = false;
        }
    });
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushBackgrounds', (data) => {
      this.$log.debug('pushBackgrounds', data);
      this.backgrounds = data;
      this.backgrounds.list = [{
        path: this.defaultBackgroundUrl,
        thumbnail: this.defaultBackgroundUrl,
        notDeletable: true,
        name: 'Default'}]
        .concat(data.available.map((background) => {
          background.path = `${this.socketService.host}/backgrounds/${background.path}`;
          background.thumbnail = `${this.socketService.host}/backgrounds/${background.thumbnail}`;
          return background;
        }));
      console.log(this.backgrounds.list);
      if (data.current.name === 'Default') {
        this.backgroundUrl = this.defaultBackgroundUrl;
        this.$document[0].body.style.background = `#333 url(${this.defaultBackgroundUrl}) repeat top left`;
      } else {
        this.backgroundUrl = data.current.path;
        console.log(`${data.current.path}`);
        this.$document[0].body.style.background = `#333 url(${data.current.path}) no-repeat center center`;
        this.$document[0].body.style.backgroundSize = 'cover';
      }
      // this.$document[0].body.style.background = `#333 url(${this.defaultBackgroundUrl}) repeat top left`;
      // this.$document[0].body.style.backgroundSize = 'cover';
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushBackgrounds');
    });
  }

  initService() {
    this.socketService.emit('getBackgrounds');
  }
}

export default ThemePluginController;
