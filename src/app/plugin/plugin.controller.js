class PluginController {
  constructor($rootScope, $stateParams, socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    this.$stateParams = $stateParams;
    this.init();
  }

  saveSection(section) {
    let saveObj = section.onSave;
    if (section.saveButton.data) {
      let data = {};
      section.saveButton.data.forEach((value) => {
        let item = section.content.filter((item) => {
          return item.id === value;
        })[0];
        if (item) {
          data[value] = item.value;
        }
      });
      saveObj.data = data;
    }
    console.info(saveObj);
    this.socketService.emit('callMethod', saveObj);
  }

  saveButton(item) {
    console.info(item.onClick);
    if (item.onClick.type === 'emit') {
      console.log('emit', item.onClick.message, item.onClick.data);
      this.socketService.emit('updateCheck', 'search-for-upgrade');
    } else {
      this.socketService.emit('callMethod', item.onClick);
    }
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushUiConfig', (data) => {
      //data.sections.unshift({coreSection: 'wifi'});
      //data.sections.unshift({coreSection: 'my-music'});
      //data.sections.unshift({coreSection: 'network-drives'});
      console.log('pushUiConfig', data);
      this.pluginObj = data;
    });
  }

  initService() {
    this.socketService.emit('getUiConfig',
        {'page': this.$stateParams.pluginName.replace('-', '/')});
  }
}

export default PluginController;
