class SettingsController {
  constructor (socketService, loggerService, mockService) {
    'ngInject';
    this.socketService = socketService;
    this.loggerService = loggerService;
    this.pluginObj = mockService.get('getSettings');
    //this.SettingsStructure = mockService.get('getSettingsStructure');
  }
}

export default SettingsController;
