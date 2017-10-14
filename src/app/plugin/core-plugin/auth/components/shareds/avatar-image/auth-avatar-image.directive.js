class AuthAvatarImageDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/shareds/avatar-image/auth-avatar-image.html',
      controller: AuthAvatarImage,
      controllerAs: 'authAvatarImage'
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

    this.authInit();
  }

  authInit() {
    this.authService.getUserPromise(false).then((user) => {
      console.log("user");
      console.log(user);
      this.init(user);
      this.authService.bindWatcher(this.getAuthWatcher(), false);
    }).catch((error) => {
      console.log(error);
    });
  }

  getAuthWatcher() {
    return (user) => {
      console.log("authWatcher");
      console.log(user);
      this.init(user);
    };
  }

  init(user) {
    this.setUser(user);
  }

  setUser(user) {
    this.user = user;
    if (this.user) {
      this.user.image = "http://www.giacomodeglinnocenti.it/me.jpg"; //TODO IMAGE 
    }
  }

}

export default AuthAvatarImageDirective;
