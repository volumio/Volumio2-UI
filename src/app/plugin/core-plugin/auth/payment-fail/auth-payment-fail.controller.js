class AuthPaymentFailController{
  constructor($scope, $state, user){
    'ngInject';
    this.$state = $state;
    
    this.user = user;
  }
  
  retryPayment(){
    this.$state.go('volumio.auth.plans');
  }
}

export default AuthPaymentFailController;