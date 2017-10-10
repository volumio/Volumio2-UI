class StripePayButtonDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/stripe-pay-button/stripe-pay-button.html',
      controller: StripePayButtonController,
      controllerAs: 'stripePayButtonController',
      scope: {
        stripeProduct: "=",
        callback: "&",
        userId: '<',
        buttonLabel: '@',
        buttonClass: '@'
      }
    };
    return directive;
  }
}

class StripePayButtonController {
  constructor($rootScope, $scope, $window, $timeout, $q, paymentsService, StripeCheckout) {
    'ngInject';
    this.$scope = $scope;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$q = $q;
    this.paymentsService = paymentsService;
    this.stripeCheckoutService = StripeCheckout;
    this.handler = {};
    
    this.btnIconClasses = {
      normal: "glyphicon glyphicon-shopping-cart",
      loading: "glyphicon glyphicon-refresh"
    };
    
    this.btnIconClass = this.btnIconClasses.normal;

    this.product = this.$scope.stripeProduct;
    this.callback = this.$scope.callback;
    this.userId = this.$scope.userId;
    this.buttonLabel = this.$scope.buttonLabel;
    this.buttonClass = this.$scope.buttonClass;

    this.init();
  }

  init() {
    this.loadStripe();
    this.initButtonUI();
  }
  
  initButtonUI(){
    if(this.buttonLabel === undefined){
      this.buttonLabel = "Buy now";
    }
  }

  loadStripe() {
    this.stripeCheckoutService.load().then(() => {
      this.initButton();
      this.initDestroyer();
    });
  }

  initButton() {
    this.handler = this.stripeCheckoutService.configure({
      key: 'pk_test_utxQAjiMNEdVZFel9iQlDkyH', //TODO insert in a config
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: this.getPayFunction()
    });
  }

  getPayFunction(){
    return (token) => {
      this.startLoading();
      var payment = this.product;
      payment['token'] = token;
      var subscribing = this.$q.defer();

      this.paymentsService.subscribe(payment, this.userId).then((success) => {
        console.log(success);
        this.stopLoading();
        subscribing.resolve(success);
      }, (error) => {
        this.stopLoading();
        console.log(error);
        subscribing.reject(error);
      });
      
      this.callback({subscribing: subscribing.promise});
    };
  }
  
  startLoading(){
    this.btnIconClass = this.btnIconClass.loading;
  }
  
  stopLoading(){
    this.btnIconClass = this.btnIconClasses.normal;
  }

  initDestroyer() {
    this.$window.addEventListener("popstate", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.$timeout(() => {
        this.handler.close();
      });
    });
  }

  handlePayment() {
    this.handler.open(this.product);
  }

}

export default StripePayButtonDirective;
