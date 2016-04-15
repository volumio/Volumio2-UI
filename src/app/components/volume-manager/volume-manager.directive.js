class VolumeManagerDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('volume-manager', 'components/volume-manager'),
      scope: {
        type: '@'
      },
      controller: VolumeManagerController,
      controllerAs: 'volumeManager',
      bindToController: true
    };

    return directive;
  }
}

class VolumeManagerController {
  constructor($rootScope, $scope, playerService, $timeout, knobFgColor, knobBgColor, matchmediaService) {
    'ngInject';
    this.timeoutHandler = null;
    this.playerService = playerService;
    this.matchmediaService = matchmediaService;
    this.showVerticalSlider = false;
    this.knobFgColor = knobFgColor;

    if (this.type === 'knob') {
      this.knobOptions = {
        min: 0,
        max: 100,
        fgColor: knobFgColor,
        bgColor: knobBgColor,
        width: 210,
        height: 210,
        displayInput: false,
        step: 1,
        angleOffset: -160,
        angleArc: 320
      };
    }

    // NOTE this watches are for decouple the playerService.volume
    // from the knob value. The playerService.volume (getter) value
    // is delayed by the BE callback. This prevent the knob from go
    // back and forward two times
    $scope.$watch(() => this.volume,  (value) => {
      if (value) {
        $timeout.cancel(this.timeoutHandler);
        this.timeoutHandler = $timeout(() => {
          playerService.volume = value;
        }, 300);
      }
    });

    $scope.$watch(() => playerService.volume,  (value) => {
      if (value) {
        $timeout.cancel(this.timeoutHandler);
        this.timeoutHandler = $timeout(() => {
          this.volume = value;
        }, 100);
      }
    });
  }

  toggleMute() {
    if (this.playerService.state.mute) {
      this.knobOptions.fgColor = this.knobFgColor;
    } else {
      this.knobOptions.fgColor = "#999";
    }
    this.playerService.toggleMute();
  }

}

export default VolumeManagerDirective;
