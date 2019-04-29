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
  constructor($state, $scope, $rootScope, $location, socketService, browseService) {
    'ngInject';
    this.$state = $state;

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
  }

  init() {
    this.registerListner();
    this.initService();
    this.initMenuListSource();
  }

  goTo(source){
    if(source.isRoute === true){
      this.$state.go(source.uri);
    }else if(this.$state.$current.name == 'volumio.browse'){
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
      this.checkAddDefaultItems();
    }, true);
  }

  checkAddDefaultItems(){
    if(this.sources == undefined){
      return;
    }
    var homeSource = {
      "name": "Home",
      "uri": "volumio.home",
      "isRoute": true,
      "icon": 'fa fa-home'
    };
    var searchSource = {
      "name": "Search",
      "uri": "volumio.search",
      "isRoute": true,
      "icon": 'fa fa-search'
    };

    var foundHome = false;
    var foundSearch = false;
    for(var i in this.sources){
      var source = this.sources[i];
      if(source.name === homeSource.name){
        foundHome = true;
      }
      if(source.name === searchSource.name){
        foundSearch = true;
      }
    }
    if(!foundSearch){
      this.sources.unshift(searchSource);
    }
    if(!foundHome){
      this.sources.unshift(homeSource);
    }
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
