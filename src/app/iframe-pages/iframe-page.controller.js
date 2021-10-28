class IframePageController {
  constructor($http, $log, $stateParams, themeManager, $scope) {
    'ngInject';
    this.url = $stateParams.url;
  }
}

export default IframePageController;
