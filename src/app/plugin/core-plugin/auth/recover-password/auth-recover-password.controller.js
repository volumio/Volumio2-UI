class AuthRecoverPasswordController{
  constructor($state,authService){
    this.authService = authService;
    this.$state = $state;
    
    this.email = "";
    
    this.sent = false;
    
  }
  
  doRecover(){
    if(this.email){
      this.authService.recoverPassword(this.email).then(() => {
        this.sent = true;
      }).catch((error) => {
        alert(error); //TODO error in modal
      });
    }
  }
  
  goToLogin(){
    this.$state.go('volumio.auth.login');
  }
  
}

export default AuthRecoverPasswordController;