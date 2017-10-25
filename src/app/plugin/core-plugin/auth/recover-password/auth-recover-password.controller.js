class AuthRecoverPasswordController{
  constructor($state,authService, modalService, user){
    'ngInject';
    this.authService = authService;
    this.$state = $state;
    this.modalService = modalService;
    
    this.email = "";
    this.sent = false;
    
    this.user = user;
  }
  
  doRecover(){
    if(this.email){
      this.authService.recoverPassword(this.email).then(() => {
        this.sent = true;
      }).catch((error) => {
        this.modalService.openDefaultErrorModal(error);
      });
    }
  }
  
  goToLogin(){
    this.$state.go('volumio.auth.login');
  }
  
}

export default AuthRecoverPasswordController;