class MultiRoomManagerController {
  constructor (socketService, mockService, toastMessageService) {
    'ngInject';
    this.socketService = socketService;
    this.toastMessageService = toastMessageService;
    this.devices = mockService.get('getMultiRoomDevices').list;

    //this.init();
  }

  onDragComplete(data,event){
  }

  onDropComplete(from, to, event){
    let fromIndex = this.devices.indexOf(from),
        toIndex = this.devices.indexOf(to);

    if (this.devices[toIndex].child) {
      this.devices[toIndex].child.push(from);
    } else {
      this.devices[toIndex].child = [from];
    }
    this.devices.splice(fromIndex, 1);

    //this.socketService.emit('setMultiRoomDevices', this.devices);
    this.toastMessageService.showMessage('succes','Devices updated');
    this.toastMessageService.showMessage('success',
        from.name + ' aggiunto al gruppo ' + to.name);
  }

  removeChildDevice(device, childDevice){
    let deviceIndex = this.devices.indexOf(device),
        childDeviceIndex = this.devices[deviceIndex].child.indexOf(childDevice);
    this.devices[deviceIndex].child.splice(childDeviceIndex, 1);
    this.devices.push(childDevice);

    //this.socketService.emit('setMultiRoomDevices', this.devices);
    this.toastMessageService.showMessage('success',
        childDevice.name + ' rimosso dal gruppo ' + device.name);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMultiRoomDevices', (data) => {
     //console.log(data);
     //this.devices = data;
    });
  }

  initService() {
    this.socketService.emit('getMultiRoomDevices');
  }
}

export default MultiRoomManagerController;
