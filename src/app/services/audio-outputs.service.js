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
      this.onDeviceListChange(data);
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

  onDeviceVolumeChange(item) {
    let id = item.id;
    let type = item.type;
    let host = item.host;
    let mute = false;
    let volume = item.state.volume;
    this.socketService.emit('setAudioOutputVolume', { id, type, host, mute, volume });
  }

  onDeviceListChange(data) {
    this.pushedOutputs = data.availableOutputs
        .filter(output => output.type !== 'browser');
    this.mergeMultiroomProperties();

  }

  mergeMultiroomProperties() {
    //TODO Refactor in BE
    for (var i in this.pushedOutputs) {
        var pushedOutput = this.pushedOutputs[i];
          for (var k in this.outputs) {
            var output = this.outputs[k];
            if (pushedOutput.id === output.id) {
              output.available = pushedOutput.available;
              output.enabled = pushedOutput.enabled;
              output.plugin = pushedOutput.plugin;
            }
          }
        }
  }

  onMultiRoomListChange(data) {
    this.outputs = data;
    this.mergeMultiroomProperties();
  }
}

export default AudioOutputsService;
