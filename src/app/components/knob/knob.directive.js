class KnobDirective {
  constructor($log) {
    'ngInject';
    let directive = {
      restrict: 'E',
      template: '<input ng-model="knob.value">',
      scope: {},
      controller: KnobController,
      controllerAs: 'knob',
      require: 'ngModel',
      bindToController: {
        value: '=',
        options: '=',
        type: '@',
        onChange: '&?',
        onRelease: '&?'
      }
    };
    return directive;
  }
}

class KnobController {
  constructor($scope, $element, $timeout) {
    'ngInject';
    this.timeoutHandler = null;
    this.timeoutHandler2 = null;
    this.timeoutHandler3 = null;
    this.$timeoutService = $timeout;
    this.$element = $element;
    this.lastValueUpdateTime = 0;

    let knobOptions = {
      change: (value) => {
        $timeout.cancel(this.timeoutHandler);
        this.timeoutHandler = $timeout(() => {
          value = parseInt(value, 10);
          if (this.value !== value) {
            this.setNowAsLastValueUpdateTime();
            this.value = value;
          }
          if (this.onChange) {
            this.onChange({value: value});
          }
        }, 0, false);
      },
      release: (value, e) => {
        $timeout.cancel(this.timeoutHandler2);
        this.isChanging = true;
        this.timeoutHandler2 = $timeout(() => {
          if (this.type === 'volume') {
            value = parseInt(value, 10);
            if (this.value !== value) {
              this.setNowAsLastValueUpdateTime();
              this.value = value;
            }
          }
          if (this.onRelease) {
            this.onRelease({value: value});
          }
          this.isChanging = false;
        }, 0, true);
      }
    };
    angular.extend(knobOptions, this.options);
    this.$element.knob(knobOptions);

    // NOTE live update value
    $scope.$watch(() => this.value, (newVal, oldVal) => {
      if (this.isCanvasUpdateNeeded(newVal, oldVal)) {
        this.updateCanvas();
      }
    });

    // NOTE live update configurations
    $scope.$watch(() => this.options, (options) => {
      if (options) {
        //$log.debug('option changed', options);
        $element.trigger('configure', options);
      }
    }, true);
  }

  isCanvasUpdateNeeded(newVal, oldVal) {
    if ((newVal !== oldVal || this.getCanvasValue() !== newVal) && this.isMinimumTimeForUpdateElapsed()) {
      return true;
    }
    return false;
  }

  isMinimumTimeForUpdateElapsed() {
    if (Date.now() > this.lastValueUpdateTime + 300) {
      return true;
    }
    return false;
  }

  setNowAsLastValueUpdateTime() {
    this.lastValueUpdateTime = Date.now();
  }

  getCanvasValue() {
    if (!this.$element) {
      return undefined;
    }
    return this.$element.val();
  }

  updateCanvas() {
    this.$timeoutService.cancel(this.timeoutHandler3);
    this.timeoutHandler3 = this.updateCanvasAsyncTask();
  }

  updateCanvasAsyncTask() {
    return this.$timeoutService(() => {
      //$log.debug('this.value', this.value);
      if (!this.isChanging) {
        this.updateCanvasComponent();
      } else {
        this.$timeoutService.cancel(this.timeoutHandler3);
        this.timeoutHandler3 = this.updateCanvasAsyncTask();
      }
    }, 800);
  }

  updateCanvasComponent() {
    this.$element.val(parseInt(this.value, 10)).trigger('change');
  }

}

export default KnobDirective;
