class MyVolumioWelcomeController {
    constructor($scope, $state, $rootScope, growSurfService, $window, cloudService, $translate, redirectService) {
        'ngInject';
        this.$scope = $scope;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.growSurfService = growSurfService;
        this.$window = $window;
        this.cloudService = cloudService;
        this.$translate = $translate;
        this.redirectService = redirectService;
        this.init();
    }

    init() {}

    goToAuthPage () {
      var queryParamsString = this.$window.location.href.split('?')[1];
      this.redirectService.urlGo('myvolumio/signup', queryParamsString);
    }
}

export default MyVolumioWelcomeController;
