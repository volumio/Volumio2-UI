class PlayerButtonsDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/side-menu/side-menu.html',
      scope: false,
      controller: SideMenuController,
      controllerAs: 'sideMenu',
      bindToController: true,
    };

    return directive;
  }
}

class SideMenuController {
  constructor ($rootScope, socketService, mockService, $state, $modal) {
    'ngInject';
    this.socketService = socketService;
    this.$state = $state;
    this.$modal = $modal;

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
    console.log(item);
    if (item.id === 'modal') {
      let modalInstance = this.$modal.open({
        animation: true,
        templateUrl: 'app/components/side-menu/elements/' +
            item.params.modalName +'.html',
        controller: 'ModalPowerOffController',
        controllerAs: 'modalPowerOff',
        size: 'sm',
        resolve: {
          params: () => {
            return {
              title: 'Power off'
            };
          }
        }
      });
      modalInstance.result.then(() => {}, () => {});
    } else if (item.params) {
      for (let param in item.params) {
        item.params[param] = String(item.params[param]).replace('/','-');
      }
      console.log(item.state, item.params);
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
