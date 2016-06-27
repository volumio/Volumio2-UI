function config ($logProvider, toastrConfig, themeManagerProvider, theme, $touchProvider, env, $locationProvider,
  $httpProvider, $translateProvider, CgMailChimpServiceProvider) {
  'ngInject';

  $touchProvider.enabled = true;

  themeManagerProvider.theme = theme;

  $logProvider.debugEnabled(env !== 'production');

  $locationProvider.html5Mode(true);
  $httpProvider.useApplyAsync(true);

  angular.extend(toastrConfig, {
    timeOut: 2000
  });

  //Mailchimp
  CgMailChimpServiceProvider.setConfig({
      username: 'volumio',
      dc: 'us11',
      u: '64b4a843c27713ee9da781aa9',
      id:'030f96ce5c'
  });

  //i18n Configs
  $translateProvider
    .useStaticFilesLoader({
      prefix: 'app/i18n/locale-',
      suffix: '.json'
    })
    .registerAvailableLanguageKeys(['en', 'de', 'it', 'fr'], {
      'en_US': 'en',
      'en_UK': 'en',
      'de_DE': 'de',
      'de_CH': 'de',
      'it': 'it',
      'fr': 'fr'
    })
    //Back end send default language, this improve translation consistency
    // .determinePreferredLanguage()
    // .preferredLanguage('en')
    .fallbackLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
}

export default config;
