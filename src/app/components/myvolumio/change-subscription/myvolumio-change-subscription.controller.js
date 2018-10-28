class MyVolumioChangeSubscriptionController {
  constructor($scope, $state, $stateParams, $q, $log, authService, user, paymentsService, StripeCheckout, modalService, productsService, $filter, $document) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$log = $log;
    this.modalService = modalService;
    this.paymentsService = paymentsService;
    this.authService = authService;
    this.stripeCheckout = StripeCheckout;
    this.productsService = productsService;
    this.filteredTranslate = $filter('translate');
    this.$document = $document;
    this.openedModal = {};

    this.user = user;
    this.product = null;
    this.planDuration = null;
    this.showMode = { planDuration: 'monthly' };

    this.init();
  }

  init() {
    this.loadProduct();
    this.authInit();
    this.loadPlanDuration();
  }

  loadProduct() {
    var plan = this.$stateParams['plan'];
    this.productsService.getProductByCode(plan).then(product => {
      this.product = product;
    });
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
    });
  }

  loadPlanDuration(){
    this.planDuration = this.$stateParams['planDuration'];
    this.showMode.planDuration = this.planDuration;
  }

  changePlan() {
    if (this.user.planData.subscriptionId === undefined || this.user.planData.subscriptionId === null) {
      this.modalService.openDefaultErrorModal("MYVOLUMIO.ERROR_CHANGE_PLAN_NO_PREVIOUS_PLAN_FOUND");
      return;
    }
    if (this.product === undefined || this.product === null || this.product.planCode === undefined) {
      this.modalService.openDefaultErrorModal("MYVOLUMIO.ERROR_CHANGE_PLAN_NO_PLAN_SELECTED");
      return;
    }
    this.modalService.openDefaultConfirm('MYVOLUMIO.CONFIRM_CHANGE_PLAN_TITLE', 'MYVOLUMIO.CONFIRM_CHANGE_PLAN', () => {
      this.openUpdatingModal();
      this.authService.getUserToken().then(token => {
        this.paymentsService.updateSubscription(this.product, this.planDuration, this.user.uid, token)
          .then(success => {
            this.closeUpdatingModal();
            this.goToUpdatingSuccess();
          })
          .catch(error => {
            this.$log.debug(error);
            var errorMessage = 'Payment Failed';
            if (error.data.error.message) {
              errorMessage = error.data.error.message;
            }
            this.modalService.openDefaultErrorModal(errorMessage);
            this.closeUpdatingModal();
            this.goToUpdatingFail();
          });
      });
    });
  }

  openUpdatingModal() {
    let
      templateUrl = 'app/components/myvolumio/modals/myvolumio-paying-modal/myvolumio-paying-modal.html',
      controller = 'MyVolumioPayingModalController',
      params = {
        title: this.filteredTranslate('MYVOLUMIO.PAYMENT_IN_PROGRESS')
      };
    this.openedModal = this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'md');
  }

  closeUpdatingModal() {
    this.openedModal.close();
  }

  goToUpdatingSuccess() {
    this.$state.go('myvolumio.payment-success');
  }

  goToUpdatingFail() {
    this.$state.go('myvolumio.payment-fail');
  }

  logIn() {
    this.$state.go('myvolumio.login');
  }

  goToPlans() {
    this.$state.go('myvolumio.plans');
  }

  getCurrentPlanName() {
    return this.user.plan;
  }

}

export default MyVolumioChangeSubscriptionController;
