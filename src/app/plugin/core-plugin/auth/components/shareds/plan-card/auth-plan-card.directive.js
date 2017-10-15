class AuthPlanCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/shareds/plan-card/auth-plan-card.html',
      controller: AuthPlanCardController,
      controllerAs: 'authPlanCardController',
      scope: {
        product: '=',
        subscribe: '=',
        subscribeCallback: "&",
        cancellation: '=',
        cancellationCallback: '&',
        changeSubscription: '=',
        changeSubscriptionCallback: '&'
      }
    };
    return directive;
  }
}

class AuthPlanCardController {
  constructor($rootScope, $scope, $state, authService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    
    this.product = this.$scope.product;
    this.isDefaultBehaviour = true;
    this.activateSubscribe = this.$scope.subscribe;
    this.subscribeCallback = this.$scope.subscribeCallback;
    this.activateCancellation = this.$scope.cancellation;
    this.cancellationCallback = this.$scope.cancellationCallback;
    this.activateChangeSubscription = this.$scope.changeSubscription;
    this.changeSubscriptionCallback = this.$scope.changeSubscriptionCallback;

    this.user = null;

    this.init();
  }
  
  init(){
    this.setConfiguration();
    this.authInit();
  }
  
  setConfiguration(){
    if(this.activateSubscribe === true || this.activateCancellation === true || this.activateChangeSubscription === true){
      this.isDefaultBehaviour = false;
    }
  }

  authInit() {
    this.authService.getUserPromise(false).then((user) => {
      console.log("user");
      console.log(user);
      this.postInit(user);
      this.authService.bindWatcher(this.getAuthWatcher(), false);
    }).catch((error) => {
      console.log(error);
    });
  }

  getAuthWatcher() {
    return (user) => {
      console.log("authWatcher");
      console.log(user);
      this.postInit(user);
    };
  }

  postInit(user) {
    this.setUser(user);
  }

  setUser(user) {
    this.user = user;
  }

  //auth section
  logIn() {
    this.$state.go('volumio.auth.login');
  }

  signUp() {
    console.log("signUp");
    this.$state.go('volumio.auth.signup');
  }

  goToProfile() {
    this.$state.go('volumio.auth.profile');
  }

  logOut() {
    this.authService.logOut();
  }

  isUserFilledWithMandatory() {
    return this.authService.isUserFilledWithMandatory();
  }
  
  subscribe(plan) {
    this.$state.go('volumio.auth.subscribe', {'plan': plan});
  }
  
  goToChangePlan(plan){
    this.$state.go('volumio.auth.change-subscription', {'plan': plan});
  }
  
  downgradeToFree(){
    this.$state.go('volumio.auth.cancel-subscription');
  }
  
  subscriptionCallback(subscribing) {
    this.subscribeCallback({subscribing: subscribing});
  }
  
  doDowngrade(){
    this.cancellationCallback();
  }
  
  changePlan(){
    this.changeSubscriptionCallback();
  }

}

export default AuthPlanCardDirective;
