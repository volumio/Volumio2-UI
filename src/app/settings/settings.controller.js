class SettingsController {
  constructor (socketService, loggerService) {
    'ngInject';
    this.socketService = socketService;
    this.loggerService = loggerService;
  }
}

export default SettingsController;
