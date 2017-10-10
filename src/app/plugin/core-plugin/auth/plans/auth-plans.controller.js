class AuthPlansController {
  constructor(paymentsService, $state, $q, authService,productsService) {
    this.paymentsService = paymentsService;
    this.authService = authService;
    this.productService = productsService;
    this.$state = $state;
    this.$q = $q;
    this.paymentsService = paymentsService;

    this.user = null;
    this.products = {};
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
  
  initProducts(){
    this.products = this.productService.getProducts();
    this.product1 = this.products.virtuoso;
    this.product2 = this.products.superstar;
  }

  subscribePlus() {
    this.subscribe('plus');
  }

  subscribePro() {
    this.subscribe('pro');
  }

  subscribe(plan) {
    this.$state.go('volumio.auth.subscribe', {'plan': plan});
  }
  
  downgradeToProduct1(){
    
  }
  
  downgradeToFree(){
    this.$state.go('volumio.auth.cancel-subscription');
  }

}

export default AuthPlansController;