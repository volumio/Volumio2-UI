import { groupBy } from 'lodash';
import ObserverService from './utils/observer-service';


class AudioOutputsService extends ObserverService {
  constructor(socketService, $log) {
    'ngInject';
    super();
    this.socketService = socketService;
    this.$log = $log;
    this.state = {
      outputs: [],
    };

    this.registerListener();
    this.initService();
  }

  registerListener() {
    this.socketService.on('pushAudioOutputs', (data) => {
      this.$log.debug('pushAudioOutputs', data);
      this.updateState({ outputs: groupBy(data.availableOutputs, 'type') });
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
    this.socketService.emit('disableAudioOutput', { id, mute, volume });
  }
}

export default AudioOutputsService;
