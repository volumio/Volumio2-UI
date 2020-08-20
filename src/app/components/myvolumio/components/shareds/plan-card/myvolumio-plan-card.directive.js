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
  constructor($rootScope, $scope, $state, authService, modalService, productsService, $filter) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.modalService = modalService;
    this.filteredTranslate = $filter('translate');

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
    if(this.product === undefined || this.product === null || this.product.plan === 'free'){
      return this.filteredTranslate('MYVOLUMIO.FREE').toUpperCase();
    }
    var planDuration = this.getCurrentPlanDuration();
    return this.product.prices[planDuration].localizedPrice;
  }

  getCurrentPlanDuration(){
    var planDuration = this.productsService.MONTHLY_PLAN;
    if(this.showMode !== undefined && this.showMode.planDuration !== undefined){
      planDuration = this.showMode.planDuration;
    }
    return planDuration;
  }

  isTrialAvailable(){
    var planDuration = this.productsService.MONTHLY_PLAN;
    if(this.showMode !== undefined && this.showMode.planDuration !== undefined){
      planDuration = this.showMode.planDuration;
    }
    if (this.user.isTrialAvailable !== false && !this.user.planData && this.product.prices[planDuration].trial !== undefined && this.product.prices[planDuration].trial.trialEnabled && this.product.prices[planDuration].trial.trialDays !== undefined && this.product.prices[planDuration].trial.trialDaysAuth !== undefined && this.product.prices[planDuration].trial.trialAuth !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  getTrialDays(){
    var planDuration = this.productsService.MONTHLY_PLAN;
    if(this.showMode !== undefined && this.showMode.planDuration !== undefined){
      planDuration = this.showMode.planDuration;
    }
    if (this.user.isTrialAvailable !== false && this.product.prices[planDuration].trial !== undefined && this.product.prices[planDuration].trial.trialEnabled && this.product.prices[planDuration].trial.trialDays !== undefined && this.product.prices[planDuration].trial.trialDaysAuth !== undefined && this.product.prices[planDuration].trial.trialAuth !== undefined) {
      return this.product.prices[planDuration].trial.trialDays;
    } else {
      return '';
    }
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
    var trial = this.isTrialAvailable();
    this.$state.go('myvolumio.subscribe', { 'plan': plan, 'planDuration': planDuration, 'trial': trial });
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

  getTrialOverride() {
    return this.productsService.getTrialOverride();
  }

}

export default MyVolumioPlanCardDirective;
