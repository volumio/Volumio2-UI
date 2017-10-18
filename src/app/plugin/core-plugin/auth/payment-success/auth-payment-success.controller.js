class AuthPaymentSuccessController{
  constructor($scope, $state){
    'ngInject';
    this.$state = $state;
  }
  
  goToProfile(){
    this.$state.go('volumio.auth.profile');
  }
}

export default AuthPaymentSuccessController;