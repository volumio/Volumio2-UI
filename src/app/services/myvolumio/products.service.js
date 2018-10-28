class ProductsService {
  constructor(databaseService, socketService, $q) {
    'ngInject';
    this.databaseService = databaseService;
    this.socketService = socketService;
    this.$q = $q;

    this.version = "002001"; //TODO GET VERSION

    this.MONTHLY_PLAN = 'monthly';
    this.YEARLY_PLAN = 'yearly';
    this.LIFETIME_PLAN = 'lifetime';

    this.products = null;
    this.init();
  }

  init() {
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

  loadProducts() {
    var loading = this.$q.defer();
    this.databaseService.getInfByKey('products', this.version).then(productsPayload => {
      this.products = productsPayload[Object.keys(productsPayload)[0]];
      this.products.free.features = ["MYVOLUMIO_PLANS.LATEST_NEWS", "EMPTY", "EMPTY", "EMPTY", "EMPTY"];
      this.products.virtuoso.features = ["MYVOLUMIO_PLANS.LATEST_NEWS", "MYVOLUMIO_PLANS.MYVOLUMIO_1_DEVICE", "MYVOLUMIO_PLANS.AUTO_SYNC", "MYVOLUMIO_PLANS.REMOTE_CONNECTION_1_DEVICE", "MYVOLUMIO_PLANS.NATIVE_TIDAL_QOBUZ_INTEGRATION"];
      this.products.superstar.features = ["MYVOLUMIO_PLANS.LATEST_NEWS", "MYVOLUMIO_PLANS.MYVOLUMIO_6_DEVICES", "MYVOLUMIO_PLANS.AUTO_SYNC", "MYVOLUMIO_PLANS.REMOTE_CONNECTION_6_DEVICES", "MYVOLUMIO_PLANS.NATIVE_TIDAL_QOBUZ_INTEGRATION"];
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
    } else {
      getting.resolve(this.products[code]);
    }
    return getting.promise;
  }

  getProductForUser(user) {
    return this.getProductByCode(user.plan || 'free');
  }
}

export default ProductsService;