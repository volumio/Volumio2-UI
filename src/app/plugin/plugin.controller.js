class PluginController {
  constructor($stateParams) {
    'ngInject';
    this.$stateParams = $stateParams;
    this.init();
  }

  init() {
    this.pluginName = this.$stateParams.pluginName.replace('-', '/');
  }
}

export default PluginController;
