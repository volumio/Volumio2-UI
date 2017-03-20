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
    let knobOptions = {
      change: (value) => {
        $scope.$apply(() => {
          value = parseInt(value, 10);
          this.value = value;
          if (this.onChange) {
            this.onChange({value: value});
          }
        });
      },
      release: (value, e) => {
        $scope.$apply(() => {
          if (this.onRelease) {
            this.onRelease({value: value});
          }
        });
      }
    };
    angular.extend(knobOptions, this.options);
    $element.knob(knobOptions);

    // NOTE live update value
    $scope.$watch(() => this.value,  (newVal, oldVal) => {
      if (newVal !== oldVal) {
        this.$element.val(parseInt(this.value, 10)).trigger('change');
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

}

export default KnobDirective;
