class MyMusicPluginController {
  constructor(socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    //this.myCollectionStats = mockService.get('myCollectionStats');
    this.init();
  }

  rescanLibrary() {
    this.socketService.emit('rescanDb');
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMyCollectionStats', (data) => {
      console.log('pushMyCollectionStats', data);
      this.myCollectionStats = data;
    });
  }

  initService() {
    this.socketService.emit('getMyCollectionStats');
  }
}

export default MyMusicPluginController;
