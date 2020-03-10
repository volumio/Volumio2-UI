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
    this.overrideTrial = false;

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
      this.products.free.features = ["MYVOLUMIO_PLANS.LATEST_NEWS", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"];
      this.products.virtuoso.features = ["MYVOLUMIO_PLANS.LATEST_NEWS", "MYVOLUMIO_PLANS.MYVOLUMIO_1_DEVICE", "MYVOLUMIO_PLANS.AUTO_SYNC", "MYVOLUMIO_PLANS.REMOTE_CONNECTION_1_DEVICE", "MYVOLUMIO_PLANS.NATIVE_TIDAL_QOBUZ_INTEGRATION", "MYVOLUMIO_PLANS.CD_PLAYBACK_RIPPING", "MYVOLUMIO_PLANS.ALEXA_INTEGRATION", "MYVOLUMIO_PLANS.BLUETOOTH_INPUT", "EMPTY", "EMPTY"];
      this.products.superstar.features = ["MYVOLUMIO_PLANS.LATEST_NEWS", "MYVOLUMIO_PLANS.MYVOLUMIO_6_DEVICES", "MYVOLUMIO_PLANS.AUTO_SYNC", "MYVOLUMIO_PLANS.REMOTE_CONNECTION_6_DEVICES", "MYVOLUMIO_PLANS.NATIVE_TIDAL_QOBUZ_INTEGRATION", "MYVOLUMIO_PLANS.CD_PLAYBACK_RIPPING", "MYVOLUMIO_PLANS.ALEXA_INTEGRATION", "MYVOLUMIO_PLANS.BLUETOOTH_INPUT", "MYVOLUMIO_PLANS.HIRESAUDIO_INTEGRATION", "MYVOLUMIO_PLANS.INPUT_PLAYBACK"];
      this.localizeProductsPricing().then(()=>{
        loading.resolve(this.products);
      });
    });
    return loading.promise;
  }

  localizeProductsPricing() {
    var defer = this.$q.defer();
    var promises = [];
    for (var duration in this.products.virtuoso.prices) {
        promises.push(this.localizeProductByCode(this.products.virtuoso.prices[duration].paddleId, duration, 'virtuoso'));
    }
    for (var duration in this.products.superstar.prices) {
        promises.push(this.localizeProductByCode(this.products.superstar.prices[duration].paddleId, duration, 'superstar'));
    }
    this.$q.all(promises).then(() => {
      defer.resolve();
    });
    return defer.promise;
  }

  localizeProductByCode(code, duration, tier) {
    var defer = this.$q.defer();
    /* jshint ignore:start */
    Paddle.Product.Prices(code, (prices)=> {
      var rawPrice = prices.recurring.price.gross;
      var numericPrice = Number(rawPrice.replace(/[^0-9\.]+/g, ''));
      var localizedPrice = numericPrice + ' ' + rawPrice.replace(numericPrice, '');
      this.products[tier].prices[duration].localizedPrice = localizedPrice;
      defer.resolve();
    });
    /* jshint ignore:end */
    return defer.promise;
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

  setTrialOverride(data) {
    this.overrideTrial = data;
  }

  getTrialOverride() {
    return this.overrideTrial;
  }
}

export default ProductsService;
