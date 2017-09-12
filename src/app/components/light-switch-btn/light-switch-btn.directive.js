export default class LightSwitchBtnDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('light-switch-btn', 'components/light-switch-btn'),
      scope: {},
      controller: LightSwitchBtnController,
      controllerAs: 'lightSwitchBtn',
      bindToController: true
    };
    return directive;
  }
}

class LightSwitchBtnController {
  constructor($scope, $rootScope, $log, matchmediaService, socketService) {
    'ngInject';
    this.socketService = socketService;
    this.$log = $log;
    this.matchmediaService = matchmediaService;
    this.$scope = $scope;
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
    this.socketService.on('pushLightSwitch', (data) => {
      this.$log.debug('pushLightSwitch', data);
      this.lightOn = data;
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushLightSwitch');
    });
  }

  initService() {
    this.socketService.emit('callMethod', {
      endpoint: 'system_controller/lightcontrol',
      method: 'getLightSwitch'
    });
  }

  toggleLightSwitch() {
    this.socketService.emit('callMethod', {
      endpoint: 'system_controller/lightcontrol',
      method: 'toggleLightSwitch'
    });
  }
}
