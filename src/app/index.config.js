function config ($logProvider, toastrConfig, themeManagerProvider, theme, $touchProvider, env, $locationProvider,
  $httpProvider, $translateProvider) {
  'ngInject';

  $touchProvider.enabled = true;

  themeManagerProvider.theme = theme;

  $logProvider.debugEnabled(env !== 'production');

  $locationProvider.html5Mode(true);
  $httpProvider.useApplyAsync(true);

  angular.extend(toastrConfig, {
    timeOut: 2000
  });

  //i18n Configs
  $translateProvider
    .useStaticFilesLoader({
      prefix: 'app/i18n/locale-',
      suffix: '.json'
    })
    .registerAvailableLanguageKeys(['ca', 'en', 'da', 'de', 'es', 'it', 'fr', 'hu', 'ja', 'nl', 'no', 'pl', 'ru', 'sv', 'ua', 'zh'], {
      'ca': 'ca',
      'en': 'en',
      'da': 'da',
      'de': 'de',
      'es': 'es',
      'it': 'it',
      'fr': 'fr',
      'hu': 'hu',
      'ja': 'ja',
      'nl': 'nl',
      'no': 'no',
      'pl': 'pl',
      'ru': 'ru',
      'sv': 'sv',
      'ua': 'ua',
      'zh': 'zh'
    })
    //Back end send default language, this improve translation consistency
    // .determinePreferredLanguage()
    // .preferredLanguage('en')
    .fallbackLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
}

export default config;
