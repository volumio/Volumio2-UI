class MyVolumioAccessController {
  constructor($scope, $state, authService, $document) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.$document = $document;
    this.user = null;

    this.init();
  }

  init() {
    this.authInit();
    this.setRandomBg();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
      this.postAuthInit();
    });
  }

  postAuthInit() {
    if (this.user !== null) {
      this.$state.go('myvolumio.profile');
    }
  }

  goToLogin() {
    this.$state.go('myvolumio.login');
  }

  goToSignUp() {
    this.$state.go('myvolumio.signup');
  }

  isSocialEnabled() {
    return this.authService.isSocialEnabled();
  }

  loginWithFacebook() {
    this.loginWithProvider('facebook');
  }

  loginWithGoogle() {
    this.loginWithProvider('google');
  }

  loginWithGithub() {
    this.loginWithProvider('github');
  }

  loginWithProvider(provider) {
    this.authService.loginWithProvider(provider).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  setRandomBg() {
    var bgImagesList = ['live.jpg', 'rehersal.jpg'];
    var bgImg = bgImagesList[Math.floor(Math.random() * bgImagesList.length)];
    this.$document[0].body.style.background = `#333 url("https://cdn.volumio.org/myvolumiobg/${bgImg}") no-repeat center center`;
    this.$document[0].body.style.backgroundSize = 'cover';
  }

}

export default MyVolumioAccessController;