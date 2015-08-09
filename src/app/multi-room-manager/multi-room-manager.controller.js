class MultiRoomManagerController {
  constructor (socketService, toastMessageService, multiRoomService) {
    'ngInject';
    this.socketService = socketService;
    this.toastMessageService = toastMessageService;
    this.multiRoomService = multiRoomService;
  }

  // onDragComplete(data,event){
  // }

  onDropComplete(from, to, event){
    let fromIndex = this.multiRoomService.devices.list.indexOf(from),
        toIndex = this.multiRoomService.devices.list.indexOf(to);

    if (this.multiRoomService.devices.list[toIndex].child) {
      this.multiRoomService.devices.list[toIndex].child.push(from);
    } else {
      this.multiRoomService.devices.list[toIndex].child = [from];
    }
    this.multiRoomService.devices.list.splice(fromIndex, 1);

    //this.socketService.emit('setMultiRoomDevices', this.multiRoomService.devices.list);
    this.toastMessageService.showMessage('succes','Devices updated');
    this.toastMessageService.showMessage('success',
        from.name + ' aggiunto al gruppo ' + to.name);
  }

  removeChildDevice(device, childDevice){
    let deviceIndex = this.multiRoomService.devices.list.indexOf(device),
        childDeviceIndex = this.multiRoomService.devices.list[deviceIndex].child.indexOf(childDevice);
    this.multiRoomService.devices.list[deviceIndex].child.splice(childDeviceIndex, 1);
    this.multiRoomService.devices.list.push(childDevice);

    //this.socketService.emit('setMultiRoomDevices', this.multiRoomService.devices.list);
    this.toastMessageService.showMessage('success',
        childDevice.name + ' rimosso dal gruppo ' + device.name);
  }
}

export default MultiRoomManagerController;
