class PluginVisibleDirective {
  constructor () {
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
  constructor ($scope, $element) {
    'ngInject';
    if (this.pluginVisible) {
      let fieldToWatch = this.section.content.filter(
        (item) => { return item.id === this.pluginVisible.field; }
      )[0];
      $scope.$watch(() => {
        return fieldToWatch.value;
      }, (val) => {
        if (val === 'true') {
          $element.fadeIn(300);
        } else {
          $element.fadeOut(300);
        }
      });
    }
  }
}

export default PluginVisibleDirective;
