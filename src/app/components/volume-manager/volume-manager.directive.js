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
  constructor($scope, playerService, $timeout) {
    'ngInject';
    this.timeoutHandler = null;
    this.playerService = playerService;
    if (this.type === 'knob') {
      this.knobOptions = {
        min: 0,
        max: 100,
        fgColor: '#CCC',
        bgColor: '#444',
        width: 200,
        height: 200,
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
          //console.log(value);
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
}

export default VolumeManagerDirective;
