class MyVolumioBackButtonDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/shareds/back-button/myvolumio-back-button.html',
      controller: MyVolumioBackButtonController,
      controllerAs: 'myVolumioBackButtonController',
      scope: {
        routeDestination: '@',
        label: '@'
      }
    };
    return directive;
  }
}

class MyVolumioBackButtonController {
  constructor($rootScope, $scope, $state, authService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;

    this.routeDestination = this.$scope.routeDestination;
    this.label = this.$scope.label;

  }

  goBack() {
    this.$state.go(this.routeDestination);
  }

}

export default MyVolumioBackButtonDirective;