class MyVolumioSubscribeController {
  constructor($scope, $state, $stateParams, $q, authService, user, paymentsService, StripeCheckout, modalService, productsService, $filter) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.modalService = modalService;
    this.paymentsService = paymentsService;
    this.authService = authService;
    this.stripeCheckout = StripeCheckout;
    this.productsService = productsService;
    this.filteredTranslate = $filter('translate');

    this.openedModal = {};

    this.product = null;
    this.showMode = { planDuration : null };
    this.user = user;

    this.init();
  }

  init() {
    this.authInit();
    this.loadProduct();
    this.loadPlanDuration();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
    });
  }

  subscriptionCallback(subscribing) {
    this.openPayingModal();
    
    subscribing.then((status) => {
      this.closePayingModal();
      if (status === true) {
        this.goToPaymentSuccess();
        return;
      }
      this.goToPaymentFail();
    }, (error) => {
      //error = JSON.stringify(error);
      this.modalService.openDefaultErrorModal(error, () => {
        this.closePayingModal();
        this.goToPaymentFail();
      });
    });
  }

  openPayingModal() {
    let
      templateUrl = 'app/components/myvolumio/modals/myvolumio-paying-modal/myvolumio-paying-modal.html',
      controller = 'MyVolumioPayingModalController',
      params = {
        title: this.filteredTranslate('MYVOLUMIO.PAYNG')
      };
    this.openedModal = this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'md');
  }

  closePayingModal() {
    this.openedModal.close();
  }

  goToPaymentSuccess() {
    this.$state.go('myvolumio.payment-success');
  }

  goToPaymentFail() {
    this.$state.go('myvolumio.payment-fail');
  }

  loadProduct() {
    var code = this.$stateParams['plan'];
    this.productsService.getProductByCode(code).then(product => {
      this.product = product;
    });
  }

  goToPlans() {
    this.$state.go('myvolumio.plans');
  }

  loadPlanDuration(){
    this.showMode.planDuration = this.$stateParams['planDuration'];
  }

}

export default MyVolumioSubscribeController;