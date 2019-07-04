class AudioOutputsService {
  constructor($rootScope, socketService, $log, multiRoomService) {
    'ngInject';
    this.socketService = socketService;
    this.multiRoomService = multiRoomService;
    this.$rootScope = $rootScope;
    this.$log = $log;

    this.pushedOutputs = [];
    this.outputs = [];
    this.multiRoomDevices = [];

    this.registerListener();
    this.initService();
  }

  registerListener() {
    this.socketService.on('pushAudioOutputs', (data) => {
      this.$log.debug('pushAudioOutputs', data);
      // TODO MERGE WITH MULTIROOM DATA
      //this.onDeviceListChange(data);
    });

    this.$rootScope.$watch( () => this.multiRoomService.devices , (multiRoomDevices) => {
      if (multiRoomDevices) {
        this.onMultiRoomListChange(multiRoomDevices);
      }
    }, true);
  }

  initService() {
    this.socketService.emit('getAudioOutputs');
  }

  enableAudioOutput(id) {
    this.socketService.emit('enableAudioOutput', { id });
  }

  disableAudioOutput(id) {
    this.socketService.emit('disableAudioOutput', { id });
  }

  onDeviceVolumeChange(id, volume, mute = false) {
    this.socketService.emit('setAudioOutputVolume', { id, mute, volume });
  }

  onDeviceListChange(data) {
    this.pushedOutputs = data.availableOutputs;
    this.outputs = data.availableOutputs
        .filter(output => output.type !== 'browser');
  }

  onMultiRoomListChange(data) {
    if (!this.pushedOutputs.length && data.length) {
        this.outputs = data;
    }
  }
}

export default AudioOutputsService;
