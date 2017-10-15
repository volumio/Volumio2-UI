class AuthCurrentPlanCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/shareds/current-plan-card/auth-current-plan-card.html',
      controller: AuthCurrentPlanCardController,
      controllerAs: 'authCurrentPlanCardController',
      scope: {
        action: '@'
      }
    };
    return directive;
  }
}

class AuthCurrentPlanCardController {
  constructor($rootScope, $scope, $state, authService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;

    this.action = this.$scope.action;

    this.isUserVerified;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.authService.getUserPromise().then((user) => {
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher());
    }).catch((error) => {
      console.log(error);
    });
  }

  getAuthWatcher() {
    return (user) => {
      this.postAuthInit(user);
    };
  }

  postAuthInit(user) {
    this.setUser(user);
    this.checkUserVerified();
  }

  checkUserVerified() {
    this.authService.isUserVerified().then(() => {
      this.isUserVerified = true;
    }).catch((error) => {
      this.isUserVerified = false;
    });
  }

  setUser(user) {
    this.user = user;
  }

  goToProfile() {
    this.$state.go('volumio.auth.profile');
  }

  goToPlans() {
    this.$state.go('volumio.auth.plans');
  }
  
  isTargetingProfile(){
    return this.action === 'profile';
  }
  
  isTargetingUpgrade(){
    return this.action === 'upgrade';
  }

}

export default AuthCurrentPlanCardDirective;
