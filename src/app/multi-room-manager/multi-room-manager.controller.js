class MultiRoomManagerController {
  constructor (socketService, multiRoomService) {
    'ngInject';
    this.socketService = socketService;
    this.multiRoomService = multiRoomService;
  }

  // onDragComplete(data,event){
  // }

  onDropComplete(from, to, event){
    console.log(from, to);
    // let fromIndex = this.multiRoomService.devices.list.indexOf(from),
    //     toIndex = this.multiRoomService.devices.list.indexOf(to);
    //
    // if (this.multiRoomService.devices.list[toIndex].child) {
    //   this.multiRoomService.devices.list[toIndex].child.push(from);
    // } else {
    //   this.multiRoomService.devices.list[toIndex].child = [from];
    // }
    // this.multiRoomService.devices.list.splice(fromIndex, 1);

    //this.socketService.emit('setMultiRoomDevices', this.multiRoomService.devices.list);

    // FIXME move into service
    let obj = {
      ip: from.ip,
      set: 'client'
    };
    console.log('setClient', obj);
    this.socketService.emit('setMultiroom', obj);
    obj = {
      ip: to.ip,
      set: 'server'
    };
    console.log('setServer', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  removeChildDevice(device, childDevice){
    // let deviceIndex = this.multiRoomService.devices.list.indexOf(device),
    //     childDeviceIndex = this.multiRoomService.devices.list[deviceIndex].child.indexOf(childDevice);
    // this.multiRoomService.devices.list[deviceIndex].child.splice(childDeviceIndex, 1);
    // this.multiRoomService.devices.list.push(childDevice);

    // FIXME move into service
    let obj = {
      ip: childDevice.ip,
      set: 'single'
    };
    console.log('removeChildDevice', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  toggleClientsView(device) {
    if (device.clientVisible) {
      device.clientVisible = false;
    } else {
      device.clientVisible = true;
    }
  }
}

export default MultiRoomManagerController;
