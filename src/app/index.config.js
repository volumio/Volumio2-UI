function config ($logProvider, toastrConfig) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  angular.extend(toastrConfig, {
    timeOut: 1000,
  });
}

export default config;
