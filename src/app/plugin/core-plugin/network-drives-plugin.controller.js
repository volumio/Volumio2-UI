class NetworkDrivesPluginController {
  constructor(socketService, mockService) {
    'ngInject';
    this.drive = {};
    this.socketService = socketService;
    //this.infoShare = mockService.get('infoShare');
    //this.listUsbDrives = mockService.get('listUsbDrives');
    this.init();
  }

  saveDrive() {
    console.log('newDrive', this.drive);
    this.socketService.emit('addShare', this.drive);
  }

  editDrive(drive) {
    this.drive = drive;
  }

  deleteDrive(drive) {
    this.socketService.emit('deleteShare', {id: drive.id});
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushInfoShare', (data) => {
      console.log('infoShare', data);
      this.infoShare = data;
    });
    this.socketService.on('pushListUsbDrives', (data) => {
      console.log('listUsbDrives', data);
      this.listUsbDrives = data;
    });
  }

  initService() {
    this.socketService.emit('getInfoShare');
    this.socketService.emit('getListUsbDrives');
  }
}

export default NetworkDrivesPluginController;
