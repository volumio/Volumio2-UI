class BrowseHamburgerMenuDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      scope: {
        item: '=',
        browse: '='
      },
      templateUrl: 'app/browse/components/browse-hamburger-menu.html',
      link: function link(scope, el) {

        let menuWrapper = el[0].parentNode;
        let menuBtn = menuWrapper.parentNode;

        const placeMenu = function placeMenu() {
          menuWrapper.style.visibility = 'hidden';
          setTimeout(function timeout() {
            menuWrapper.classList.remove('right');
            menuWrapper.classList.remove('top');
            var hamburgerMenu = el[0].getBoundingClientRect();
            if (hamburgerMenu.width === 0 && hamburgerMenu.height === 0) {
              return false;
            }
            let tableWrapper = document.getElementById('browseTablesWrapper').getBoundingClientRect();
            // console.log(hamburgerMenu, tableWrapper);
            if (hamburgerMenu.left <= 0) {
              menuWrapper.classList.add('right');
            }
            if (hamburgerMenu.bottom >= tableWrapper.bottom) {
              menuWrapper.classList.add('top');
            }
            menuWrapper.style.visibility = 'visible';
          }, 10);
        };

        placeMenu();
        //Add listener
        menuBtn.addEventListener('click', placeMenu);
      }
    };
    return directive;
  }
}
export default BrowseHamburgerMenuDirective;
