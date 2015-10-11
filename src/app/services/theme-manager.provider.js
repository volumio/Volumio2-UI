class ThemeManagerProvider {
  constructor() {
    'ngInject';
    this._theme = null;
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
    'ngInject';
    return {
      getHtmlPath: this.getHtmlPath,
      theme: this._theme,
      setPageMetadata: () => {
        angular.element('body').attr('id', this.theme);
        document.title = this.theme;
        $rootScope.favicon = 'app/' + this.theme + '/assets/favicon.png';
        console.log($rootScope.favicon);
        $rootScope.theme = this.theme;
        $rootScope.assetsFolder = 'app/themes/' + this.theme + '/assets';
        console.log(this.theme);
        let link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'app/themes/' + this.theme + '/assets/favicon.png';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    };
  }
}

export default ThemeManagerProvider;
