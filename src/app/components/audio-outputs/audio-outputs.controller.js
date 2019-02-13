class AudioOutputsController {
  constructor($scope, socketService, $state, $log, browserPlaybackService, audioOutputsService) {
    'ngInject';
    this.$state = $state;
    this.socketService = socketService;
    this.browserPlayerService = browserPlaybackService;
    this.audioOutputsService = audioOutputsService;
    this.$log = $log;
    this.$scope = $scope;


    // UI state, updated by the service
    this.uiState = {
      component: {
        menuVisible: false,
      },
      // Browser player
      mute: this.browserPlayerService.state.mute,
      volume: this.browserPlayerService.state.volume.toString(),
    };
    this.registerServiceObserver();
  }

  registerServiceObserver() {
    const browserPlayerServiceID = this.browserPlayerService.registerObserverCallback((state) => {
      this.uiState.mute = state.mute;
      this.uiState.volume = state.volume.toString();
    });

    const audioOutputsServiceID = this.audioOutputsService.registerObserverCallback((state) => {
      this.uiState.outputs = state.outputs;
    });

    this.$scope.$on('$destroy', () => {
      this.browserPlayerService.deregisterObserverCallback(browserPlayerServiceID);
      this.audioOutputsService.deregisterObserverCallback(audioOutputsServiceID);
    });
  }

  /* Manage the UI state here */
  itemClick(item) {
    // this.$log.debug('Clicked on', item);
    // Implement method here
  }

  toggleMenu() {
    this.uiState.component.menuVisible = !this.uiState.component.menuVisible;
  }

  onVolumeChange() {
    const val = parseFloat(this.uiState.volume);

    this.browserPlayerService.setVolume(val);
  }

  toggleMute() {
    this.browserPlayerService.toggleMute();
  }

  toggleAudioOutput(id, enabled) {
    if (enabled === true) {
      this.audioOutputsService.disableAudioOutput(id);
    } else {
      this.audioOutputsService.enableAudioOutput(id);
    }
  }

  onDeviceVolumeChange(id, level = '0') {
    const volume = parseInt(level);

    this.audioOutputsService.onDeviceVolumeChange(id, volume);
  }
}

export default AudioOutputsController;
