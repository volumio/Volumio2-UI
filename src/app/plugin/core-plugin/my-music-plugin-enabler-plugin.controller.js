class MyMusicPluginEnablerController {
  constructor($scope, socketService, mockService, $log, $state, matchmediaService) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.$state = $state;
    this.matchmediaService = matchmediaService;
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  enableDisableMyMusicPlugin(plugin) {
    this.$log.debug('enableDisableMyMusicPlugins',plugin);
    this.socketService.emit('enableDisableMyMusicPlugin', plugin);
  }

  showMyMusicPluginSettings(plugin) {
    this.$log.debug('showMyMusicPluginSettings',plugin);
    this.$state.go('volumio.plugin', {
      pluginName: `${plugin.category}-${plugin.name}`,
      isPluginSettings: true
    });

  }

  registerListner() {
    this.socketService.on('pushMyMusicPlugins', (data) => {
      this.$log.debug('pushMyMusicPlugins', data);
      this.plugins = data;
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushMyMusicPlugins');
    });
  }

  initService() {
    this.socketService.emit('getMyMusicPlugins');
  }
}

export default MyMusicPluginEnablerController;
