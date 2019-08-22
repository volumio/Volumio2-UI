class MyVolumioCancelSubscriptionController {
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
    if (!this.user.planData.subscriptionId) {
      this.modalService.openDefaultErrorModal("MYVOLUMIO.NO_SUBSCRIPTION");
      return;
    }
    this.modalService.openDefaultConfirm('MYVOLUMIO.CONFIRM_CANCEL_PLAN_TITLE', 'MYVOLUMIO.CONFIRM_CANCEL_PLAN', () => {
      this.openCancellingModal();
      this.authService.getUserToken().then(token => {
        this.paymentsService.cancelSubscription(this.user.uid, token)
          .then((success) => {
            this.closeCancellingModal();
            this.$state.go('myvolumio.payment-success');
          })
          .catch(error => {
            this.closeCancellingModal();
            this.modalService.openDefaultErrorModal("MYVOLUMIO.CANCELLATION_FAILED");
          });
      });
    });
  }

  /*  cancellationCallback(cancelling) {
      //this.openCancellingModal();
      cancelling.then((status) => {
        //this.closeCancellingModal();
        if (status === true) {
          this.goToCancellingSuccess();
          return;
        }
        this.goToCancellingFail();
      }).catch((error) => {
        //this.closeCancellingModal();
        //this.modalService.openDefaultErrorModal(error, () => {
        //  this.goToCancellingFail();
        //});
      });
    }
    */

  openCancellingModal() {
    let
      templateUrl = 'app/components/myvolumio/modals/myvolumio-paying-modal/myvolumio-paying-modal.html',
      controller = 'MyVolumioPayingModalController',
      params = {
        title: this.filteredTranslate('MYVOLUMIO.PAYING')
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
    this.$state.go('myvolumio.payment-success');
  }

  goToCancellingFail() {
    this.$state.go('myvolumio.payment-fail');
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
    this.$state.go('myvolumio.login');
  }

  goToPlans() {
    this.$state.go('myvolumio.plans');
  }

}

export default MyVolumioCancelSubscriptionController;