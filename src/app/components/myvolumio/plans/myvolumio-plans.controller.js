class MyVolumioPlansController {
  constructor($scope, paymentsService, $state, $q, authService, productsService, modalService, user, $filter) {
    'ngInject';
    this.$scope = $scope;
    this.paymentsService = paymentsService;
    this.authService = authService;
    this.productService = productsService;
    this.$state = $state;
    this.$q = $q;
    this.paymentsService = paymentsService;
    this.modalService = modalService;

    this.user = user;

    this.$translate = $filter('translate');

    this.products = {};
    this.product0 = null;
    this.product1 = null;
    this.product2 = null;

    this.showYearly = false;
    this.showMode = {
      planDuration: this.getSelectedPlanDuration()
    };

    this.switchLabelMonthly = this.$translate('MYVOLUMIO.MONTHLY');
    this.switchLabelYearly = this.$translate('MYVOLUMIO.YEARLY');

    this.init();
  }

  init() {
    this.authInit();
    this.initProducts();
    this.initShowMode();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
    });
  }

  initProducts() {
    this.productService.getProducts().then(products => {
      this.products = products;
      this.product0 = this.products.free;
      this.product1 = this.products.virtuoso;
      this.product2 = this.products.superstar;
    });
  }

  initShowMode(){
    this.$scope.$watch(() => this.showYearly, (showYearly,was,scope) => {
      this.showMode.planDuration = this.getSelectedPlanDuration();
    });
  }

  getSelectedPlanDuration(){
    return this.showYearly === true ? this.productService.YEARLY_PLAN : this.productService.MONTHLY_PLAN;
  }

}

export default MyVolumioPlansController;