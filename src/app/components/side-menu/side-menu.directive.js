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
    this.menuItems = mockService.get('getMenuItems');


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
    if (item.type === 'static') {
      this.$state.go(item.state);
    } else {
      //TODO Dynamic page settins templates engine

    }
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMenuItems', (data) => {
     //console.log(data);
     this.menuItems = data;
    });
  }

  initService() {
    this.socketService.emit('getMenuItems');
  }
}

export default PlayerButtonsDirective;
