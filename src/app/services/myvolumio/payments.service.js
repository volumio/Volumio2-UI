class PaymentsService {
  constructor(stripeService, paddleService, $q) {
    'ngInject';
    this.stripeService = stripeService;
    this.paddleService = paddleService;
    this.$q = $q;
  }

  /*subscribe(subscription, userId) {
    return this.stripeService.subscribe(subscription, userId);
  }

  cancelSubscription(subscriptionId, userId) {
    return this.stripeService.cancelSubscription(subscriptionId, userId);
  }

  updateSubscription(planCode, userId) {
    return this.stripeService.updateSubscription(planCode, userId);
  }*/

  subscribe(subscription, userId) {
    return this.paddleService.subscribe(subscription, userId);
  }

  cancelSubscription(user, token) {
    return this.paddleService.cancelSubscription(user, token);
  }

  updateSubscription(planCode, planDuration, userId, token) {
    return this.paddleService.updateSubscription(planCode, planDuration, userId, token);
  }

}

export default PaymentsService;
