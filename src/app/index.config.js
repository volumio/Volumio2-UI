function config ($logProvider, toastrConfig, themeManagerProvider, theme, $touchProvider) {
  'ngInject';

  $touchProvider.enabled = true;

  themeManagerProvider.theme = theme;

  $logProvider.debugEnabled(true);

  angular.extend(toastrConfig, {
    timeOut: 2000
  });
}

export default config;
