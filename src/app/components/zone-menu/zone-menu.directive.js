import {groupBy} from 'lodash';

class ZoneMenuDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/zone-menu/zone-menu.html',
      scope: false,
      controller: ZoneMenuController,
      controllerAs: 'zoneMenu',
      bindToController: true
    };
    return directive;
  }
}

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
  constructor($scope, $rootScope, socketService, $state, $log) {
    'ngInject';
    this.$state = $state;
    this.socketService = socketService;
    this.visible = false;
    this.$log = $log;
    this.$scope = $scope;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  toggleMenu() {
    this.visible = !this.visible;
  }

  itemClick(item) {
    this.$log.debug('Clicked on', item);
    // Implement method here
  }

  onSettingsClick

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.menuItems = groupBy(MOCK_DATA.availableOutputs, 'type');
    this.menuItemTypes = Object.keys(this.menuItems);

    console.log(this.menuItems)

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
}

export default ZoneMenuDirective;
