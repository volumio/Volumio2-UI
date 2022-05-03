class IframePageController {
  constructor($http, $log, $stateParams, themeManager, $scope, $sce, $state) {
    'ngInject';

    // We provide the url and whitelist it
    this.url = $sce.trustAsResourceUrl($stateParams.url);
    this.$state = $state;

  }

  exitFromIframePage() {
    this.$state.go('volumio.playback');
  }
}

export default IframePageController;
