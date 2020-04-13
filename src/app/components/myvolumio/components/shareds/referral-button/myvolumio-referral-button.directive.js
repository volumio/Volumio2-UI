class MyVolumioReferralButtonDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/shareds/referral-button/myvolumio-referral-button.html',
      controller: ReferralButton,
      controllerAs: 'myVolumioReferralButtonController',
      scope: {
        imageOverride: '<'
      }
    };
    return directive;
  }
}

class ReferralButton {
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

export default MyVolumioReferralButtonDirective;
