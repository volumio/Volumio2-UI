class KnobDirective {
  constructor () {
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
        options: '='
      }
    };
    return directive;
  }
}

class KnobController {
  constructor ($scope, $element, $timeout) {
    'ngInject';
    this.timeoutHandler = null;
    let knobOptions = {
      change: (value) => {
        $timeout.cancel(this.timeoutHandler);
        this.timeoutHandler = $timeout(() => {
          //console.log('change', value);
          value = parseInt(value, 10);
          this.value = value;
        }, 200);
      }
    };
    angular.extend(knobOptions, this.options);
    $element.knob(knobOptions);

    // NOTE live update value
    $scope.$watch(() => this.value,  (value) => {
      if (value) {
        $timeout.cancel(this.timeoutHandler2);
        this.timeoutHandler2 = $timeout(() => {
          //console.log('this.value', this.value);
          $element.val(this.value).trigger('change');
        }, 0);
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
}

export default KnobDirective;
