import { groupBy } from 'lodash';

const MOCK_DATA = {
  "availableOutputs": [
    {
      "name": "Browser",
      "type": "browser",
      "icon": "fa fa-volume-up",
      "available": true,
      "enabled": true,
      "volumeAvailable": true,
      "volume": 50,
      "mute": false
    },
    {
      "name": "Volumio Kitchen",
      "type": "device",
      "icon": "fa fa-volume-up",
      "available": true,
      "enabled": false,
      "volumeAvailable": true,
      "volume": 30,
      "mute": true
    },
    {
      "name": "Volumio Studio",
      "type": "device",
      "icon": "fa fa-volume-up",
      "available": true,
      "enabled": true,
      "volumeAvailable": true,
      "volume": 92,
      "mute": false
    },
    {
      "name": "Volumio Bedroom",
      "type": "device",
      "icon": "fa fa-volume-up",
      "available": true,
      "enabled": false,
      "volumeAvailable": true,
      "volume": 92,
      "mute": false
    },
  ]
};

class ZoneMenuController {
  constructor($scope, $rootScope, socketService, $state, $log, browserPlaybackService) {
    'ngInject';
    this.$state = $state;
    this.socketService = socketService;
    this.browserPlayerService = browserPlaybackService;
    this.$log = $log;
    this.$scope = $scope;
    
    this.init();
    // $rootScope.$on('socket:init', () => this.init());
    // $rootScope.$on('socket:reconnect', () => this.initService());
    
    // UI state, updated by the service
    this.uiState = this.mapUIState(this.browserPlayerService.state);
  }

  mapUIState(serviceState) {
    // Local component state
    const defaultLocalState = {
      menuVisible: false,
    };

    const mappedState = {
      mute: serviceState.mute,
      volume: serviceState.volume.toString(),
    };

    return Object.assign({}, defaultLocalState, this.uiState, mappedState);
  }

  registerServiceObserver() {
    const uiStateListenerID = this.browserPlayerService.registerObserverCallback((state) => {
      this.uiState = this.mapUIState(state);
    });

    this.$scope.$on('$destroy', () => {
      this.browserPlayerService.deregisterObserverCallback(uiStateListenerID);
    });
  }

  init() {
    this.registerListner();
    this.initService();
    this.registerServiceObserver();
  }

  registerListner() {
    this.menuItems = groupBy(MOCK_DATA.availableOutputs, 'type');
    this.menuItemTypes = Object.keys(this.menuItems);

    this.socketService.on('pushZoneItems', (data) => {
      this.$log.debug('pushZoneItems', data);
      this.menuItems = data;
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushZoneItems');
    });
  }

  initService() {
    this.socketService.emit('getZoneItems');
  }

  toggleMenu() {
    this.uiState.menuVisible = !this.uiState.menuVisible;
  }

  itemClick(item) {
    this.$log.debug('Clicked on', item);
    // Implement method here
  }

  /* Manage the UI state here */
  onVolumeChange() {
    const val = parseFloat(this.uiState.volume);

    this.browserPlayerService.setVolume(val);
  }

  toggleMute() {
    this.browserPlayerService.toggleMute();
  }

}

export default ZoneMenuController;
