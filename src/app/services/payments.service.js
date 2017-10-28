class PaymentsService {
  constructor(stripeService, $q) {
    'ngInject';
    this.stripeService = stripeService;
    this.$q = $q;
  }

  subscribe(subscription, userId) {
    var subscribing = this.$q.defer();
    this.stripeService.subscribe(subscription, userId).then((success) => {
      subscribing.resolve(success);
    }).catch((error) => {
      subscribing.reject(error);
    });
    return subscribing.promise;
  }

  cancelSubscription(subscriptionId,userId) {
    return this.stripeService.cancelSubscription(subscriptionId,userId);
  }
  
  updateSubscription(planCode,userId) {
    return this.stripeService.updateSubscription(planCode,userId);
  }

}

export default PaymentsService;