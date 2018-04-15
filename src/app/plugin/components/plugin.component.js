class PluginComponent {
  constructor() {
    'ngInject';
    let component = {
      bindings: {
        pluginName: '=',
        type: '='
      },
      templateUrl: 'app/plugin/components/plugin-component.html',
      controller: PluginComponentController,
      controllerAs: 'pluginComponent'
    };

    return component;
  }
}

class PluginComponentController {
  constructor(
    $rootScope,
    $scope,
    $stateParams,
    socketService,
    modalService,
    mockService,
    uiSettingsService,
    $log,
    $state,
    $window
  ) {
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
  }

  $onInit() {
    this.init();
  }

  saveSection(section) {
    this.$log.debug(section);
    let saveObj = section.onSave;
    if (section.saveButton.data) {
      let data = {};
      section.saveButton.data.forEach(value => {
        let item = section.content.filter(item => {
          return item.id === value;
        })[0];
        if (item) {
          if (item.element === 'equalizer') {
            data[value] = item.config.bars.map(bar => {
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
        section.onSave.askForConfirm
      );
      modalPromise.then(
        yes => {
          delete saveObj.askForConfirm;
          this.socketService.emit('callMethod', saveObj);
        },
        () => {}
      );
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
        item.onClick.askForConfirm
      );
      modalPromise.result.then(
        yes => {
          if (item.onClick.type === 'emit') {
            this.$log.debug('emit', item.onClick.message, item.onClick.data);
            this.socketService.emit(item.onClick.message, item.onClick.data);
          } else {
            this.socketService.emit('callMethod', item.onClick);
          }
        },
        () => {}
      );
    } else {
      if (item.onClick.type === 'emit') {
        this.$log.debug('emit', item.onClick.message, item.onClick.data);
        this.socketService.emit(item.onClick.message, item.onClick.data);
      } else if (item.onClick.type === 'openUrl'){
        this.$window.open(item.onClick.url);
      } else if (item.onClick.type === 'goto'){
        this.$state.go('volumio.static-page', {pageName: item.onClick.pageName});
      } else {
        this.socketService.emit('callMethod', item.onClick);
      }
    }
  }

  openDoc(item) {
    let modalPromise = this.modalService.openModal(
      'ModalGotitController',
      'app/components/modals/modal-gotit.html',
      { message: item.doc },
      'lg',
      true
    );
  }

  init() {
    this.showPlugin = false;
    this.registerListner();
    this.initService();
    this.initWatchers();
  }

  changePlugin() {
    this.showPlugin = false;
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushUiConfig', data => {
      //NOTE this commented lines are for testing pourpose
      // data.sections.unshift({coreSection: 'ui-settings'});
      // data.sections.unshift({coreSection: 'wifi'});
      // data.sections.unshift({coreSection: 'my-music'});
      // data.sections.unshift({coreSection: 'network-status'});
      // data.sections.unshift({coreSection: 'network-drives'});
      // data.sections.unshift({coreSection: 'firmware-upload'});
      this.$log.debug('pushUiConfig', data);
      this.pluginObj = data;
      this.pluginObj.host = this.socketService.host;
      if (
        !this.pluginObj.page.passwordProtection ||
        !this.pluginObj.page.passwordProtection.enabled
      ) {
        this.showPlugin = true;
      } else {
        // Show PW modal
        let templateUrl = 'app/components/modals/modal-password.html',
          controller = 'ModalPasswordController',
          params = {
            message: this.pluginObj.page.passwordProtection.message || '',
            pluginName: this.pluginName
          };
        let modalPromise = this.modalService.openModal(
          controller,
          templateUrl,
          params,
          'sm'
        );

        modalPromise.result.then(
          canEnter => {
            if (canEnter) {
              this.showPlugin = true;
            }
          },
          () => {
            this.$state.go('volumio.playback');
          }
        );
      }
    });
  }

  initWatchers() {
    this.watchersHandeler = this.$scope.$watch(() => this.pluginName, (newVal, oldVal) => {
      if (newVal && newVal !== oldVal) {
        this.changePlugin();
      }
    });
  }

  $onDestroy() {
    this.socketService.off('pushUiConfig');
    this.watchersHandeler();
  }

  initService() {
    if (this.type === 'wizardPlugin') {
      this.socketService.emit('getWizardUiConfig', { page: this.pluginName });
    } else {
      this.socketService.emit('getUiConfig', { page: this.pluginName });
    }
  }
}

export default PluginComponent;
