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
    this.$timeout = $timeout;
    this.$element = $element;
    this.lastChange = -1000;
    let knobOptions = {
      change: (value) => {
        $timeout.cancel(this.timeoutHandler);
         this.timeoutHandler = $timeout(() => {
           value = parseInt(value, 10);
           if(this.value !== value){
             this.lastChange = Date.now();
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
            if(this.value !== value){
              this.lastChange = Date.now();
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
    $element.knob(knobOptions);

    // NOTE live update value
    $scope.$watch(() => this.value,  (newVal, oldVal) => {
      if (newVal !== oldVal) {
        if (Date.now() - this.lastChange > 300) {
          this.$element.val(parseInt(this.value, 10)).trigger('change');
        }
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
