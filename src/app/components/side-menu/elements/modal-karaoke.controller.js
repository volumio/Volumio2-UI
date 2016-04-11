class ModalKaraokeController {
  constructor($uibModalInstance, socketService, dataObj, $log) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.karaokeEnabled = false;
    this.$log = $log;

    this.init();
  }

  exit() {
    this.$uibModalInstance.close();
  }

  karaokeSwitch() {
    let emitPayload = {
      'endpoint': 'system_controller/gpios',
      'method': 'KaraokeSwitchPress',
      'data': 'off'
    };
    if (this.karaokeEnabled) {
      emitPayload.data = 'on';
    }
    this.socketService.emit('callMethod', emitPayload);
  }

  musicVolumePlus() {
    let emitPayload = {
      'endpoint': 'system_controller/gpios',
      'method': 'MusicPlusPress',
      'data': ''
    };
    this.socketService.emit('callMethod', emitPayload);
  }

  musicVolumeMinus() {
    let emitPayload = {
      'endpoint': 'system_controller/gpios',
      'method': 'MusicMinusPress',
      'data': ''
    };
    this.socketService.emit('callMethod', emitPayload);
  }

  micVolumePlus() {
    let emitPayload = {
      'endpoint': 'system_controller/gpios',
      'method': 'MicPlusPress',
      'data': ''
    };
    this.socketService.emit('callMethod', emitPayload);
  }

  micVolumeMinus() {
    let emitPayload = {
      'endpoint': 'system_controller/gpios',
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
      this.$log.debug('pushKaraokeStatus', data);
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
