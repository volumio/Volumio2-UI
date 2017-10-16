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

    this.user = null;
    
    this.imageUrl = '';
    this.modalService = modalService;

    this.authInit();
  }

  authInit() {
    this.authService.getUserPromise(false).then((user) => {
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher(), false);
    }).catch((error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  getAuthWatcher() {
    return (user) => {
      this.postAuthInit(user);
    };
  }

  postAuthInit(user) {
    this.setUser(user);
    this.loadImage();
  }

  setUser(user) {
    this.user = user;
  }

  loadImage(){
    if(!this.user || this.user.photoUrl === null || this.user.photoUrl === undefined){
      return;
    }
    this.imageUrl = this.user.photoUrl;
  }

}

export default AuthAvatarImageDirective;
