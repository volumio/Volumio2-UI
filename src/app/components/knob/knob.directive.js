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
        this.lastChange = Date.now();
         this.timeoutHandler = $timeout(() => {
           value = parseInt(value, 10);
           if(this.value !== value){
             this.value = value;
           }
           if (this.onChange) {
             this.onChange({value: value});
           }
         }, 0, false);
      },
      release: (value, e) => {
        console.log("release");
        $timeout.cancel(this.timeoutHandler2);
        this.isChanging = true;
        this.lastChange = Date.now();
        this.timeoutHandler2 = $timeout(() => {
          if (this.type === 'volume') {
            value = parseInt(value, 10);
            if(this.value !== value){
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
          console.log("watch");
          $timeout.cancel(this.timeoutHandler3);
          this.timeoutHandler3 = this.updateValue();
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

  updateValue(newVal) {
    return this.$timeout(() => {
      //$log.debug('this.value', this.value);
      if (!this.isChanging) {
        this.$element.val(parseInt(this.value, 10)).trigger('change');
      } else {
        this.$timeout.cancel(this.timeoutHandler3);
        this.timeoutHandler3 = this.updateValue();
      }
    }, 0);
  }

}

export default KnobDirective;
