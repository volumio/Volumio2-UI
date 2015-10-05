class TrackManagerDirective {
  constructor (themeManager) {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('track-manager', 'components/track-manager'),
      scope: false,
      link: linkFunc,
      controller: TrackManagerController,
      controllerAs: 'trackManager',
      bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, vm) {
      setTimeout(() => {
        let test = el.find('.slider-handle');
        test[0].addEventListener('mousedown', () => {
              console.log('down');
              vm.playerService.stopSeek();
            }, true);
        test[0].addEventListener('mouseup', () => {
              console.log('up', vm.playerService.seekPercent);
              vm.playerService.seek = vm.playerService.seekPercent;
            }, true);
      });
    }
  }
}

class TrackManagerController {
  constructor ($element, playerService, playlistService) {
    'ngInject';
    this.playerService = playerService;
    this.playlistService = playlistService;

    this.knobOptions = {
      min:0,
      max:101,
      fgColor:'#FF0000',
      width: 120,
      height: 120,
      displayInput: false,
      step: 1,
      angleOffset: -125,
      angleArc: 250
    };
  }

  addToFavourites() {
    this.playlistService.addToFavourites(this.playerService.state.uri);
  }
}


export default TrackManagerDirective;
