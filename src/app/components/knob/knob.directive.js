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
                }, 300, true);
            }
        };
        angular.extend(knobOptions, this.options);
        this.$element.knob(knobOptions);

        // NOTE live update value
        $scope.$watch(() => this.value, (newVal, oldVal) => {
            if (newVal !== oldVal || this.getCanvasValue() !== newVal) {
                this.updateValue();
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

    getCanvasValue() {
        if (!this.$element) {
            return undefined;
        }
        return this.$element.val();
    }

    updateValue() {
        this.$timeoutService.cancel(this.timeoutHandler3);
        this.timeoutHandler3 = this.updateValueAsyncTask();
    }

    updateValueAsyncTask() {
        return this.$timeoutService(() => {
            //$log.debug('this.value', this.value);
            if (!this.isChanging) {
                this.$element.val(parseInt(this.value, 10)).trigger('change');
            } else {
                this.$timeoutService.cancel(this.timeoutHandler3);
                this.timeoutHandler3 = this.updateValueAsyncTask();
            }
        }, 800);
    }
}

export default KnobDirective;
