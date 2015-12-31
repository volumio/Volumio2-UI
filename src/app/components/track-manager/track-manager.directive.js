class TrackManagerDirective {
  constructor(themeManager) {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('track-manager', 'components/track-manager'),
      scope: {
        type: '@'
      },
      link: linkFunc,
      controller: TrackManagerController,
      controllerAs: 'trackManager',
      bindToController: true
    };
    return directive;

    function linkFunc(scope, el, attr, vm) {
      let
        mouseupListener = () => {
          console.log('up', vm.playerService.seekPercent);
          vm.playerService.seek = vm.playerService.seekPercent;
        },
        mousedownListener = () => {
          console.log('down');
          vm.playerService.stopSeek();
        },
        trackManagerHandler;
      if (vm.type === 'slider') {
        setTimeout(() => {
          trackManagerHandler = el.find('.slider-handle')[0];
          trackManagerHandler.addEventListener('mousedown', mousedownListener, true);
          trackManagerHandler.addEventListener('mouseup', mouseupListener, true);
        });
      } else if (vm.type === 'knob') {

      }

      scope.$on('$destroy', () => {
        console.log('destroyed');
        if (vm.type === 'slider') {
          trackManagerHandler.removeEventListener('mousedown', mousedownListener, true);
          trackManagerHandler.removeEventListener('mouseup', mouseupListener, true);
        }
      });
    }
  }
}

class TrackManagerController {
  constructor($element, playerService, playlistService, $timeout) {
    'ngInject';
    this.playerService = playerService;
    this.playlistService = playlistService;
    if (this.type === 'knob') {
      this.knobOptions = {
        min: 0,
        max: 1001,
        fgColor: '#4bbe87',
        bgColor: '#283a4e',
        width: 150,
        height: 150,
        displayInput: false,
        step: 1,
        angleOffset: -125,
        angleArc: 250
      };

      this.onChange = (value) => {
        $timeout.cancel(this.timeoutHandler);
        this.timeoutHandler = $timeout(() => {
          console.log('track manager', value);
          this.playerService.stopSeek();
          this.playerService.seek = value;
        }, 200, false);
      };
    }
  }

  toggleFavouriteTrack() {
    console.log('toggleFavouriteTrack', this.playerService.state);
    if (true) {
      this.playlistService.addToFavourites(this.playerService.state);
    } else {
      this.playlistService.removeFromFavourites(this.playerService.state);
    }
  }
}


export default TrackManagerDirective;
