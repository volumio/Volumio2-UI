class PluginController {
  constructor ($rootScope, $stateParams, socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    //console.log($stateParams);
    this.$stateParams = $stateParams;
    //this.pluginObj = mockService.get('getSettings');
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
    console.info(item.onSave);
    this.socketService.emit('callMethod', item.onSave);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushUiConfig', (data) => {
     console.log(data);
     this.pluginObj = data;
    });
  }

  initService() {
    //this.socketService.emit('playerInit');
    let testObj = {"page": "network"};
    //console.log(testObj);
    this.socketService.emit('getUiConfig', testObj);
  }
}

export default PluginController;
