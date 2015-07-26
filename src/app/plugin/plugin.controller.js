class PluginController {
  constructor ($stateParams, socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    //console.log($stateParams);
    this.$stateParams = $stateParams;
    this.pluginObj = mockService.get('getSettings');
    ///init();
  }

  saveSection(section) {
    let saveObj = {
      method: section.onSave,
      plugin: section.plugin
    }
    if (section.saveButton.values) {
      let values = {};
      section.saveButton.values.forEach((value) => {
        let item = section.content.filter((item) => {
          return item.id === value;
        })[0];
        if (item) {
          values[value] = item.value;
        }
      });
      saveObj.values = values;
    }
    console.info(saveObj);
    this.socketService.emit('callPluginMethod', saveObj);
  }

  saveButton(item) {
    let saveObj = {
      method: item.onClick,
      plugin: item.plugin
    }
    console.info(saveObj);
    this.socketService.emit('callPluginMethod', saveObj);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushConfPage', (data) => {
     //console.log(data);
     this.pluginObj = data;
    });
  }

  initService() {
    //this.socketService.emit('playerInit');
    this.socketService.emit('getConfPage', this.$stateParams.pluginName);
  }



}

export default PluginController;
