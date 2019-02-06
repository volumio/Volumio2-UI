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
    this.uiState = this.mapUIState(this.browserPlayerService.state);
    this.registerServiceObserver();
  }

  registerServiceObserver() {
    const uiStateListenerID = this.browserPlayerService.registerObserverCallback((state) => {
      this.uiState = this.mapUIState(state);
    });

    this.$scope.$on('$destroy', () => {
      this.browserPlayerService.deregisterObserverCallback(uiStateListenerID);
    });
  }

  mapUIState(serviceState) {
    // Local component state
    const defaultLocalState = {
      component: {
        menuVisible: false,
      }
    };

    const mappedState = {
      mute: serviceState.mute,
      volume: serviceState.volume.toString(),
    };

    return Object.assign({}, defaultLocalState, this.uiState, mappedState);
  }

  /* Manage the UI state here */
  itemClick(item) {
    this.$log.debug('Clicked on', item);
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

}

export default AudioOutputsController;
