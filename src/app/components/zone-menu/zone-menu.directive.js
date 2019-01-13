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

const mockData = {
  "availableOutputs": [
    {
      "name": "Browser",
      "type": "browser",
      "icon": "fa fa-volume-up",
      "available": true,
      "enabled": "true",
      "volumeAvailable": "true",
      "volume": 50,
      "mute": false
    },
    {
      "name": "Volumio Kitchen",
      "type": "device",
      "icon": "fa fa-volume-up",
      "available": true,
      "enabled": "true",
      "volumeAvailable": "true",
      "volume": 30,
      "mute": false
    },
    {
      "name": "Volumio Studio",
      "type": "device",
      "icon": "fa fa-volume-up",
      "available": true,
      "enabled": "true",
      "volumeAvailable": "true",
      "volume": 92,
      "mute": false
    }
  ]
}

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
    console.log('Clicked on', item);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.menuItems = mockData.availableOutputs;
    this.socketService.on('pushZoneItems', (data) => {
      this.$log.debug('pushZoneItems', data);
      this.menuItems = data;
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushZoneItems');
    });
  }

  initService() {
    this.socketService.emit('pushZoneItems');
  }
}

export default ZoneMenuDirective;
