class AuthAvatarImageDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/shareds/avatar-image/auth-avatar-image.html',
      controller: AuthAvatarImage,
      controllerAs: 'authAvatarImageController'
    };
    return directive;
  }
}

class AuthAvatarImage {
  constructor($rootScope, $scope, $state, authService, modalService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.$watch = $scope.$watch;

    this.user = null;
    
    this.imageUrl = null;
    this.modalService = modalService;

    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user,(user) => {
      this.user = user;
    });
  }

  loadImage(){
    if(!this.user || this.user.photoUrl === null || this.user.photoUrl === undefined){
      this.imageUrl = null;
      return;
    }
    this.imageUrl = this.user.photoUrl;
  }

}

export default AuthAvatarImageDirective;
