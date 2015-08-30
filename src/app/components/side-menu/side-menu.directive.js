class PlayerButtonsDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/side-menu/side-menu.html',
      scope: false,
      controller: SideMenuController,
      controllerAs: 'sideMenu',
      bindToController: true
    };

    return directive;
  }
}

class SideMenuController {
  constructor ($rootScope, socketService, mockService, $state) {
    'ngInject';
    this.socketService = socketService;
    this.$state = $state;

    this.visible = false;
    //this.menuItems = mockService.get('getMenuItems');

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  toggleMenu() {
    this.visible = !this.visible;
  }

  itemClick(item) {
    this.toggleMenu();
    if (item.params) {
      for (let param in item.params) {
        console.log(param);
        item.params[param] = String(item.params[param]).replace('/','-');
      }
      this.$state.go(item.state, item.params);
    } else {
      this.$state.go(item.state);
    }
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMenuItems', (data) => {
     console.log('pushMenuItems', data);
     this.menuItems = data;
    });
  }

  initService() {
    this.socketService.emit('getMenuItems');
  }
}

export default PlayerButtonsDirective;
