class AuthLoginController {
  constructor($scope,authService,$state,modalService) {
    'ngInject';
    this.authService = authService;
    this.$state = $state;
    this.modalService = modalService;
    
    this.user = null;
    this.authInit();
  }
  
  authInit() {
    this.authService.getUserPromise().then((user) => {
      this.init(user);
      this.authService.bindWatcher(this.getAuthWatcher());
    }).catch((error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }
  
  getAuthWatcher(){
    return (user) => {
      this.init(user);
    };
  }
  
  init(user){
    this.setUser(user);
  }
  
  setUser(user){
    this.user = user;
  }
  
  login(){
    this.authService.login(this.username,this.pass).then((user) => {
      this.$state.go('volumio.auth.profile');
    },(error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }
  
  loginWithFacebook(){
    this.authService.loginWithFacebook();
  }
  
  loginWithGoogle(){
    this.authService.loginWithGoogle();
  }
  
  logOut(){
    this.authService.logOut();
  }
  
  goToRecoverPassword(){
    this.$state.go('volumio.auth.recover-password');
  }
  
}

export default AuthLoginController;