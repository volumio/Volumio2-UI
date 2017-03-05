class ThemeManagerProvider {
  constructor() {
    'ngInject';
  }

  getHtmlPath(filename, folder) {
    if (folder === '') {
      folder = null;
    } else if (!folder) {
      folder = filename;
    }
    return 'app/themes/' + this.theme + '/' +
        ((folder) ? folder + '/' : '') +
        this.theme + '-' + filename + '.html';
  }

  getCssValue(val) {
    if (!this.cssEsposer) {
      this.cssEsposer = getComputedStyle(window.cssExposer);
    }
    return this.cssEsposer[val];
  }

  $get($rootScope, $document, $log) {
    'ngInject';
    let setPageMetadata = function() {
      angular.element('body').attr('id', this.theme);
      //$log.debug($rootScope.favicon);
      $rootScope.theme = this.theme;
      $rootScope.variant = this.variant;
      // TODO
      // Ritornare come image url quella della variant dalla gestione dei backgrounds
      $rootScope.assetsUrl = '/app/themes/' + this.theme + '/assets';
      $rootScope.variantAssetsUrl = 'app/themes/' + this.theme  + '/assets/variants/' + this.variant;
      $rootScope.touchIconsUrl = `${$rootScope.variantAssetsUrl}/touch-icons`;
      $rootScope.favicon = `${$rootScope.variantAssetsUrl}/favicons/favicon.png`;
    };

    return {
      theme: this.theme,
      variant: this.variant,
      getHtmlPath: this.getHtmlPath,
      setPageMetadata: setPageMetadata,
      getCssValue: this.getCssValue
    };
  }
}

export default ThemeManagerProvider;
