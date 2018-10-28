class MyVolumioPlanCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/shareds/plan-card/myvolumio-plan-card.html',
      controller: MyVolumioPlanCardController,
      controllerAs: 'myVolumioPlanCardController',
      scope: {
        product: '=',
        subscribe: '=',
        subscribeCallback: "&",
        cancellation: '=',
        cancellationCallback: '&',
        changeSubscription: '=',
        changeSubscriptionCallback: '&',
        showMode: '='
      }
    };
    return directive;
  }
}

class MyVolumioPlanCardController {
  constructor($rootScope, $scope, $state, authService, modalService, productsService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.modalService = modalService;

    this.product = this.$scope.product;
    this.isDefaultBehaviour = true;
    this.activateSubscribe = this.$scope.subscribe;
    this.subscribeCallback = this.$scope.subscribeCallback;
    this.activateCancellation = this.$scope.cancellation;
    this.cancellationCallback = this.$scope.cancellationCallback;
    this.activateChangeSubscription = this.$scope.changeSubscription;
    this.changeSubscriptionCallback = this.$scope.changeSubscriptionCallback;
    this.showMode = this.$scope.showMode;
    this.productsService = productsService;

    this.user = null;

    this.init();
  }

  init() {
    this.setConfiguration();
    this.authInit();
  }

  setConfiguration() {
    if (this.activateSubscribe === true || this.activateCancellation === true || this.activateChangeSubscription === true) {
      this.isDefaultBehaviour = false;
    }
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      if(user.planDuration === undefined){
        user.planDuration = 'monthly';
      }
      this.user = user;
    });
  }

  getShownPrice(){
    if(this.product === undefined){
      return '';
    }
    var planDuration = this.getCurrentPlanDuration();
    return this.product.prices[planDuration].textualPrice;
  }

  getCurrentPlanDuration(){
    var planDuration = this.productsService.MONTHLY_PLAN;
    if(this.showMode !== undefined && this.showMode.planDuration !== undefined){
      planDuration = this.showMode.planDuration;
    }
    return planDuration;
  }

  //auth section
  logIn() {
    this.$state.go('myvolumio.login');
  }

  signUp() {
    this.$state.go('myvolumio.signup');
  }

  goToProfile() {
    this.$state.go('myvolumio.profile');
  }

  logOut() {
    this.authService.logOut();
  }

  isUserFilledWithMandatory() {
    return this.authService.isUserFilledWithMandatory();
  }

  subscribe(plan) {
    var planDuration = this.getCurrentPlanDuration();
    this.$state.go('myvolumio.subscribe', { 'plan': plan, 'planDuration': planDuration });
  }

  goToChangePlan(plan) {
    var planDuration = this.getCurrentPlanDuration();
    this.$state.go('myvolumio.change-subscription', { 'plan': plan, 'planDuration': planDuration  });
  }

  downgradeToFree() {
    this.$state.go('myvolumio.cancel-subscription');
  }

  subscriptionCallback(subscribing) {
    this.subscribeCallback({ subscribing: subscribing });
  }

  doDowngrade() {
    this.cancellationCallback();
  }

  changePlan() {
    this.changeSubscriptionCallback();
  }

}

export default MyVolumioPlanCardDirective;