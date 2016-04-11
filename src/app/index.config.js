function config (
    $logProvider,
    toastrConfig,
    themeManagerProvider,
    theme,
    $touchProvider,
    env,
    $locationProvider,
    $httpProvider) {
  'ngInject';

  $touchProvider.enabled = true;

  themeManagerProvider.theme = theme;

  $logProvider.debugEnabled(env !== 'production');

  $locationProvider.html5Mode(true);
  $httpProvider.useApplyAsync(true);

  angular.extend(toastrConfig, {
    timeOut: 2000
  });
}

export default config;
