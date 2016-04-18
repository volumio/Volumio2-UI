class PluginsPluginController {
  constructor($scope, socketService, mockService, $log) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.installedPlugins = mockService.get('installedPlugins');
    console.log(this.installedPlugins);
    this.installablePlugins = mockService.get('installablePlugins');
    this.selectedCategory = this.installablePlugins.categories[0];

    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  //TAB PLUGIN INSTALLED
  enableDisablePlugin(plugin) {
    let emitPayload = {
      name: plugin.name,
      active: plugin.active
    };
    this.$log.debug('emit enableDisablePlugin', emitPayload);
    this.socketService.emit('enableDisablePlugin', emitPayload);
  }

  //TAB INSTALL PLUGIN
  showPluginCategory(category) {
    this.selectedCategory = category;
  }

  installPlugin(plugin) {
    let emitPayload = {
      uri: plugin.url
    };
    this.$log.debug('emit installPlugin', emitPayload);
    this.socketService.emit('installPlugin', emitPayload);
  }

  showPluginDetails(plugin) {
    let emitPayload = {
      uri: plugin.url
    };
    this.$log.debug('emit getPluginDetails', emitPayload);
    this.socketService.emit('getPluginDetails', emitPayload);
  }

  registerListner() {
    this.socketService.on('pushInstalledPlugins', (data) => {
      this.$log.debug('pushInstalledPlugins', data);
      this.installedPlugins = data;
    });
    this.socketService.on('pushInstallablePlugins', (data) => {
      this.$log.debug('pushInstallablePlugins', data);
      this.installablePlugins = data;
    });
    // this.$scope.$on('$destroy', () => {
    //   this.socketService.off('pushWirelessNetworks');
    // });
  }

  initService() {
    this.socketService.emit('getInstalledPlugins');
    this.socketService.emit('getInstallablePlugins');
  }
}

export default PluginsPluginController;
