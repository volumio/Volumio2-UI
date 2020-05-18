class MyVolumioReferralController {
    constructor($scope, $state, authService, user, $rootScope, growSurfService, $window, cloudService, $translate) {
        'ngInject';
        this.$scope = $scope;
        this.$state = $state;
        this.authService = authService;
        this.user = user;
        this.$rootScope = $rootScope;
        this.growSurfService = growSurfService;
        this.$window = $window;
        this.cloudService = cloudService;
        this.$translate = $translate;

        this.participant = null;
        this.campaign = null;

        this.init();
    }

    init() {
        console.log('Howdy...');
        console.log(this.growSurfService.participant);
        console.log(this.growSurfService.campaignInfo);

        /* this.$window.addEventListener('grsfReady', () => {
        }); */
    }

    backToProfile() {
        this.$state.go('myvolumio.profile');
    }

    orderRewards(rewards) {
        if (!rewards) return [];
        return rewards.sort((a, b) => (a.totalReferralsRequired > b.totalReferralsRequired) ? 1 : ((b.totalReferralsRequired > a.totalReferralsRequired) ? -1 : 0));
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