class NetworkDrivesPluginController {
  constructor(socketService, modalService, mockService) {
    'ngInject';
    this.drive = {};
    this.socketService = socketService;
    this.modalService = modalService;
    // this.infoShare = mockService.get('infoShare');
    // this.listUsbDrives = mockService.get('listUsbDrives');
    this.inAddDrive = false;
    this.driveTypes = ['cifs', 'nifs'];
    this.init();
  }

  saveAddEditDrive() {
    if (this.inAddDrive) {
      console.log('addShare', this.drive);
      this.socketService.emit('addShare', this.drive);
    } else {
      console.log('editShare', this.drive);
      this.socketService.emit('editShare', this.drive);
    }
  }

  cancelAddEditDrive() {
    this.inAddDrive = false;
    this.inEditDrive = false;
  }

  addDrive() {
    this.drive = {};
    this.inAddDrive = true;
    this.inEditDrive = false;
  }


  editDrive(drive, index) {
    console.log('edit', index);
    this.inEditDrive = index;
    this.inAddDrive = false;
    this.drive = drive;
  }

  deleteDrive(drive) {
    let modalPromise = this.modalService.openModal(
      'ModalConfirmController',
      'app/components/modals/modal-confirm.html',
      {title: 'Delete drive', message: 'Do you want to delete "' + drive.id + '" ?'});
    modalPromise.then((yes) => {
      console.log('deleteShare', {id: drive.id});
      this.socketService.emit('deleteShare', {id: drive.id});
    }, () => {});
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
