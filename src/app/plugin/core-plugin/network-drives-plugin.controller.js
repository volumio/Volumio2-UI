class NetworkDrivesPluginController {
  constructor($scope, socketService, modalService, mockService, toastMessageService, $log) {
    'ngInject';
    this.drive = {};
    this.socketService = socketService;
    this.modalService = modalService;
    this.toastMessageService = toastMessageService;
    this.$scope = $scope;
    this.$log = $log;
    //this.infoShare = mockService.get('infoShare');
    //this.listUsbDrives = mockService.get('listUsbDrives');
    this.inAddDrive = false;
    this.driveTypes = ['cifs', 'nfs'];
    this.init();
  }

  saveAddEditDrive() {
    if (this.inAddDrive) {
      this.$log.debug('addShare', this.drive);
      this.socketService.emit('addShare', this.drive);
    } else {
      this.$log.debug('editShare', this.drive);
      this.socketService.emit('editShare', this.drive);
    }
  }

  cancelAddEditDrive() {
    this.inAddDrive = false;
    this.inEditDrive = false;
  }

  addDrive() {
    this.drive = {fstype: 'cifs'};
    this.inAddDrive = true;
    this.inEditDrive = false;
  }


  editDrive(drive, index) {
    this.$log.debug('edit', index);
    this.inEditDrive = index;
    this.inAddDrive = false;
    this.drive = drive;
  }

  deleteDrive(drive) {
    let modalPromise = this.modalService.openModal(
      'ModalConfirmController',
      'app/components/modals/modal-confirm.html',
      {title: 'Delete drive', message: 'Do you want to delete "' + drive.name + '"?'});
    modalPromise.then((yes) => {
      this.$log.debug('deleteShare', {id: drive.name});
      this.socketService.emit('deleteShare', {id: drive.id});
    }, () => {});
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushListShares', (data) => {
      this.$log.debug('infoShare', data);
      this.infoShare = data;
    });
    this.socketService.on('pushListUsbDrives', (data) => {
      this.$log.debug('listUsbDrives', data);
      this.listUsbDrives = data;
    });
    this.socketService.on('pushAddShare', (data) => {
      this.$log.debug('pushAddShare', data);
      if (data.success) {
        this.toastMessageService.showMessage('success', 'Share successfully mounted...', '');
      } else {
        this.toastMessageService.showMessage('error', 'An error occured during adding share', '');
        this.$log.debug('addShare failed', data);
      } this.socketService.emit('getListShares');
    });
    this.socketService.on('pushDeleteShare', (data) => {
      this.$log.debug('pushDeleteShare', data);
      if (data.success) {
        this.toastMessageService.showMessage('success', 'Share successfully unmounted...', '');
        this.socketService.emit('getListShares');
      } else {
        this.toastMessageService.showMessage('error', 'An error occured during deleting share', '');
        this.$log.debug('deleteShare failed', data);
      }
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushListShares');
      this.socketService.off('pushListUsbDrives');
      this.socketService.off('pushAddShare');
      this.socketService.off('pushDeleteShare');
    });
  }

  initService() {
    this.socketService.emit('getListShares');
    this.socketService.emit('getListUsbDrives');
  }
}

export default NetworkDrivesPluginController;
