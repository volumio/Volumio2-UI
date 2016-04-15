class PluginVisibleDirective {
  constructor() {
    'ngInject';

    let directive = {
      restrict: 'A',
      scope: {
        pluginVisible: '=',
        section: '='
      },
      controller: PluginVisibleController,
      controllerAs: 'plugin-visible',
      bindToController: true
    };

    return directive;
  }
}

class PluginVisibleController {
  constructor($scope, $element, $log) {
    'ngInject';
    if (this.pluginVisible) {
      let fieldToWatch = this.section.content.filter(
        (item) => { return item.id === this.pluginVisible.field; }
      )[0];
      $scope.$watch(() => {
        return fieldToWatch.value;
      }, (val) => {
        //$log.debug(typeof val, val, typeof this.pluginVisible.value, this.pluginVisible.value);
        if (val === this.pluginVisible.value) {
          $element.fadeIn(300);
        } else {
          $element.fadeOut(300);
        }
      });
    }
  }
}

export default PluginVisibleDirective;
