class KnobDirective {
  constructor() {
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
    this.$timeout = $timeout;
    this.$element = $element;
    let knobOptions = {
      change: (value) => {
        $timeout.cancel(this.timeoutHandler);
        this.timeoutHandler = $timeout(() => {
          value = parseInt(value, 10);
          this.value = value;
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
            this.value = value;
          }
          if (this.onRelease) {
            this.onRelease({value: value});
          }
          this.isChanging = false;
        }, 300, false);
      }
    };
    angular.extend(knobOptions, this.options);
    $element.knob(knobOptions);

    // NOTE live update value
    $scope.$watch(() => this.value,  (newVal, oldVal) => {
      if (newVal !== oldVal) {
        $timeout.cancel(this.timeoutHandler3);
        this.timeoutHandler3 = this.updateValue();
      }
    });

    // NOTE live update configurations
    $scope.$watch(() => this.options,  (options) => {
      if (options) {
        //console.log('option changed', options);
        $element.trigger('configure', options);
      }
    }, true);
  }

  updateValue() {
    return this.$timeout(() => {
      let timeoutHandler;
      //console.log('this.value', this.value);
      if (!this.isChanging) {
        this.$element.val(parseInt(this.value, 10)).trigger('change');
      } else {
        this.$timeout.cancel(timeoutHandler);
        timeoutHandler = this.updateValue();
      }
    }, 800);
  }
}

export default KnobDirective;
