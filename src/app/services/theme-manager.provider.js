class ThemeManagerProvider {
  constructor() {
    'ngInject';
    this.defaultPageTitle = '';
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
      $rootScope.assetsUrl = 'app/themes/' + this.theme + '/assets';
      $rootScope.variantAssetsUrl = 'app/themes/' + this.theme  + '/assets/variants/' + this.variant;
      $rootScope.touchIconsUrl = `${$rootScope.variantAssetsUrl}/touch-icons`;
      $rootScope.favicon = `${$rootScope.variantAssetsUrl}/favicons/favicon.png`;

      //TODO remove this hardcoded if
      if (this.variant === 'axiom') {
        this.defaultPageTitle = 'Axiom Air - Wireless HiFi Speaker';
      } else if (this.variant !== 'volumio') {
        this.defaultPageTitle = this.variant.charAt(0).toUpperCase() + this.variant.slice(1);
      }

      $rootScope.pageTitle = this.defaultPageTitle;
    };

    let getDefaultPageTitle = function() {
      return this.defaultPageTitle;
    };

    return {
      theme: this.theme,
      variant: this.variant,
      getHtmlPath: this.getHtmlPath,
      setPageMetadata: setPageMetadata,
      getDefaultPageTitle: getDefaultPageTitle,
      getCssValue: this.getCssValue
    };
  }
}

export default ThemeManagerProvider;
