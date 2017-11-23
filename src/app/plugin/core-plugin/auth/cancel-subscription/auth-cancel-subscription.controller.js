class AuthCancelSubscriptionController {
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

    this.plan = 'free';
    this.user = user;
    this.product = null;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
      this.postAuthInit();
    });
  }

  postAuthInit() {
    this.loadProduct();
  }

  downgradeToFree() {
    if (!this.user.subscriptionId) {
      this.modalService.openDefaultErrorModal("AUTH.CANNOT_DOWNGRADE_NO_PLAN");
      return;
    }
    this.cancellationCallback(this.paymentsService.cancelSubscription(this.user.subscriptionId, this.user.uid));
  }

  cancellationCallback(cancelling) {
    this.openCancellingModal();
    cancelling.then((status) => {
      this.closeCancellingModal();
      if (status === true) {
        this.goToCancellingSuccess();
        return;
      }
      this.goToCancellingFail();
    }).catch((error) => {
      this.modalService.openDefaultErrorModal(error, () => {
        this.closeCancellingModal();
        this.goToCancellingFail();
      });
    });
  }

  openCancellingModal() {
    let
            templateUrl = 'app/plugin/core-plugin/auth/modals/auth-paying-modal/auth-paying-modal.html',
            controller = 'AuthPayingModalController',
            params = {
              title: this.filteredTranslate('AUTH.PAYING')
            };
    this.openedModal = this.modalService.openModal(
            controller,
            templateUrl,
            params,
            'md');
  }

  closeCancellingModal() {
    this.openedModal.close();
  }

  goToCancellingSuccess() {
    this.$state.go('volumio.auth.payment-success');
  }

  goToCancellingFail() {
    this.$state.go('volumio.auth.payment-fail');
  }

  loadProduct() {
    this.productsService.getProductByCode(this.plan).then(product => {
      this.product = product;
    });
  }

  getCurrentPlanName() {
    return this.user.plan;
  }

  logIn() {
    this.$state.go('volumio.auth.login');
  }

  goToPlans() {
    this.$state.go('volumio.auth.plans');
  }

}

export default AuthCancelSubscriptionController;
