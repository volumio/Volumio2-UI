class PluginController {
  constructor($rootScope, $scope, $stateParams, socketService, modalService, mockService, $log, $translate) {
    'ngInject';
    this.socketService = socketService;
    this.$stateParams = $stateParams;
    this.modalService = modalService;
    this.mockService = mockService;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    //this.pluginObj = this.mockService.get('getSettings');
    //this.$log.debug(this.pluginObj);
    //this.pluginObj.sections.unshift({coreSection: 'system-version'});
    this.init();
  }

  saveSection(section) {
    this.$log.debug(section);
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
    this.$log.debug(saveObj);
    if (section.onSave.askForConfirm) {
      let modalPromise = this.modalService.openModal(
        'ModalConfirmController',
        'app/components/modals/modal-confirm.html',
        section.onSave.askForConfirm);
      modalPromise.then((yes) => {
        delete saveObj.askForConfirm;
        this.socketService.emit('callMethod', saveObj);
      }, () => {});
    } else {
      this.socketService.emit('callMethod', saveObj);
    }
  }

  saveButton(item) {
    this.$log.debug(item);
    if (item.onClick.askForConfirm) {
      let modalPromise = this.modalService.openModal(
        'ModalConfirmController',
        'app/components/modals/modal-confirm.html',
        item.onClick.askForConfirm);
      modalPromise.then((yes) => {
        if (item.onClick.type === 'emit') {
          this.$log.debug('emit', item.onClick.message, item.onClick.data);
          this.socketService.emit(item.onClick.message, item.onClick.data);
        } else {
          this.socketService.emit('callMethod', item.onClick);
        }
      }, () => {});
    } else {
      if (item.onClick.type === 'emit') {
        this.$log.debug('emit', item.onClick.message, item.onClick.data);
        this.socketService.emit(item.onClick.message, item.onClick.data);
      } else {
        this.socketService.emit('callMethod', item.onClick);
      }
    }
  }

  init() {
    this.registerListner();
    this.initService();
  }


  registerListner() {
    this.socketService.on('pushUiConfig', (data) => {
      // data.sections.unshift({coreSection: 'ui-settings'});
      // data.sections.unshift({coreSection: 'wifi'});
      // data.sections.unshift({coreSection: 'my-music'});
      // data.sections.unshift({coreSection: 'network-status'});
      // data.sections.unshift({coreSection: 'network-drives'});
      this.$log.debug('pushUiConfig', data);
      this.pluginObj = data;
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushUiConfig');
    });
  }

  initService() {
    this.$log.debug('init', this.$stateParams);
    this.socketService.emit('getUiConfig',
        {'page': this.$stateParams.pluginName.replace('-', '/')});
  }
}

export default PluginController;
