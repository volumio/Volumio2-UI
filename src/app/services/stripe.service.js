class StripeService {
  constructor(databaseService, authService, $q) {
    this.databaseService = databaseService;
    this.authService = authService;
    this.$q = $q;

    this.user = {};

    this.init();
  }

  init() {
    this.authService.getUserPromise();
  }

  processPayment() {

  }

  subscribe(subscription, userId) {
    var subscribing = this.$q.defer();
    var ref = 'payments/subscriptions/' + userId;

    this.databaseService.push(ref, subscription).then((subscriptionId) => {
      this.getSubscriptionResponse(subscriptionId, userId).then((status) => {
        console.log(status);
        if (status === true) {
          subscribing.resolve(status);
          return;
        }
        this.getSubscriptionError(subscriptionId, userId).then((error) => {
          subscribing.reject(error);
        });
      });
    }).catch((error) => {
      console.log(error);
      subscribing.reject(error);
    });
    return subscribing.promise;
  }

  getSubscriptionResponse(subscriptionId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/subscriptions/${userId}/${subscriptionId}/status`;
    this.databaseService.waitForValue(ref).then((status) => {
      console.log(status);
      getting.resolve(status);
    }, (error) => {
      console.log(error);
      getting.reject(error);
    });
    return getting.promise;
  }

  getPlanForSubscription(subscriptionId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/subscriptions/${userId}/${subscriptionId}/planCode`;
    this.databaseService.get(ref).then((planCode) => {
      getting.resolve(planCode);
    }, (error) => {
      getting.reject(error);
    });
    return getting.promise;
  }

  getSubscriptionError(subscriptionId, userId) {
    var getting = this.$q.defer();
    var ref = `/payments/subscriptions/${userId}/${subscriptionId}/error`;
    this.databaseService.get(ref).then((error) => {
      if(error === undefined){
        getting.resolve("No success but no stripe error");
        return;
      }
      getting.resolve(error);
    }, (error) => {
      getting.reject(error);
    });
    return getting.promise;
  }

}

export default StripeService;