class VolumeKnobDirective {
  constructor($log) {
    'ngInject';
    let directive = {
      restrict: 'E',
      template: '<input ng-model="knob.value">',
      scope: {},
      controller: VolumeKnobController,
      controllerAs: 'volume-knob',
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

class VolumeKnobController {
  constructor($scope, $element, $timeout) {
    'ngInject';
    this.timeoutHandler = null;
    this.$timeout = $timeout;
    this.$element = $element;
    this.localValue = 0;
  //  if(this.type === "volume")

    let knobOptions = {
      change: (value) =>{
        $timeout(() => {
          var rounded = Math.round(value);
          this.value = rounded;
          this.localValue = rounded;
        }, 0, true);
      },
      release: (value) =>{
        $timeout(() => {
          var rounded = Math.round(value);
          this.value = rounded;
          this.localValue = rounded;
        }, 0, true);
      }
    //Original Code
    //   change: (value) => {
    //     console.log("change: " + value);
    //     $timeout.cancel(this.timeoutHandler);
    //      this.timeoutHandler = $timeout(() => {
    //        value = parseInt(value, 10);
    //        this.value = value;
    //        if (this.onChange) {
    //          this.onChange({value: value});
    //        }
    //      }, 300, false);
    //   },
    //   release: (value, e) => {
    //     console.log("release: " + value);
    //     $timeout.cancel(this.timeoutHandler2);
    //     this.isChanging = true;
    //     this.timeoutHandler2 = $timeout(() => {
    //       if (this.type === 'volume') {
    //         value = parseInt(value, 10);
    //         this.value = value;
    //       }
    //       if (this.onRelease) {
    //         this.onRelease({value: value});
    //       }
    //       this.isChanging = false;
    //     }, 0, true);
    //  }
    };
    angular.extend(knobOptions, this.options);
    $element.knob(knobOptions);

    // NOTE live update value
    $scope.$watch(() => this.value,  (newVal, oldVal) => {
      if (newVal != oldVal && newVal != this.localValue) {
        this.$element.val(Math.round(newVal)).trigger("change");
      }
    });

    // NOTE live update configurations
    $scope.$watch(() => this.options,  (options) => {
      if (options) {
        //$log.debug('option changed', options);
        $element.trigger('configure', options);
      }
    }, true);
  }

  updateValue(newVal) {
    return this.$timeout(() => {
      //$log.debug('this.value', this.value);
      if (!this.isChanging) {
        this.$element.val(parseInt(this.value, 10)).trigger('change');
      } else {
        this.$timeout.cancel(this.timeoutHandler3);
        this.timeoutHandler3 = this.updateValue();
      }
    }, 10);
  }
}

export default VolumeKnobDirective;
