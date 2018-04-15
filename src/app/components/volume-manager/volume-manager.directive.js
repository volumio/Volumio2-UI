class VolumeManagerDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: (el, attrs) => {
        let templateName = 'volume-manager';
        let templatePath = 'components/volume-manager';
        if (attrs.templateName && attrs.templatePath) {
          templateName = attrs.templateName;
          templatePath = attrs.templatePath;
        }
        return themeManager.getHtmlPath(templateName, templatePath);
      },
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
  constructor(
    $rootScope,
    $scope,
    playerService,
    $timeout,
    matchmediaService,
    themeManager,
    uiSettingsService
  ) {
    'ngInject';
    this.timeoutHandler = null;
    this.playerService = playerService;
    this.matchmediaService = matchmediaService;
    this.showVerticalSlider = false;
    this.themeManager = themeManager;
    this.$scope = $scope;

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
      $scope.$watch(
        () => playerService.volume,
        value => {
          if (value) {
            this._updateKnobState();
          }
        }
      );
    } else if (this.type === 'slider') {
      // this.volume = playerService.volume;

      // NOTE this watches are for decouple the playerService.volume
      // from the knob value. The playerService.volume (getter) value
      // is delayed by the BE callback. This prevent the knob from go
      // back and forward two times
      $scope.$watch(
        () => this.volume,
        value => {
          if (value) {
            $timeout.cancel(this.timeoutHandler);
            $timeout.cancel(this.timeoutHandler2);
            this.timeoutHandler = $timeout(() => {
              playerService.volume = value;
            }, 300);
          }
        }
      );

      $scope.$watch(
        () => playerService.volume,
        value => {
          if (value) {
            $timeout.cancel(this.timeoutHandler2);
            $timeout.cancel(this.timeoutHandler);
            this.timeoutHandler2 = $timeout(
              () => {
                this.volume = value;
              },
              20,
              true
            );
          }
        }
      );
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

  toggleVolumeSlider() {
    this.showVerticalSlider = !this.showVerticalSlider;
    if (this.showVerticalSlider) {
      this.disableScroll();
    } else {
      this.enableScroll();
    }
  }

  closeVolumeSlider($event) {
    this.showVerticalSlider = false;
  }

  disableScroll() {
    document.ontouchmove = function(e){
      e.preventDefault();
    };
    document.getElementById('volumeVerticalSlider').ontouchmove = function(e){
      return true;
    };
  }

  enableScroll() {
      document.ontouchmove = function(e){
        return true;
      };
  }
}

export default VolumeManagerDirective;
