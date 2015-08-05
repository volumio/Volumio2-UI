class SettingsController {
  constructor (socketService, loggerService, mockService, toastMessageService, modalService) {
    'ngInject';
    this.socketService = socketService;
    this.loggerService = loggerService;
    this.toastMessageService = toastMessageService;
    this.modalService = modalService;
    this.pluginObj = mockService.get('getSettings');
    //this.SettingsStructure = mockService.get('getSettingsStructure');
  }
}

export default SettingsController;
