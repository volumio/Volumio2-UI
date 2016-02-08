class ThemeManagerProvider {
  constructor() {
    'ngInject';
    this._theme = undefined;
    this._defaultPageTitle = undefined;
  }

  set theme(theme) {
    this._theme = theme;
  }

  get theme() {
    return this._theme;
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

  $get($rootScope, $document) {
    'ngInject';
    let setPageMetadata = function() {
      angular.element('body').attr('id', this.theme);
      $rootScope.favicon = 'app/' + this.theme + '/assets/favicon.png';
      //console.log($rootScope.favicon);
      $rootScope.theme = this.theme;
      $rootScope.assetsFolder = 'app/themes/' + this.theme + '/assets';
      $rootScope.favicon = '/app/themes/' + this.theme + '/assets/favicon.png';
      if (this.theme === 'axiom') {
        this.defaultPageTitle = 'Axiom Air - Wireless HiFi Speaker';
      } else {
        this.defaultPageTitle = `${this.theme.charAt(0).toUpperCase()}${this.theme.slice(1)} - Audiophile Music Player`;
      }
      $rootScope.pageTitle = this.defaultPageTitle;
    };

    let getDefaultPageTitle = function() {
      return this.defaultPageTitle;
    };

    return {
      theme: this._theme,
      getHtmlPath: this.getHtmlPath,
      setPageMetadata: setPageMetadata,
      getDefaultPageTitle: getDefaultPageTitle
    };
  }
}

export default ThemeManagerProvider;
