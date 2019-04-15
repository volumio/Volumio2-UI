class MainMenuDirective {
  constructor(themeManager) {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('main-menu', 'components/main-menu'),
      scope: {},
      controller: MainMenuController,
      controllerAs: 'mainMenu',
      bindToController: true
    };
    return directive;
  }

}

class MainMenuController {
  constructor($state, $scope, $rootScope, socketService) {
    'ngInject';
    this.$state = $state;

    //all this boiler-plate is WIP and should works on dedicated service (coupled from side-menu)
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.socketService = socketService;
    this.menuItems = [];

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMenuItems', (data) => {
      this.menuItems = data;
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushMenuItems');
    });
  }

  initService() {
    this.socketService.emit('getMenuItems');
  }

  isAuthActive(){
    return this.isPluginActiveById('my-volumio');
  }

  isPluginActiveById(pluginId){
    for(var i in this.menuItems){
      var plugin = this.menuItems[i];
      if(plugin.hasOwnProperty('id') && plugin.id === pluginId){
        return true;
      }
    }
    return false;
  }
}

export default MainMenuDirective;
