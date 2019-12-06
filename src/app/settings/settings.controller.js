class SettingsController {
  constructor($scope, $rootScope, socketService, $state, modalService, playerService, themeManager, $log, $window, uiSettingsService, authService, matchmediaService) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$window = $window;
    this.socketService = socketService;
    this.modalService = modalService;
    this.playerService = playerService;
    this.visible = false;
    this.themeManager = themeManager;
    this.$log = $log;
    this.$scope = $scope;
    this.uiSettingsService = uiSettingsService;
    this.authService = authService;
    this.matchmedia = matchmediaService;
    this.menuItemsSettings = [];

    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });

    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
    this.watcherHandler = this.$scope.$watch(
      () =>
        this.playerService &&
        this.playerService.state &&
        this.playerService.state.service, (val) => {
          if (val) {
            this.analogIn = this.playerService.state.service === 'analogin';
            this.bluetooth = this.playerService.state.service === 'bluetoth';
          }
    });
  }

  registerListner() {
    this.socketService.on('pushMenuItems', (data) => {
      this.$log.debug('pushMenuItems', data);
      this.menuItems = data;
      this.menuItemsSettings = data.filter(this.isMenuSetting);
      this.checkEnableMyVolumio();
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushMenuItems');
    });
  }

  initService() {
    this.socketService.emit('getMenuItems');
  }

  toggleAnalogInput() {
    this.socketService.emit('callMethod', {
      endpoint: 'system_controller/gpios',
      method: 'DASwitchPress'
    });
  }

  toggleBluetooth() {
    this.socketService.emit('callMethod', {
      endpoint: 'audio_interface/bluetooth',
      method: 'BTpress'
    });
  }

  isMenuSetting(data) {
    if (data.id !== 'link' && data.id !== 'plugin-manager' && data.id !== 'shutdown') {
      return true;
    } else {
      return false;
    }
  }

  itemClick(item) {
    if (item.id === 'modal' || item.id === 'shutdown') {
      let
        controllerName = item.params.modalName.split('-').map(
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

  checkEnableMyVolumio(){
    if(this.isAuthActive()){
      this.authService.enableAuth();
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

  isMyVolumioVisible(){
    return true;
  }

}

export default SettingsController;
