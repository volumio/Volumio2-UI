class PaymentsService {
  constructor(stripeService, $q) {
    'ngInject';
    this.stripeService = stripeService;
    this.$q = $q;
  }

  subscribe(subscription, userId) {
    return this.stripeService.subscribe(subscription, userId);
  }

  cancelSubscription(subscriptionId,userId) {
    return this.stripeService.cancelSubscription(subscriptionId,userId);
  }

  updateSubscription(planCode,userId) {
    return this.stripeService.updateSubscription(planCode,userId);
  }

}

export default PaymentsService;
