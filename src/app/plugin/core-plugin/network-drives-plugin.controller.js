class NetworkDrivesPluginController {
  constructor($scope, socketService, modalService, mockService, toastMessageService, $log, $filter,
      matchmediaService) {
    'ngInject';
    this.drive = {};
    this.socketService = socketService;
    this.modalService = modalService;
    this.toastMessageService = toastMessageService;
    this.$scope = $scope;
    this.$log = $log;
    this.$filter = $filter;
    //this.infoShare = mockService.get('infoShare');
    //this.listUsbDrives = mockService.get('listUsbDrives');
    //this.networkShares = mockService.get('networkSharesDiscovery');
    this.matchmediaService = matchmediaService;

    this.passwordInputType = 'password';
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
    this.inAddDrive = false;
    this.inEditDrive = false;
  }

  cancelAddEditDrive() {
    this.inAddDrive = false;
    this.inEditDrive = false;
  }

  addDrive() {
    this.drive = {fstype: 'cifs'};
    this.inAddDrive = true;
    this.inEditDrive = false;
    this.advancedVisible = false;
    this.networkShares = undefined;
    this.socketService.emit('getNetworkSharesDiscovery');
    this.$log.debug('emit getNetworkSharesDiscovery');
  }


  editDrive(drive, index) {
    this.$log.debug('edit', index);
    this.inEditDrive = index;
    this.inAddDrive = false;
    this.advancedVisible = true;
    this.drive = drive;
  }

  deleteDrive(drive) {
    const modalTitle = this.$filter('translate')('NETWORKFS.DELETE_DRIVE');
    const modalMessage =
        `${this.$filter('translate')('NETWORKFS.DELETE_DRIVE_CONFIRM')} ${drive.name}?`;
    let modalPromise = this.modalService.openModal(
      'ModalConfirmController',
      'app/components/modals/modal-confirm.html',
      {
        title: modalTitle,
        message: modalMessage
      });
    modalPromise.result.then((yes) => {
      this.$log.debug('deleteShare', {id: drive.name});
      this.socketService.emit('deleteShare', {id: drive.id});
    }, () => {});
  }

  selectShare(share, disk) {
    this.drive.ip = share.name;
    this.drive.name = disk.sharename;
    this.drive.path = disk.path;
  }

  showNasHelper() {
    this.socketService.emit('showNasHelper');
  }

  togglePasswordVisibility() {
    if (this.passwordInputType === 'password') {
      this.passwordInputType = 'input';
    } else {
      this.passwordInputType = 'password';
    }
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

    this.socketService.on('pushNetworkSharesDiscovery', (data) => {
      this.$log.debug('pushNetworkSharesDiscovery', data);
      this.networkShares = data;
    });

    this.socketService.on('nasCredentialsCheck', (data) => {
      this.$log.debug('nasCredentialsCheck', data);
      this.drive = {
        id: data.id,
        name: data.name
      };
      let modalPromise = this.modalService.openModal(
        'ModalNetwordDrivesPasswordController',
        'app/plugin/core-plugin/modals/modal-network-drive-password.html',
        data);
      modalPromise.result.then((obj) => {
        this.drive = angular.extend(this.drive, obj);
        this.$log.debug('updateSharePw', this.drive);
        this.socketService.emit('editShare', this.drive);
      }, () => {});
    });


    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushListShares');
      this.socketService.off('pushListUsbDrives');
      this.socketService.off('pushAddShare');
      this.socketService.off('pushDeleteShare');
      this.socketService.off('pushNetworkSharesDiscovery');
      this.socketService.off('nasCredentialsCheck');
    });
  }

  initService() {
    this.socketService.emit('getListShares');
    this.socketService.emit('getListUsbDrives');
  }
}

export default NetworkDrivesPluginController;
