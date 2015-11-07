class NetworkDrivesPluginController {
  constructor (socketService) {
    'ngInject';
    this.drive = {};
    this.socketService = socketService;
    this.infoShare = [
      {
        name: 'SHARE su 192.168.10.35',
        id: 'suasianure',
        mounted: 'true',
        size: '40 GB',
      },
      {
        name: 'SHARE su 192.168.10.99',
        id: 'id nuovo',
        mounted: 'false',
        size: '450 GB',
      }
    ];
    this.listUsbDrives = [
      {
        name: 'Transcend',
        size: '2gb',
        freespace:'3gb'
      },
      {
        name: 'Sandisk',
        size: '2gb',
        freespace:'3gb'
      }
    ];
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
      //this.infoShare = data;
    });
    this.socketService.on('pushListUsbDrives', (data) => {
      console.log('listUsbDrives', data);
      //this.listUsbDrives = data;
    });
  }

  initService() {
    //this.socketService.emit('getInfoShare');
    this.socketService.emit('getListUsbDrives');
  }
}

export default NetworkDrivesPluginController;
