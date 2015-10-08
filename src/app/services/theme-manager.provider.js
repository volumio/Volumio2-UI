class ThemeManagerProvider {
  constructor() {
    'ngInject';
    this._theme = 'volumio';

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

  $get($rootScope) {
    return {
      getHtmlPath: this.getHtmlPath,
      theme: this._theme,
      setPageMetadata: () => {
        angular.element('body').attr('id', this.theme);
        document.title = this.theme;
        $rootScope.faviconUrl = 'app/' + this.theme + '/favicon.ico';
        $rootScope.theme = this.theme;
        $rootScope.assetsFolder = 'app/themes/' + this.theme + '/assets';
        console.log(this.theme);
        // let link = document.createElement('link');
        // link.type = 'image/x-icon';
        // link.rel = 'shortcut icon';
        // link.href = this._theme + '.ico';
        // document.getElementsByTagName('head')[0].appendChild(link);
      }
    };
  }
}

export default ThemeManagerProvider;
