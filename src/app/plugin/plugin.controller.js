class PluginController {
  constructor($stateParams) {
    'ngInject';
    this.pluginName = $stateParams.pluginName.replace('-', '/');
  }
}

export default PluginController;
