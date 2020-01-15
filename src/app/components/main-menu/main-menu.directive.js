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
  constructor($rootScope, $state, $scope, $location, $window, socketService, authService, browseService, themeManager, $log, modalService) {
    'ngInject';
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.themeManager = themeManager;

    //all this boiler-plate is WIP and should works on dedicated service (coupled from side-menu)
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$log = $log;
    this.$window = $window;
    this.modalService = modalService;

    this.socketService = socketService;
    this.authService = authService;
    this.menuItems = [];
    this.menuItemsMainMenuLinks = [];

    this.browseService = browseService;

    this.sources = [];

    this.premiumEnabled = false;
    
    this.user = null;

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
    this.authInit();
  }

  goTo(source) {
    if(source.isRoute === true){
      this.$state.go(source.uri);
    }else if(this.$state.$current.name === 'volumio.browse'){
      this.browseService.historyUri = [];
      this.browseService.fetchLibrary(source);
    }else{
      if (this.browseService.historyUri[0] && this.browseService.historyUri[0].uri === source.uri ) {
        this.$state.go('volumio.browse');
      } else {
        this.browseService.historyUri = [];
        this.$state.go('volumio.browse');
        this.browseService.fetchLibrary(source);
      }

    }
  }

  registerListner() {
    this.socketService.on('pushMenuItems', (data) => {
      this.parseMenuItems(data);
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushMenuItems');
    });
  }

  initService() {
    this.socketService.emit('getMenuItems');
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
    });
  }

  initMenuListSource() {
    this.$scope.$watch( () => this.browseService.sources , (sourcesData) => {
      this.sources = sourcesData;
      if (sourcesData) {
        sourcesData.map(s => {
          if (['qobuz://', 'tidal://'].indexOf(s.uri) > -1) {
            this.premiumEnabled = true;
          }
        });
      }
    }, true);
  }

  isAuthActive() {
    return this.isPluginActiveById('my-volumio');
  }

  isPluginActiveById(pluginId) {
    for(var i in this.menuItems){
      var plugin = this.menuItems[i];
      if(plugin.hasOwnProperty('id') && plugin.id === pluginId){
        return true;
      }
    }
    return false;
  }

  parseMenuItems(data) {
    this.menuItems = data;
    this.menuItemsMainMenuLinks = data.filter(this.isMenuLink);
  }

  isMenuLink(data) {
    if (data.id === 'link' || data.id === 'plugin-manager' || data.id === 'shutdown') {
      return true;
    } else {
      return false;
    }
  }

  menuItemsMainMenuLinksClick(item) {
    this.$log.debug(item);
    if (item.id === 'modal' || item.id === 'shutdown') {
      let controllerName = item.params.modalName.split('-').map(
      (item) => {
        return item[0].toUpperCase() + item.slice(1, item.length);
      }).join(''),
      templateUrl = 'app/components/side-menu/elements/' +
        item.params.modalName + '.html'  ;
        this.$log.debug(controllerName);
        this.modalService.openModal(
          controllerName + 'Controller',
          templateUrl,
          item,
          item.params.modalSize || 'lg');
        } else if (item.id === 'link') {
          this.$window.open(item.params.url);
        } else if (item.id === 'static-page') {
          this.$state.go('volumio.static-page', {pageName: item.pageName});
        } else if (item.state) {
          this.$log.debug(item.state, item.params);
          if (item.params) {
            for (let param in item.params) {
              item.params[param] = String(item.params[param]).replace('/', '-');
            }
            this.$state.go(item.state, item.params);
          } else {
            this.$state.go(item.state);
          }
        } else {
          this.$state.go(item.state);
        }
      }
    menuItemsMyVolumioLinksClick(service) {
      this.$state.go('myvolumio.premiumStreaming', { serviceName: service });
    }
}

export default MainMenuDirective;
