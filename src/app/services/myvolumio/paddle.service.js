class PaddleService {
  constructor(angularFireService, modalService, databaseService, $q, $http, $log) {
    'ngInject';

    this.angularFireService = angularFireService;
    this.modalService = modalService;
    this.databaseService = databaseService;
    this.$q = $q;
    this.$http = $http;
    this.$log = $log;


    this.paddleJsUrl = 'https://cdn.paddle.com/paddle/paddle.js';
    this.paddleS2SUrl = '';
    this.paddleVendorId = 29290;

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
    /* jshint ignore:start */
    Paddle.Setup({
      vendor: this.paddleVendorId,
      debug: false
    });
    /* jshint ignore:end */
    this.isInit = true;
  }

  subscribe(subscription, userId) {

  }

  getPlanForSubscription(subscriptionId, userId) {

  }

  updateSubscription(newPlan, userId, token) {
    var updating = this.$q.defer();
    var newPlanId = newPlan.paddleId;
    var subscription = this.executeUpdateSuscription(newPlanId, userId, token);
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
    let promise = new Promise((resolve, reject) => {
      this.$http({
        url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/getSubscriptionCancelUrl',
        method: "POST",
        params: { "token": token, "uid": userId }
      }).then(
        res => {
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      );
    });
    return promise;
  }


  executeUpdateSuscription(newPlan, userId, token) {

    let promise = new Promise((resolve, reject) => {
      this.$http({
        url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/updateSubscription',
        method: "POST",
        params: { "token": token, "uid": userId, "newPlan": newPlan }
      }).then(
        res => {
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      );
    });
    return promise;
  }

  executeCancelSubscription(userId, token) {
    let promise = new Promise((resolve, reject) => {
      this.$http({
        url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/cancelSubscription',
        method: "POST",
        params: { "token": token, "uid": userId }
      }).then(
        res => {
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      );
    });
    return promise;
  }


}
export default PaddleService;
