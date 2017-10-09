class AuthPaymentFailController{
  constructor($scope, $state){
    this.$state = $state;
  }
  
  retryPayment(){
    this.$state.go('volumio.auth.plans');
  }
}

export default AuthPaymentFailController;