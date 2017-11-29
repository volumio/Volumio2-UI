class AuthPaymentSuccessController{
  constructor($scope, $state, user){
    'ngInject';
    this.$state = $state;

    this.user = user;
  }

  goToProfile(){
    this.$state.go('myvolumio.profile');
  }
}

export default AuthPaymentSuccessController;
