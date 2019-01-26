import { groupBy } from 'lodash';


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
      this.outputs = groupBy(data.availableOutputs, 'type');
    });
  }

  initService() {
    this.socketService.emit('getAudioOutputs');
  }
}

export default AudioOutputsService;
