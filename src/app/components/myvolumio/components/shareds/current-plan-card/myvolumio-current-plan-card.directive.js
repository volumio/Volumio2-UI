class MyVolumioCurrentPlanCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/shareds/current-plan-card/myvolumio-current-plan-card.html',
      controller: MyVolumioCurrentPlanCardController,
      controllerAs: 'myVolumioCurrentPlanCardController',
      scope: {
        action: '@'
      }
    };
    return directive;
  }
}

class MyVolumioCurrentPlanCardController {
  constructor($rootScope, $scope, $state, authService, modalService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.modalService = modalService;

    this.action = this.$scope.action;

    this.user = null;
    this.isUserVerified;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
      this.postAuthInit();
    });
  }

  postAuthInit(user) {
    this.checkUserVerified();
  }

  checkUserVerified() {
    if (this.user === null) {
      return;
    }
    this.authService.isUserVerified().then(() => {
      this.isUserVerified = true;
    }).catch((error) => {
      this.isUserVerified = false;
    });
  }

  goToProfile() {
    this.$state.go('myvolumio.profile');
  }

  goToPlans() {
    this.$state.go('myvolumio.plans');
  }

  isTargetingProfile() {
    return this.action === 'profile';
  }

  isTargetingUpgrade() {
    return this.action === 'upgrade';
  }

  getDate(timestamp) {
    var date = new Date(timestamp * 1000);
    return date;
  }

  isFreePlan(){
    var isFreePlan = this.user.plan === undefined ||
    this.user.plan === null || 
    this.user.plan === 'free';
    return isFreePlan;
  }

  getPlanDuration(){
    var planDuration = this.user.planDuration;
    if(planDuration === undefined || planDuration === null){
      planDuration = 'monthly';
    }
    return planDuration;
  }

}

export default MyVolumioCurrentPlanCardDirective;