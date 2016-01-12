class MultiRoomManagerController {
  constructor(socketService, multiRoomService, $timeout) {
    'ngInject';
    this.socketService = socketService;
    this.multiRoomService = multiRoomService;
    this.$timeout = $timeout;
  }

  // onDragComplete(data,event){
  // }

  onDropComplete(from, to, event) {
    console.log(from, to);
    this.multiRoomService.addChild(from, to);
  }

  toggleClientsView(device) {
    if (device.clientVisible) {
      device.clientVisible = false;
    } else {
      device.clientVisible = true;
    }
  }

  changeGroupVolume(ip, volume) {
    if (this.timeoutHandler) {
      this.$timeout.cancel(this.timeoutHandler);
    }
    this.timeoutHandler = this.$timeout(() => {
      this.multiRoomService.changeGroupVolume(ip, volume);
    }, 300, false);
  }

  changeChildVolume(ip, volume) {
    if (this.timeoutHandler) {
      this.$timeout.cancel(this.timeoutHandler);
    }
    this.timeoutHandler = this.$timeout(() => {
      this.multiRoomService.changeChildVolume(ip, volume);
    }, 300, false);
  }


}

export default MultiRoomManagerController;
