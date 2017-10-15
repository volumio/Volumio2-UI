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
  constructor($rootScope, $scope, $state, authService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;

    this.user = null;
    
    this.imageUrl = '';

    this.authInit();
  }

  authInit() {
    this.authService.getUserPromise(false).then((user) => {
      console.log("user");
      console.log(user);
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher(), false);
    }).catch((error) => {
      console.log(error);
    });
  }

  getAuthWatcher() {
    return (user) => {
      console.log("authWatcher");
      console.log(user);
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
//    this.authService().getAvatarUrl(this.user.uid).then(url => {
//      this.imageUrl = url;
//    }).catch(error => {
//      alert(error);//TODO error in modal
//    });
  }

}

export default AuthAvatarImageDirective;
