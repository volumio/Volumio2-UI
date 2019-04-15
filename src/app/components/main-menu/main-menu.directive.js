class MainMenuDirective {
  constructor(themeManager) {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('main-menu', 'components/main-menu'),
      scope: {},
      controller: MainMenuController,
      controllerAs: 'mainMenu',
      bindToController: true
    };
    return directive;
  }

}

class MainMenuController {
  constructor($state) {
    'ngInject';
    this.$state = $state;
  }
}

export default MainMenuDirective;
