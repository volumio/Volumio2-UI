function config(theme, variant, $logProvider, toastrConfig, themeManagerProvider, $touchProvider, env,
        $locationProvider, $httpProvider, $translateProvider, localStorageServiceProvider, StripeCheckoutProvider, authServiceProvider, CgMailChimpServiceProvider, cfpLoadingBarProvider, debug) {
  'ngInject';

  cfpLoadingBarProvider.includeSpinner = false;

  $touchProvider.enabled = true;

  themeManagerProvider.theme = theme;
  themeManagerProvider.variant = variant;

  $logProvider.debugEnabled(debug !== false);

  $locationProvider.html5Mode(true);
  $httpProvider.useApplyAsync(true);

  angular.extend(toastrConfig, {
    maxOpened: true,
    preventOpenDuplicates: true
  });

  localStorageServiceProvider.setPrefix('volumio');
  // Mailchimp
  CgMailChimpServiceProvider.setConfig({
    username: 'volumio',
    dc: 'us11',
    u: '64b4a843c27713ee9da781aa9',
    id: '030f96ce5c'
  });

  // i18n Configs
  $translateProvider
    .useStaticFilesLoader({
      prefix: 'app/i18n/strings_',
      suffix: '.json'
    })
    // Back end send default language, this improve translation consistency
    // .determinePreferredLanguage()
    // .preferredLanguage('en')
    .fallbackLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
}

export default config;
