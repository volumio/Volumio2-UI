class PluginManagerController {
  constructor($scope, socketService, mockService, $log, Upload, $state, modalService, $timeout, $translate) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.Upload = Upload;
    this.$state = $state;
    this.modalService = modalService;
    this.$timeout = $timeout;
    this.$translate = $translate;

    this.activeTab = 0;
    // this.installedPlugins = mockService.get('installedPlugins');
    // console.log(this.installedPlugins);
    // this.availablePlugins = mockService.get('availablePlugins');
    // this.selectedCategory = this.availablePlugins.categories[0];

    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  //TAB INSTALLED PLUGIN -------------------------------------------
  enableDisablePlugin(plugin) {
    let emitPayload = {
      name: plugin.name,
      category: plugin.category,
      action: plugin.active ? 'disable' : 'enable'
    };
    this.$log.debug('emit pluginManager', emitPayload);
    this.socketService.emit('pluginManager', emitPayload);
  }

  showPluginSettings(plugin) {
    this.$state.go('volumio.plugin', {
      pluginName: `${plugin.category}-${plugin.name}`,
      isPluginSettings: true
    });
  }

  //TAB SEARCH PLUGIN ---------------------------------------------
  showPluginCategory(category) {
    this.selectedCategory = category;
  }

  installPlugin(plugin) {
    let emitPayload = {
      url: plugin.url,
      name: plugin.name,
      category: this.selectedCategory.name
    };
    this._openInstallerModal();
    this.$timeout(() => {
      this.$log.debug('emit installPlugin', emitPayload);
      this.socketService.emit('installPlugin', emitPayload);
    }, 300);
  }

  updatePlugin(plugin) {
    let emitPayload = {
      url: plugin.url,
      name: plugin.name,
      prettyName: plugin.prettyName,
      category: this.selectedCategory.name
    };
    this._openInstallerModal();
    this.$timeout(() => {
      this.$log.debug('emit updatePlugin', emitPayload);
      this.socketService.emit('updatePlugin', emitPayload);
    }, 300);
  }

  unInstallPlugin(plugin) {
    let emitPayload = {
      name: plugin.name,
      category: plugin.category
    };
    this.$log.debug('emit preUninstallPlugin', emitPayload);
    this.socketService.emit('preUninstallPlugin', emitPayload);

    this.socketService.on('installPluginStatus', (data) => {
      this.socketService.off('installPluginStatus');
      this._openInstallerModal(data);
    });
  }

  showPluginDetails(plugin) {
    let emitPayload = {
      name: plugin.name,
      category: this.selectedCategory.name
    };
    this.$log.debug('emit getPluginDetails', emitPayload);
    this.socketService.emit('getPluginDetails', emitPayload);
  }

  //TAB UPLOAD PLUGIN
  uploadPlugin() {
    this.Upload.upload({
      url: `${this.socketService.host}/plugin-upload`,
      data: {filename: this.pluginFile}
    }).then((resp) => {
      this.uploadPercentage = false;
    }, (resp) => {
      this.uploadPercentage = false;
      this.$log.debug('Error status: ' + resp.status);
    }, (evt) => {
      this.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
      if (this.uploadPercentage === 100) {
        this.uploadPercentage = false;
        this.activeTab = 0;
        this._openInstallerModal();
      }
    });
  }

  _openInstallerModal(data) {
    this.modalService.openModal(
      'ModalPluginInstallerController',
      'app/plugin-manager/components/modals/modal-plugin-installer.html',
      data,
      'lg');
  }

  registerListner() {
    this.socketService.on('pushInstalledPlugins', (data) => {
      this.$log.debug('pushInstalledPlugins', data);
      this.installedPlugins = data;
    });
    this.socketService.on('pushAvailablePlugins', (data) => {
      this.$log.debug('pushAvailablePlugins', data);
      this.availablePlugins = data;
      this.selectedCategory = this.availablePlugins.categories[0];
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushInstalledPlugins');
      this.socketService.off('pushAvailablePlugins');
    });
  }

  initService() {
    this.socketService.emit('getInstalledPlugins');
    this.socketService.emit('getAvailablePlugins');
  }
}

export default PluginManagerController;
