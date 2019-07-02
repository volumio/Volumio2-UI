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
  constructor($rootScope, $state, $scope, $location, socketService, browseService, themeManager) {
    'ngInject';
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.themeManager = themeManager;

    //all this boiler-plate is WIP and should works on dedicated service (coupled from side-menu)
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;

    this.socketService = socketService;
    this.menuItems = [];

    this.browseService = browseService;

    this.sources = [];

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });

    //normal init
    this.variantAssetsUrl = 'app/themes/' + this.themeManager.theme  + '/assets/variants/' + this.themeManager.variant;
    this.variant = this.themeManager.variant;
  }

  init() {
    this.registerListner();
    this.initService();
    this.initMenuListSource();
  }

  goTo(source){
    if(source.isRoute === true){
      this.$state.go(source.uri);
    }else if(this.$state.$current.name === 'volumio.browse'){
      this.browseService.fetchLibrary(source);
    }else{
      this.$state.go('volumio.browse',{source: source});
    }
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

  initMenuListSource(){
    this.$scope.$watch( () => this.browseService.sources , (sourcesData) => {
      this.sources = sourcesData;
    }, true);
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