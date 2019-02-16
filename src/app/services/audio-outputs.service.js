class AudioOutputsService {
  constructor(socketService, $log) {
    'ngInject';
    this.socketService = socketService;
    this.$log = $log;

    this.outputs = [];

    this.registerListener();
    this.initService();
  }

  registerListener() {
    this.socketService.on('pushAudioOutputs', (data) => {
      this.$log.debug('pushAudioOutputs', data);
      this.outputs = data.availableOutputs
        .filter(output => output.type !== 'browser');
    });
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
}

export default AudioOutputsService;
