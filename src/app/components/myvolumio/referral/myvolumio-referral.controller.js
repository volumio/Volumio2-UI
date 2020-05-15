class MyVolumioReferralController {
    constructor($scope, authService, user, $rootScope, growSurfService, $window, cloudService) {
        'ngInject';

        this.$scope = $scope;
        this.authService = authService;
        this.user = user;
        this.$rootScope = $rootScope;
        this.growSurfService = growSurfService;
        this.$window = $window;
        this.cloudService = cloudService;

        this.init();
    }

    init() {
        console.log('Howdy...');
        console.log(this.growSurfService);
        
        /* this.$window.addEventListener('grsfReady', () => {
        }); */
    }
}

export default MyVolumioReferralController;