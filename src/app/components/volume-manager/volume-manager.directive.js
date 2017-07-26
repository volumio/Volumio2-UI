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
  constructor($rootScope, $scope, playerService, $timeout, matchmediaService, themeManager) {
    'ngInject';
    this.timeoutHandler = null;
    this.playerService = playerService;
    this.matchmediaService = matchmediaService;
    this.showVerticalSlider = false;
    this.themeManager = themeManager;
    this.dv = 69;
    this.$timeout = $timeout;

    if (this.type === 'knob') {
      this.knobOptions = {
        min: 0,
        max: 100,
        fgColor: themeManager.getCssValue('color'),
        bgColor: themeManager.getCssValue('backgroundColor'),
        width: 210,
        height: 210,
        displayInput: false,
        step: 1,
        angleOffset: -160,
        angleArc: 320
      };
      $scope.$watch(() => playerService.volume,  (value) => {
        if (value) {
         this._updateKnobState();
        }
      });
    } else if(this.type === 'slider') {
      // this.volume = playerService.volume;

      // NOTE this watches are for decouple the playerService.volume
      // from the knob value. The playerService.volume (getter) value
      // is delayed by the BE callback. This prevent the knob from go
      // back and forward two times
      $scope.$watch(() => this.volume,  (value) => {
        if (value) {
          $timeout.cancel(this.timeoutHandler);
          $timeout.cancel(this.timeoutHandler2);
          this.timeoutHandler = $timeout(() => {
            playerService.volume = value;
          }, 300);
        }
      });

      $scope.$watch(() => playerService.volume,  (value) => {
        if (value) {
          $timeout.cancel(this.timeoutHandler2);
          $timeout.cancel(this.timeoutHandler);
          this.timeoutHandler2 = $timeout(() => {
            this.volume = value;
          }, 20, true);
        }
      });
    }
  }

  get displayVolume(){
    if(this.timeoutHandler4 != null)
      return this.playerService.volume;
    return this.dv;
  }

  set displayVolume(volume){
    this.dv = volume;
    console.log("VOLUME SET TO " + volume);
    this.$timeout.cancel(this.timeoutHandler3);
    this.timeoutHandler3 = this.$timeout(() => {
      this.playerService.volume = volume;
      this.timeoutHandler3 = null;
    }, 50, true);
    this.$timeout.cancel(this.timeoutHandler4);
    this.timeoutHandler4 = this.$timeout(() => {
      this.timeoutHandler4 = null;
    }, 300, true);
  }

  toggleMute() {
    this.playerService.toggleMute();
    this._updateKnobState();
  }

  _updateKnobState() {
    if (this.playerService.state.mute) {
      this.knobOptions.fgColor = '#999';
    } else {
      this.knobOptions.fgColor = this.themeManager.getCssValue('color');
    }
  }
}

export default VolumeManagerDirective;
