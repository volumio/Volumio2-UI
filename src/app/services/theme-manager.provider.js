class ThemeManagerProvider {
  constructor (UI_CONF) {
    'ngInject';
    this.UI_CONF = UI_CONF;
    angular.element('body').attr('id', this.UI_CONF.theme.name);
  }

  getHtmlPath(filename, folder) {
    if (folder === '') {
      folder = null;
    } else if (!folder){
      folder = filename;
    }
    if (this.UI_CONF.theme.name === 'volumio') {
      return 'app/' + ((folder)? folder + '/' : '' ) + filename + '.html';
    } else {
      return 'app/themes/' + this.UI_CONF.theme.name + '/' +
          ((folder)? folder + '/' : '' ) +
          this.UI_CONF.theme.name + '-' + filename + '.html';
    }
  }

  $get() {
    return {
      getHtmlPath: this.getHtmlPath,
    };
  }
}

export default ThemeManagerProvider;
