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
  constructor($rootScope, $scope, playerService, $timeout, matchmediaService, themeManager, uiSettingsService) {
    'ngInject';
    this.timeoutHandler = null;
    this.playerService = playerService;
    this.matchmediaService = matchmediaService;
    this.showVerticalSlider = false;
    this.themeManager = themeManager;
    this.dv = 69;
    this.displayVolumex = 69;
    this.$timeout = $timeout;
    this.knobUpdateCallback = null;

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
        angleArc: 320,
        thickness: uiSettingsService.uiSettings.knobDesktopThickness || 0.2
      };
      this.volume = playerService.volume;
      console.info('playerService.volume', playerService.volume);
      $scope.$watch(() => playerService.volume,  (value) => {
        if (value) {
         this._updateKnobState();
        }
      });
    } else if(this.type === 'slider') {
      //This code is obsolete
      //The slider class should be reimplemented in the same fashion as the knob, to allow control over it's internal state.
      //
      // // this.volume = playerService.volume;
      //
      // // NOTE this watches are for decouple the playerService.volume
      // // from the knob value. The playerService.volume (getter) value
      // // is delayed by the BE callback. This prevent the knob from go
      // // back and forward two times
      // $scope.$watch(() => this.volume,  (value) => {
      //   if (value) {
      //     $timeout.cancel(this.timeoutHandler);
      //     $timeout.cancel(this.timeoutHandler2);
      //     this.timeoutHandler = $timeout(() => {
      //       playerService.volume = value;
      //     }, 0);
      //   }
      // });
      //
      // $scope.$watch(() => playerService.volume,  (value) => {
      //   if (value) {
      //     $timeout.cancel(this.timeoutHandler2);
      //     $timeout.cancel(this.timeoutHandler);
      //     this.timeoutHandler2 = $timeout(() => {
      //       this.volume = value;
      //     }, 20, true);
      //   }
      // });
    }
  }

  get displayVolume(){
    //Has one second passed since the last local volume set?
    if(this.timeoutHandler4 === null){
      this.dv = this.playerService.volume;
    }
    return this.dv;
  }

  set displayVolume(volume){
    //In other words, has this setvolume originated in this instance of the UI or is it coming from the pushState?
    //This is extremely important to prevent pushStates bouncing around between instances of the UI
    if(this.playerService.state.volume === volume){
      return;
    }
    this.dv = volume;
      this.playerService.volume = volume;
      this.timeoutHandler3 = null;

    //This timeout is only used as an indicator that the volume was set in the last second
    //It sets itself to null after that
    //Remote volume changes won't be reflected in the displayVolume if it was recently changed locally,
    //this is to ensure stability, and might not be necessary, but it is not very likely to happen often anyways
    this.$timeout.cancel(this.timeoutHandler4);
    this.timeoutHandler4 = this.$timeout(() => {
      this.timeoutHandler4 = null;
    }, 1000, true);
    if(this.knobUpdateCallback !== null){
      this.knobUpdateCallback();
    }
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
