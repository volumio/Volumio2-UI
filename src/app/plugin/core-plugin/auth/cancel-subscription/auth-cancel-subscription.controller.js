class AuthCancelSubscriptionController {
  constructor($scope, $state, $stateParams, $q, authService, paymentsService, StripeCheckout, modalService, productsService) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.modalService = modalService;
    this.paymentsService = paymentsService;
    this.authService = authService;
    this.stripeCheckout = StripeCheckout;
    this.productsService = productsService;

    this.openedModal = {};

    this.subscription = null;
    this.user = null;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.authService.getUserPromise().then((user) => {
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher());
    }).catch((error) => {
      console.log(error);
    });
  }

  getAuthWatcher() {
    return (user) => {
      this.postAuthInit(user);
    };
  }

  postAuthInit(user) {
    this.setUser(user);
    this.subscription = user.plan;
  }

  setUser(user) {
    this.user = user;
  }

  downgradeToFree() {
    if(!this.user.subscriptionId){
      alert("Error, no subscription id");
      return;
    }
    this.cancellationCallback(this.paymentsService.cancelSubscription(this.user.subscriptionId, this.user.uid ));
  }

  cancellationCallback(cancelling) {
    this.openCancellingModal();
    cancelling.then((status) => {
      console.log(status);
      this.closeCancellingModal();
      if (status === true) {
        this.goToCancellingSuccess();
        return;
      }
      this.goToCancellingFail();
    }, (error) => {
      console.log("error");
      console.log(error); //TODO Modal Error and THEN redirect
      this.closeCancellingModal();
      this.goToCancellingFail();
    });
  }

  openCancellingModal() {
    let
            templateUrl = 'app/plugin/core-plugin/auth/modals/auth-paying-modal/auth-paying-modal.html',
            controller = 'AuthPayingModalController',
            params = {
              title: 'Paying...' //TODO
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
    this.$state.go('volumio.auth.payment-success'); //TODO
  }

  goToCancellingFail() {
    this.$state.go('volumio.auth.payment-fail'); //TODO
  }

  loadProduct() { //unused
    var code = this.$stateParams['plan'];
    console.log("this.$stateParams['plan']");
    console.log(this.$stateParams['plan']);
    this.product = this.productsService.getProductByCode(code);
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