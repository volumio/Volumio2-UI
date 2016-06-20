export default class EqualizerDirective {
  constructor($log) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/equalizer/equalizer.html',
      scope: {},
      controller: EqualizerController,
      controllerAs: 'equalizer',
      bindToController: {
        config: '=',
        id: '@'
      }
    };
    return directive;
  }
}

class EqualizerController {
  constructor($scope, $element, $timeout) {
    'ngInject';

  }
}
