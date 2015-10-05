class ThemeManagerProvider {
  constructor() {
    'ngInject';
    this._theme = 'volumio';
    this.setPageMetadata();
  }

  set theme(theme) {
    this._theme = theme;
    this.setPageMetadata();
  }

  get theme() {
    return this._theme;
  }

  setPageMetadata() {
    angular.element('body').attr('id', this.theme);
    document.title = this.theme;
    // let link = document.createElement('link');
    // link.type = 'image/x-icon';
    // link.rel = 'shortcut icon';
    // link.href = this._theme + '.ico';
    // document.getElementsByTagName('head')[0].appendChild(link);
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

  $get() {
    return {
      getHtmlPath: this.getHtmlPath
    };
  }
}

export default ThemeManagerProvider;
