class AudioOutputsService {
  constructor($rootScope, socketService, $log, multiRoomService) {
    'ngInject';
    this.socketService = socketService;
    this.multiRoomService = multiRoomService;
    this.$rootScope = $rootScope;
    this.$log = $log;

    this.pushedOutputs = [];
    this.outputs = [];
    this.groupedOutputs = [];
    this.multiRoomDevices = [];
    this.thisOutput = null;

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

  removeAllDevices() {
    const enabledOutputs = this.enabledOutputs();
    enabledOutputs.map(o => this.disableAudioOutput(o.id));
  }

  audioOutputPlay(output) {
    this.socketService.emit('audioOutputPlay', output);
  }

  audioOutputPause(output) {
    this.socketService.emit('audioOutputPause', output);
  }

  onDeviceVolumeChange(item) {
    let id = item.id;
    let type = item.type;
    let host = item.host;
    let mute = false;
    let volume = item.state.volume;
    let  isSelf = item.isSelf;
    this.socketService.emit('setAudioOutputVolume', { id, type, host, mute, volume, isSelf });
  }

  onDeviceListChange(data) {
    this.pushedOutputs = data.availableOutputs
        .filter(output => output.type !== 'browser');
    this.mergeMultiroomProperties();
    this.generateGroupedOutputs();
  }

  mergeMultiroomProperties() {
    //TODO Refactor in BE
    const loopBaseList = this.pushedOutputs.length >= this.outputs.length ? this.pushedOutputs : this.outputs;
    const loopCheckList = this.pushedOutputs.length <= this.outputs.length ? this.outputs : this.pushedOutputs;
    for (var i in loopBaseList) {
        var pushedOutput = loopBaseList[i];
          for (var k in loopCheckList) {
            var output = loopCheckList[k];
            if (pushedOutput.id === output.id) {
              output.available = pushedOutput.available;
              output.enabled = pushedOutput.enabled;
              output.plugin = pushedOutput.plugin;
              output.leader = pushedOutput.leader;
              output.mute = pushedOutput.mute;
              output.isSelf = pushedOutput.isSelf || output.isSelf;
              output.groupable = pushedOutput.hasOwnProperty('leader') && pushedOutput.plugin === 'audio_interface/multiroom';
              if (output.isSelf) {
                output.host = this.socketService.host;
              }
            }
          }
        }
    this.outputs = loopCheckList;
    this.thisOutput = this.outputs.find(d => d.isSelf);
  }

  onMultiRoomListChange(data) {
    this.outputs = data;
    this.mergeMultiroomProperties();
    // this.generateGroupedOutputs();
  }

  availableOutputs() {
    return this.outputs.filter(o => !o.isSelf && !o.enabled);
  }
  enabledOutputs() {
    return this.outputs.filter(o => o.available && !o.isSelf && o.enabled);
  }
  generateGroupedOutputs() {
    /* First, let's extract the unique group leaders */
    const leaderIds = this.outputs.reduce((acc, output) => {
      if (output.leader && output.leader !== output.id && output.enabled) {
        acc.push(output.leader);
      }
      return acc;
    }, []);
    /* Assign their 'children' */
    this.groupedOutputs = leaderIds.map((leader) => {
      return {
        leader: this.outputs.find(o => o.id === leader),
        children: this.outputs.filter(o => o.leader === leader && o.leader !==o.id && o.enabled)
      };
    });
  }
}

export default AudioOutputsService;
