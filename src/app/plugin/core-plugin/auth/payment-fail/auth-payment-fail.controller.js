class AuthPaymentFailController{
  constructor($scope, $state){
    'ngInject';
    this.$state = $state;
  }
  
  retryPayment(){
    this.$state.go('volumio.auth.plans');
  }
}

export default AuthPaymentFailController;