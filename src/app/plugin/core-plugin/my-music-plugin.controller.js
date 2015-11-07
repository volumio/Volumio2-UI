class MyMusicPluginController {
  constructor (socketService) {
    'ngInject';
    this.socketService = socketService;
    //this.myCollectionStats = {artists: '12', albums: '23', songs: '67', playtime: '10h'};
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
