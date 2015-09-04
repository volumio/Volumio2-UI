function config ($logProvider, toastrConfig, themeManagerProvider) {
  'ngInject';
  // Enable log
  themeManagerProvider.theme = 'volumio';

  $logProvider.debugEnabled(true);

  angular.extend(toastrConfig, {
    timeOut: 1000,
  });
}

export default config;
