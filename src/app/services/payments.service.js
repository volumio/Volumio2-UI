class PaymentsService{
  constructor(stripeService,$q){
    this.stripeService = stripeService;
    this.$q = $q;
  }
  
  stripeSubscribe(subscription, userId){
    var subscribing = this.$q.defer();
    this.stripeService.subscribe(subscription, userId).then((success) => {
      console.log(success);
      subscribing.resolve(success);
    }).catch((error) => {
      console.log(error);
      subscribing.reject(error);
    });
    return subscribing.promise;
  }
  
}

export default PaymentsService;