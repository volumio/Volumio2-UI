class MyVolumioWelcomeController {
    constructor($scope, $state, $rootScope, growSurfService, $window, cloudService, $translate) {
        'ngInject';
        this.$scope = $scope;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.growSurfService = growSurfService;
        this.$window = $window;
        this.cloudService = cloudService;
        this.$translate = $translate;

        this.participant = null;
        this.campaign = null;

        this.copyDone = false;

        this.init();
    }

    init() {
    }

    goToAuthPage () {
        this.$state.go('myvolumio.profile');
    }
}

export default MyVolumioWelcomeController;