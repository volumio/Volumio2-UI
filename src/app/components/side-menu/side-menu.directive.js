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
  constructor ($rootScope, socketService, $state) {
    'ngInject';
    this.socketService = socketService;
    this.$state = $state;

    this.visible = false;
    this.menuItems = [
      {
        id: 'home',
        name: 'Home',
        type: 'static',
        state: 'volumio.playback'
      },
      {
        id: 'components',
        name: 'Components',
        type: 'static',
        state: 'volumio.components'
      },
      {
        id: 'network',
        name: 'Network',
        type: 'dynamic'
      },
      {
        id: 'settings',
        name: 'Settings',
        type: 'Dynamic'
      },
    ];


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
    this.socketService.on('setMenuItems', (data) => {
     //console.log(data);
     this.items = data;
    });
  }

  initService() {
    this.socketService.emit('getMenuItems');
  }
}

export default PlayerButtonsDirective;
