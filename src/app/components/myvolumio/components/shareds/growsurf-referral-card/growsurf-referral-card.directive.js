class GrowsurfReferralCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/shareds/growsurf-referral-card/growsurf-referral-card.html',
      controller: GrowsurfReferral,
      controllerAs: 'GrowsurfReferralController',
      scope: {
        imageOverride: '<'
      }
    };
    return directive;
  }
}

class GrowsurfReferral {
  constructor($rootScope, growSurfService, $window, cloudService) {
    'ngInject';
    this.growSurfService = growSurfService;
    this.$window = $window;
    this.cloudService = cloudService;
    this.init();
  }

  init() {
    this.$window.addEventListener('grsfReady', () => {

    });
  }

  showGrowsurfWindow() {
    if (this.cloudService.isOnCloud) {
      this.$window.growsurf.open();
    } else {
      //REDIRECT TO CLOUD AND OPEN GROWSURF
    }
  }
}

export default GrowsurfReferralCardDirective;
