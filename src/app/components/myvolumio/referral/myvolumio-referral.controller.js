class MyVolumioReferralController {
    constructor($scope, $state, authService, user, $rootScope, /* growSurfService, */ $window, cloudService, $translate) {
        'ngInject';
        this.$scope = $scope;
        this.$state = $state;
        this.authService = authService;
        this.user = user;
        this.$rootScope = $rootScope;
        /* this.growSurfService = growSurfService; */
        this.$window = $window;
        this.cloudService = cloudService;
        this.$translate = $translate;

        this.init();
    }

    init() {
        console.log('Howdy...');
        console.log(this.growSurfService);

        /* this.$window.addEventListener('grsfReady', () => {
        }); */
    }

    backToProfile() {
        this.$state.go('myvolumio.profile');
    }

    copyLink() {
        const linkField = document.getElementById('my-volumio-link-field');
        try {
            linkField.select();
        } catch (err) {
            console.log(err);
            console.log('Couldnt select text');
        }
    }
}

export default MyVolumioReferralController;