class SettingsController {
  constructor(socketService, loggerService, mockService, toastMessageService, modalService) {
    'ngInject';
    this.socketService = socketService;
    this.loggerService = loggerService;
    this.toastMessageService = toastMessageService;
    this.modalService = modalService;
    this.pluginObj = mockService.get('getSettings');
    this.apiMethod = 'State';
    //this.SettingsStructure = mockService.get('getSettingsStructure');
  }

  openModal() {
    this.modalService.openModal();
  }

  callApi() {
    console.log('called', this.apiMethod);
    let listener = 'push' + this.apiMethod;
    if (socket.listeners(listener).length <= 2) {
      this.socketService.on(listener , (data) => {
        console.info('TEST API->' + listener, data);
      });
    }
    this.socketService.emit('get' + this.apiMethod);
  }
}

export default SettingsController;
