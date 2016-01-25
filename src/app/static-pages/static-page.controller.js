class StaticPageController {
  constructor($http, $log, $stateParams) {
    'ngInject';
    $http.get(`app/static-pages/${$stateParams.pageName}.html`).then((response) => {
      console.log(response.data);
      this.content = response.data;
    }, (error) => {
      $log.error(error);
    });
  }
}

export default StaticPageController;
