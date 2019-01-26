import { groupBy } from 'lodash';


class ZoneMenuController {
  constructor($scope, socketService, $state, $log, browserPlaybackService) {
    'ngInject';
    this.$state = $state;
    this.socketService = socketService;
    this.browserPlayerService = browserPlaybackService;
    this.$log = $log;
    this.$scope = $scope;

    this.registerServiceObserver();

    // UI state, updated by the service
    this.uiState = this.mapUIState(this.browserPlayerService.state);
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
      menuVisible: false,
    };

    const mappedState = {
      mute: serviceState.mute,
      volume: serviceState.volume.toString(),
      availableOutputs: groupBy(serviceState.availableOutputs, 'type'),
    };

    return Object.assign({}, defaultLocalState, this.uiState, mappedState);
  }

  /* Manage the UI state here */
  itemClick(item) {
    this.$log.debug('Clicked on', item);
    // Implement method here
  }

  toggleMenu() {
    this.uiState.menuVisible = !this.uiState.menuVisible;
  }

  onVolumeChange() {
    const val = parseFloat(this.uiState.volume);

    this.browserPlayerService.setVolume(val);
  }

  toggleMute() {
    this.browserPlayerService.toggleMute();
  }

}

export default ZoneMenuController;
