class AuthChangeSubscriptionController {
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

    this.user = null;
    this.product = null;

    this.init();
  }

  init() {
    this.loadProduct();
    this.authInit();
  }

  loadProduct() {
    var plan = this.$stateParams['plan'];
    this.product = this.productsService.getProductByCode(plan);
  }

  loadProduct() {
    var code = this.$stateParams['plan'];
    this.product = this.productsService.getProductByCode(code);
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
  }

  setUser(user) {
    this.user = user;
  }

  changePlan() {
    if (this.user.subscriptionId === undefined || this.user.subscriptionId === null) {
      alert("Error, no subscription id."); //TODO
      return;
    }
    if (this.product === undefined || this.product === null || this.product.planCode === undefined) {
      alert("Error, no plan to change to."); //TODO
      return;
    }
    this.updateCallback(this.paymentsService.updateSubscription(this.product.planCode, this.user.uid));
  }

  updateCallback(cancelling) {
    this.openUpdatingModal();
    cancelling.then((status) => {
      console.log(status);
      this.closeUpdatingModal();
      if (status === true) {
        this.goToUpdatingSuccess();
        return;
      }
      this.goToUpdatingFail();
    }).catch((error) => {
      console.log("error");
      console.log(error); //TODO Modal Error and THEN redirect
      this.closeUpdatingModal();
      this.goToUpdatingFail();
    });
  }

  openUpdatingModal() {
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

  closeUpdatingModal() {
    this.openedModal.close();
  }

  goToUpdatingSuccess() {
    this.$state.go('volumio.auth.payment-success'); //TODO
  }

  goToUpdatingFail() {
    this.$state.go('volumio.auth.payment-fail'); //TODO
  }

  logIn() {
    this.$state.go('volumio.auth.login');
  }

  goToPlans() {
    this.$state.go('volumio.auth.plans');
  }
  
  getCurrentPlanName() {
    return this.user.plan;
  }

}

export default AuthChangeSubscriptionController;