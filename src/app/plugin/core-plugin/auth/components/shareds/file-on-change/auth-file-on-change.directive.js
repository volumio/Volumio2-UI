class AuthFileOnChangeDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'A',
      controller: AuthFileOnChangeController,
      controllerAs: 'authFileOnChangeController',
      scope: {
        onChangeCallback: '&'
      }
    };
    return directive;
  }
}

class AuthFileOnChangeController {
  constructor($rootScope, $scope, $element, $attrs) {
    'ngInject';

    this.$scope = $scope;
    this.$element = $element;
    this.$attrs = $attrs;

    this.onChangeCallback = this.$scope.onChangeCallback;

    this.init();
  }

  init() {
    var scopedUploadFile = (event) => {
      this.$scope.$eval(this.uploadFile(event));
    };
    this.$element.bind('change', scopedUploadFile);
  }

  uploadFile(event) {
    var files = event.target.files;

    if (this.onChangeCallback !== null && this.onChangeCallback !== undefined) {
      this.onChangeCallback({file: files[0]});
    }
  }

}

export default AuthFileOnChangeDirective;
