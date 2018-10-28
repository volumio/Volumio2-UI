class PaddleService {
  constructor(angularFireService, modalService, databaseService, $q, $http, $log, firebaseApiFunctionsService,
              devService) {
    'ngInject';

    this.angularFireService = angularFireService;
    this.modalService = modalService;
    this.databaseService = databaseService;
    this.$q = $q;
    this.$http = $http;
    this.$log = $log;
    this.firebaseApiFunctionsService = firebaseApiFunctionsService;
    this.devService = devService;

    this.paddleJsUrl = 'https://cdn.paddle.com/paddle/paddle.js';
    this.paddleS2SUrl = '';

    this.PADDLE_VENDOR_ID_PROD = 29290;
    this.PADDLE_VENDOR_ID_DEV = 36336;

    this.isLoaded = false;
    this.isInit = false;
    this.setupPaddle();
  }

  setupPaddle() {
    this.injectPaddleScript().then(() => {
      this.isLoaded = true;
      this.initPaddle();
    }).catch(error => {
      this.$log.debug('Paddle error: ' + error);
    });
  }

  injectPaddleScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = this.paddleJsUrl;
      script.addEventListener('load', resolve);
      script.addEventListener('error', () => reject('Error loading script.'));
      script.addEventListener('abort', () => reject('Script loading aborted.'));
      document.head.appendChild(script);
    });
  }

  initPaddle() {
    var isDev = this.isDev();
    var paddleVendorId = isDev ? this.PADDLE_VENDOR_ID_DEV : this.PADDLE_VENDOR_ID_PROD;
    var isDebug = isDev ? true : false;
    /* jshint ignore:start */
    Paddle.Setup({
      vendor: paddleVendorId,
      debug: isDebug
    });
    /* jshint ignore:end */
    this.isInit = true;
  }

  isDev(){
    return this.devService.isDevSync();
  }

  subscribe(subscription, userId) {

  }

  getPlanForSubscription(subscriptionId, userId) {

  }

  updateSubscription(newPlan, planDuration, userId, token) {
    var updating = this.$q.defer();

    var newPlanId;
    if (newPlan.paddleId){
      newPlanId = newPlan.paddleId;
    } else {
      newPlanId = newPlan.prices[planDuration].paddleId;
    }
    var subscription = this.executeUpdateSubscription(newPlanId, planDuration, userId, token);
    subscription.then((response) => {
      if (response && response.data && response.data.success) {
        updating.resolve(true);
      } else {
        updating.reject(response.data.error.message);
      }
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  cancelSubscription(userId, token) {
    var cancelling = this.$q.defer();
    var cancelSubscription = this.executeCancelSubscription(userId, token);
    cancelSubscription.then((response) => {
      if (response && response.data && response.data.success) {
        cancelling.resolve(true);
      } else {
        debugger;
        cancelling.reject(response.data.error.message);
      }
    }).catch((error) => {
      cancelling.reject('');
    });
    return cancelling.promise;
  }

  getSubscriptionCancelUrl(userId, token) {
    return this.firebaseApiFunctionsService.getSubscriptionCancelUrl(userId, token);
  }


  executeUpdateSubscription(newPlan, planDuration, userId, token) {
    return this.firebaseApiFunctionsService.executeUpdateSubscription(newPlan, planDuration, userId, token);
  }

  executeCancelSubscription(userId, token) {
    return this.firebaseApiFunctionsService.executeCancelSubscription(userId, token);
  }

  openUpdateSubscriptionMethod(updateUrl) {
    /* jshint ignore:start */
    Paddle.Checkout.open({
      override: updateUrl
    });
    /* jshint ignore:end */
  }

  openCancelSubscriptionByUrl(cancelUrl) {
    /* jshint ignore:start */
    Paddle.Checkout.open({
      override: cancelUrl
    });
    /* jshint ignore:end */
  }

}
export default PaddleService;