function config ($logProvider, toastrConfig, themeManagerProvider, theme, $touchProvider, env, $locationProvider,
  $httpProvider, $translateProvider, localStorageServiceProvider) {
  'ngInject';

  $touchProvider.enabled = true;

  themeManagerProvider.theme = theme;

  $logProvider.debugEnabled(env !== 'production');

  $locationProvider.html5Mode(true);
  $httpProvider.useApplyAsync(true);

  angular.extend(toastrConfig, {
    timeOut: 2000
  });

  localStorageServiceProvider.setPrefix('volumio');

  //i18n Configs
  $translateProvider
    .useStaticFilesLoader({
      prefix: 'app/i18n/locale-',
      suffix: '.json'
    })
    .registerAvailableLanguageKeys(['ca', 'en', 'da', 'de', 'es', 'fi', 'fr', 'gr', 'hu', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt', 'ru', 'sv', 'ua', 'zh','zh-TW'], {
      'ca': 'ca',
      'en': 'en',
      'da': 'da',
      'de': 'de',
      'es': 'es',
      'fi': 'fi',
      'fr': 'fr',
      'gr': 'gr',
      'hu': 'hu',
      'it': 'it',
      'ja': 'ja',
      'ko': 'ko',
      'nl': 'nl',
      'no': 'no',
      'pl': 'pl',
      'pt': 'pt',
      'ru': 'ru',
      'sv': 'sv',
      'ua': 'ua',
      'zh': 'zh',
      'zh-TW':'zh_TW'
    })
    //Back end send default language, this improve translation consistency
    // .determinePreferredLanguage()
    // .preferredLanguage('en')
    .fallbackLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
}

export default config;
