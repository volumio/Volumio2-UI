class BrowseHamburgerMenuDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      scope: {
        item: '=',
        browse: '='
      },
      templateUrl: 'app/browse/components/browse-hamburger-menu.html'
    };
    return directive;
  }
}
export default BrowseHamburgerMenuDirective;
