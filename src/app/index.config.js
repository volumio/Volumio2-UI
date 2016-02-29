function config ($logProvider, toastrConfig, themeManagerProvider, theme) {
  'ngInject';
  themeManagerProvider.theme = theme;

  $logProvider.debugEnabled(true);

  angular.extend(toastrConfig, {
    timeOut: 20000
  });
}

export default config;
