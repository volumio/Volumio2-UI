class MyVolumioCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/card/myvolumio-card.html',
      controller: MyVolumioCardController,
      controllerAs: 'myVolumioUserCardController',
      scope: {
        'actionCallback': '&'
      }
    };
    return directive;
  }
}

class MyVolumioCardController {
  constructor($rootScope, $scope, $state, authService, modalService, socketService) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.modalService = modalService;
    this.socketService = socketService;

    this.actionCallback = this.$scope.actionCallback;

    this.user = null;

    this.tooltipShowing = false;

    this.$rootScope.$on('socket:init', () => {
      this.init();
    });
    this.$rootScope.$on('socket:reconnect', () => {
      this.initService();
    });

    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
    this.authInit();
  }

  registerListner() {
    this.socketService.on('pushMenuItems', (data) => {
      this.menuItems = data;
      this.checkEnableMyVolumio();
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushMenuItems');
    });
  }

  initService() {
    this.socketService.emit('getMenuItems');
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

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
    });
  }

  //auth section
  logIn() {
    this.callActionCallback();
    this.$state.go('myvolumio.login');
  }

  signUp() {
    this.callActionCallback();
    this.$state.go('myvolumio.signup');
  }

  goToProfile() {
    this.callActionCallback();
    this.$state.go('myvolumio.profile');
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.callActionCallback();
      this.$state.go('myvolumio.access');
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  isUserFilledWithMandatory() {
    return this.authService.isUserFilledWithMandatory();
  }

  callActionCallback(){
    if(this.actionCallback !== undefined && typeof this.actionCallback === 'function'){
      this.actionCallback();
    }
  }

  upgradePlan() {
    this.$state.go('myvolumio.plans');
  }
  clickTooltip(clickEvent) {
    this.tooltipShowing = !this.tooltipShowing;
  }
  closeTooltip() {
    this.tooltipShowing = false;
  }

}

export default MyVolumioCardDirective;
