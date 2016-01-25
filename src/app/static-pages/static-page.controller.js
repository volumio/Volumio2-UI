class StaticPageController {
  constructor($http, $log, $stateParams, themeManager) {
    'ngInject';
    $http.get(`app/themes/${themeManager.theme}/assets/static-pages/${$stateParams.pageName}.html`).then((response) => {
      this.content = response.data;
    }, (error) => {
      $log.error(error);
    });
  }
}

export default StaticPageController;
