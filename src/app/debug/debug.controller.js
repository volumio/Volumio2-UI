class SettingsController {
  constructor(socketService, loggerService, mockService, toastMessageService, modalService, $log) {
    'ngInject';
    this.socketService = socketService;
    this.loggerService = loggerService;
    this.toastMessageService = toastMessageService;
    this.modalService = modalService;
    this.$log = $log;

    this.pluginObj = mockService.get('getSettings');
    this.apiMethod = 'State';
    //this.SettingsStructure = mockService.get('getSettingsStructure');
  }

  openModal() {
    this.modalService.openModal();
  }

  callApi() {
    this.$log.debug('called', this.apiMethod);
    let listener = 'push' + this.apiMethod;
    if (socket.listeners(listener).length <= 2) {
      this.socketService.on(listener , (data) => {
        this.$log.debug('TEST API->' + listener, data);
      });
    }
    this.socketService.emit('get' + this.apiMethod);
  }
}

export default SettingsController;
