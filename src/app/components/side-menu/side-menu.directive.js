class PlayerButtonsDirective {
  constructor() {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/themes/volumio/components/side-menu/volumio-side-menu.html',
      scope: false,
      controller: SideMenuController,
      controllerAs: 'sideMenu',
      bindToController: true
    };

    return directive;
  }
}

class SideMenuController {
  constructor($rootScope, socketService, mockService, $state, modalService) {
    'ngInject';
    this.socketService = socketService;
    this.$state = $state;
    this.modalService = modalService;

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
    //console.log(item);
    if (item.id === 'modal') {
      let
        controllerName = item.params.modalName.split('-').map(
          (item) => {
            return item[0].toUpperCase() + item.slice(1, item.length);
          }).join(''),
        templateUrl ='app/themes/volumio/components/side-menu/elements/volumio-' +
            item.params.modalName + '.html'  ;
      console.log(controllerName);
      this.modalService.openModal(
        controllerName + 'Controller',
        templateUrl,
        item,
        item.size);
    } else if (item.id === 'link') {
      window.open(item.params.url);
    } else if (item.params) {
      for (let param in item.params) {
        item.params[param] = String(item.params[param]).replace('/', '-');
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
