class ThemeManagerProvider {
  constructor () {
    'ngInject';
    this._theme = 'volumio';
    this.setThemeBodyId();
  }

  set theme(theme) {
    this._theme = theme;
    this.setThemeBodyId();
  }

  get theme() {
    return this._theme;
  }

  setThemeBodyId() {
    angular.element('body').attr('id', this.theme);
  }

  getHtmlPath(filename, folder) {
    if (folder === '') {
      folder = null;
    } else if (!folder){
      folder = filename;
    }
    if (this.theme === 'volumio') {
      return 'app/' + ((folder)? folder + '/' : '' ) + filename + '.html';
    } else {
      return 'app/themes/' + this.theme + '/' +
          ((folder)? folder + '/' : '' ) +
          this.theme + '-' + filename + '.html';
    }
  }

  $get() {
    return {
      getHtmlPath: this.getHtmlPath,
    };
  }
}

export default ThemeManagerProvider;
