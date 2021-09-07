class AudioOutputsService {
  constructor($rootScope, socketService, $log, multiRoomService) {
    'ngInject';
    this.socketService = socketService;
    this.multiRoomService = multiRoomService;
    this.$rootScope = $rootScope;
    this.$log = $log;

    this.audioOutputs = [];
    this.multiroomOutputs = [];
    this.outputs = [];
    this.groupedOutputs = [];
    this.thisOutput = null;
    this.thisDeviceID = null;

    this.registerListener();
    this.initService();
  }

  registerListener() {
    this.socketService.on('pushAudioOutputs', (data) => {
      this.$log.debug('pushAudioOutputs', data);
      // TODO MERGE WITH MULTIROOM DATA
      this.audioOutputs = data.availableOutputs;
      this.addAudioOutputs();
    });

    this.$rootScope.$watch( () => this.multiRoomService.devices , (multiRoomDevices) => {
      if (multiRoomDevices) {
        this.multiroomOutputs = multiRoomDevices;
        this.addAudioOutputs();
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

  // onDeviceListChange(data) {
    
  //       //.filter(output => output.type !== 'browser');
  //   this.addAudioOutputs();
    
  // }

  addAudioOutputs() {

    var newOutputs = [];
    this.multiroomOutputs.forEach(device => {
      var multiroomSyncOutput = this.audioOutputs.find(d => d.id === device.id);
      device.groupable = multiroomSyncOutput && multiroomSyncOutput.hasOwnProperty('leader') && multiroomSyncOutput.plugin === 'audio_interface/multiroom';
      
      if (device.groupable) {
        device.leader = multiroomSyncOutput.leader;
        device.enabled = multiroomSyncOutput.enabled;
        device.available = multiroomSyncOutput.available;
      }
      
      newOutputs.push(device);        

      if (device.isSelf) {
        this.thisOutput = device;
        this.thisDeviceID = device.id;   
      }
    });

    //Add all other devices
    this.audioOutputs.forEach(output => {
      var existingOutput = newOutputs.find(d => d.id === output.id);
      if (!existingOutput && output.id !== this.thisDeviceID && output.type !== 'browser') {
        output.groupable = output.hasOwnProperty('leader') && output.plugin === 'audio_interface/multiroom';
        newOutputs.push(output);
      }
    });

    this.outputs = newOutputs;
    this.generateGroupedOutputs();  
  }  

  groupableOutputs() {
    return this.outputs.filter(o => !o.isSelf && !o.enabled && o.groupable);
  }
  availableOutputs() {
    return this.outputs.filter(o => !o.isSelf && !o.enabled);
  }
  enabledOutputs() {
    return this.outputs.filter(o => o.available && !o.isSelf && o.enabled);
  }
  hasLeader() {
    return this.thisOutput.hasOwnProperty('leader') && this.thisOutput.leader !== null;
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
