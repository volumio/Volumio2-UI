class SettingsController {
  constructor (socketService, loggerService, mockService) {
    'ngInject';
    this.socketService = socketService;
    this.loggerService = loggerService;

    this.SettingsStructure = mockService.get('getSettingsStructure');
  }
}

export default SettingsController;
