class AuthLoginController {
  constructor($scope,authService,$state) {
    this.authService = authService;
    this.$state = $state;
    
    this.user = null;
    this.authInit();
  }
  
  authInit() {
    this.authService.getUserPromise().then((user) => {
      this.init(user);
      this.authService.bindWatcher(this.getAuthWatcher());
    }).catch((error) => {
      console.log(error);
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
      alert(error);
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

//is it possible to export with namespace (ie. Auth.LoginController ) ?
export default AuthLoginController;