class ModalKaraokeController {
  constructor($uibModalInstance, socketService, dataObj) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.karaokeEnabled = false;

    this.init();
  }

  save() {
    let emitPayload = {
      'endpoint': 'system_controller/gpio',
      'method': 'KaraokeSwitchPress',
      'data': 'off'
    };
    if (this.karaokeEnabled) {
      emitPayload.data = 'on';
    }
    this.socketService.emit('callMethod', emitPayload);
    console.log('callMethod', emitPayload);
    this.$uibModalInstance.close();
  }

  musicVolumePlus() {
    let emitPayload = {
      'endpoint': 'system_controller/gpio',
      'method': 'MusicPlusPress',
      'data': ''
    };
    this.socketService.emit('callMethod', emitPayload);
  }

  musicVolumeMinus() {
    let emitPayload = {
      'endpoint': 'system_controller/gpio',
      'method': 'MusicMinusPress',
      'data': ''
    };
    this.socketService.emit('callMethod', emitPayload);
  }

  micVolumePlus() {
    let emitPayload = {
      'endpoint': 'system_controller/gpio',
      'method': 'MicPlusPress',
      'data': ''
    };
    this.socketService.emit('callMethod', emitPayload);
  }

  micVolumeMinus() {
    let emitPayload = {
      'endpoint': 'system_controller/gpio',
      'method': 'MicMinusPress',
      'data': ''
    };
    this.socketService.emit('callMethod', emitPayload);
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushKaraokeStatus', (data) => {
      console.log('pushKaraokeStatus', data);
      this.karaokeEnabled = data === 'off' ? false : true;
    });
  }

  initService() {
    this.socketService.emit('callMethod', {
      'endpoint': 'system_controller/gpios',
      'method': 'getKaraokeStatus',
      'data': ''
    });
  }
}

export default ModalKaraokeController;
