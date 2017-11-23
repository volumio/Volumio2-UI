class ProductsService {
  constructor(databaseService,socketService,$q) {
    this.databaseService = databaseService;
    this.socketService = socketService;
    this.$q = $q;

    this.version = "002000"; //TODO GET VERSION

    this.products = null;
    this.init();
  }

  init(){
    this.getProducts().then(productsPayload => {

    });
  }

  getProducts() {
    if (this.products === null) {
      return this.loadProducts();
    }
    var getting = this.$q.defer();
    getting.resolve(this.products);
    return getting.promise;
  }

  loadProducts(){
    var loading = this.$q.defer();
    this.databaseService.getInfByKey('products', this.version).then(productsPayload => {
      this.products = productsPayload[Object.keys(productsPayload)[0]];
      loading.resolve(this.products);
    });
    return loading.promise;
  }

  getProductByCode(code) {
    var getting = this.$q.defer();
    if (this.products === null) {
      this.loadProducts().then(products => {
        getting.resolve(products[code]);
      });
    }else{
      getting.resolve(this.products[code]);
    }
    return getting.promise;
  }

  getProductForUser(user){
    return this.getProductByCode(user.plan || 'free');
  }

}

export default ProductsService;
