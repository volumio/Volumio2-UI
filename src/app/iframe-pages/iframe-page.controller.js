class IframePageController {
  constructor($http, $log, $stateParams, themeManager, $scope, $sce) {
    'ngInject';

    // We provide the url and whitelist it
    this.url = $sce.trustAsResourceUrl($stateParams.url);
  }
}

export default IframePageController;
