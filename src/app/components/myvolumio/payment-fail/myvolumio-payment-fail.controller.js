class MyVolumioPaymentFailController {
  constructor($scope, $state, user) {
    'ngInject';
    this.$state = $state;

    this.user = user;
  }

  retryPayment() {
    this.$state.go('myvolumio.plans');
  }
}

export default MyVolumioPaymentFailController;