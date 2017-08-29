class PluginController {
  constructor($rootScope, $scope, $stateParams, socketService, modalService, mockService, $log, $state,
      uiSettingsService, $window) {
    'ngInject';
    this.socketService = socketService;
    this.$stateParams = $stateParams;
    this.modalService = modalService;
    this.mockService = mockService;
    this.$scope = $scope;
    this.$log = $log;
    this.$state = $state;
    this.uiSettingsService = uiSettingsService;
    this.$window = $window;
    // this.pluginObj = this.mockService.get('getSettings');
    // this.$log.debug(this.pluginObj);
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
          if (item.element === 'equalizer') {
            data[value] = item.config.bars.map((bar) => {
              return bar.value;
            });
          } else {
            data[value] = item.value;
          }
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
      modalPromise.result.then((yes) => {
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
      modalPromise.result.then((yes) => {
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
      } else if (item.onClick.type === 'openUrl'){
        this.$window.open(item.onClick.url);
      } else {
        this.socketService.emit('callMethod', item.onClick);
      }
    }
  }

  openDoc(item) {
    let modalPromise = this.modalService.openModal(
        'ModalGotitController',
        'app/components/modals/modal-gotit.html',
        {message: item.doc},
        'lg',
        true
        );
  }

  init() {
    this.showPlugin = false;
    this.pluginName = this.$stateParams.pluginName.replace('-', '/');
    this.registerListner();
    this.initService();
  }


  registerListner() {
    this.socketService.on('pushUiConfig', (data) => {
      //NOTE this commented lines are for testing pourpose
      // data.sections.unshift({coreSection: 'ui-settings'});
      // data.sections.unshift({coreSection: 'wifi'});
      // data.sections.unshift({coreSection: 'my-music'});
      // data.sections.unshift({coreSection: 'network-status'});
      // data.sections.unshift({coreSection: 'network-drives'});
      // data.sections.unshift({coreSection: 'firmware-upload'});
      this.$log.debug('pushUiConfig', data);
      this.pluginObj = data;
      if (!this.pluginObj.page.passwordProtection || !this.pluginObj.page.passwordProtection.enabled) {
        this.showPlugin = true;
      } else {
        // Show PW modal
        let
          templateUrl = 'app/components/modals/modal-password.html',
          controller = 'ModalPasswordController',
          params = {
            message: this.pluginObj.page.passwordProtection.message || '',
            pluginName: this.pluginName
          };
        let modalPromise = this.modalService.openModal(
          controller,
          templateUrl,
          params,
          'sm');

        modalPromise.result.then((canEnter) => {
          if (canEnter) {
            this.showPlugin = true;
          }
        }, () => {
          this.$state.go('volumio.playback');
        });
      }
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushUiConfig');
    });
  }

  initService() {
    this.$log.debug('init', this.$stateParams);
    this.socketService.emit('getUiConfig',
        {'page': this.pluginName});
  }
}

export default PluginController;
