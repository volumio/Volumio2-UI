class PluginManagerController {
  constructor($scope, socketService, mockService, $log, Upload, $state) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.Upload = Upload;
    this.$state = $state;

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
      active: plugin.active
    };
    this.$log.debug('emit enableDisablePlugin', emitPayload);
    this.socketService.emit('enableDisablePlugin', emitPayload);
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
    this.$log.debug('emit installPlugin', emitPayload);
    this.socketService.emit('installPlugin', emitPayload);
  }

  updatePlugin(plugin) {
    let emitPayload = {
      url: plugin.url,
      name: plugin.name,
      category: this.selectedCategory.name
    };
    this.$log.debug('emit updatePlugin', emitPayload);
    this.socketService.emit('updatePlugin', emitPayload);
  }

  unInstallPlugin(plugin) {
    let response = confirm(`Do you want to delete this plugin: ${plugin.name} ?`);
    if (!response) {
        return false;
    }
    let emitPayload = {
      name: plugin.name,
      category: this.selectedCategory.name
    };
    this.$log.debug('emit unInstallPlugin', emitPayload);
    this.socketService.emit('unInstallPlugin', emitPayload);
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
    console.log(this.pluginFile);
    this.Upload.upload({
        url: 'upload/url',
        data: {plugin: this.pluginFile}
    }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
        console.log('Error status: ' + resp.status);
    }, function (evt) {
        this.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + this.uploadPercentage + '% ' + evt.config.data.file.name);
    });
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
    this.socketService.on('installPluginStatus', (data) => {
      this.$log.debug('installPluginStatus', data);
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushInstalledPlugins');
      this.socketService.off('pushAvailablePlugins');
      this.socketService.off('installPluginStatus');
    });
  }

  initService() {
    this.socketService.emit('getInstalledPlugins');
    this.socketService.emit('getAvailablePlugins');
  }
}

export default PluginManagerController;
