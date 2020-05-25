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

        this.copyDone = false;

        this.init();
    }

    init() {
        /* console.log(this.growSurfService.participant);
        console.log(this.growSurfService.campaignInfo); */

        /* this.$window.addEventListener('grsfReady', () => {}); */
    }

    backToProfile() {
        this.$state.go('myvolumio.profile');
    }

    orderRewards(rewards) {
        if (!rewards) {
            return [];
        }
        return rewards.sort((a, b) => (a.totalReferralsRequired > b.totalReferralsRequired) ? 1 : ((b.totalReferralsRequired > a.totalReferralsRequired) ? -1 : 0));
    }

    copyLink() {
        const linkField = document.getElementById('my-volumio-link-field');
        try {
            linkField.select();
            linkField.setSelectionRange(0, 99999);
            document.execCommand('copy');
            this.copyDone = true;
        } catch (err) {
            console.log(err);
            console.log('Couldnt select text');
        }
    }

    shareClick(type, link) {
        switch(type) {
            case 'email':
                window.location.href = `mailto:?subject=Check out this awesome music player!&body=I've been using an awesome music player called Volumio. It turns your Raspberry PI into an audiophile music station. Check it out: ${ link }`;
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${ link }`, '_blank');
                break;
            case 'twitter':
                window.open(`http://twitter.com/share?text=I've been using an awesome music player called Volumio. It turns your Raspberry PI into an audiophile music station. Check it out!&url=${ link }&hashtags=volumio`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=Check out this awesome music player I've been using: ${ link }`, '_blank');
                break;
        }
    }
}

export default MyVolumioReferralController;