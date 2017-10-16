class AuthPlansController {
  constructor(paymentsService, $state, $q, authService,productsService,modalService) {
    this.paymentsService = paymentsService;
    this.authService = authService;
    this.productService = productsService;
    this.$state = $state;
    this.$q = $q;
    this.paymentsService = paymentsService;
    this.modalService = modalService;

    this.user = null;
    this.products = {};
    this.product0 = null;
    this.product1 = null;
    this.product2 = null;

    this.init();
  }

  init() {
    this.authInit();
    this.initProducts();
  }

  authInit() {
    this.authService.getUserPromise().then((user) => {
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher());
    }).catch((error) => {
      this.modalService.openDefaultErrorModal(error);
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
  
  initProducts(){
    this.products = this.productService.getProducts();
    this.product0 = this.products.free;
    this.product1 = this.products.virtuoso;
    this.product2 = this.products.superstar;
  }

}

export default AuthPlansController;