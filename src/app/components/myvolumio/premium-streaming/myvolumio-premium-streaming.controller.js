class MyVolumioPremiumStreamingController {
    constructor($scope, paymentsService, productsService, $state, authService, modalService, $translate, user) {
      'ngInject';
      this.$scope = $scope;
      this.$state = $state;

      this.authService = authService;
      this.$translate = $translate;
      this.paymentsService = paymentsService;
      this.productService = productsService;

      this.user = null;
      this.newUser = null;
      this.authUser = null;

      this.form = {
        termsCheckbox: false,
        marketingConsent: false
      };
      this.$scope.step = 1;
      this.signUpInitiated = false;
      this.products = [];
      this.productsObj = {};
      this.cheapestPrice = 2.99;

      this.$scope.model = {};
      this.$scope.model.selectedProduct = null;

      this.selectedPlanDuration = 'yearly';
      this.switchLabelMonthly = this.$translate('MYVOLUMIO.MONTHLY');
      this.switchLabelYearly = this.$translate('MYVOLUMIO.YEARLY');

      this.init();
    }

    selectProduct(product) {
      //console.log(product);
    }

    init() {
      this.authInit();
      this.initProducts();
      this.$scope.model.selectedProduct = 'virtuoso';
    }

    authInit() {
      this.$scope.$watch(() => this.authService.user, (user) => {
        // this.postAuthInit();
        this.authUser = user;
      });
    }

    loginWithFacebook() {
      this.loginWithProvider('facebook');
    }

    loginWithGoogle() {
      this.loginWithProvider('google');
    }

    loginWithGithub() {
      this.loginWithProvider('github');
    }

    loginWithProvider(provider) {
      this.authService.loginWithProvider(provider).catch(error => {
        this.modalService.openDefaultErrorModal(error);
      });
    }

    initProducts() {
      this.productService.getProducts().then(products => {
        this.productsObj = products;
        this.products = [ products.free, products.virtuoso, products.superstar ];
        this.findCheapestOption();
      });
    }

    findCheapestOption() {
      let priceList = [];
      this.products.map(p => {
        if (p.prices) {
          Object.keys(p.prices).map(pr => {
            if (p.prices[pr].amount) {
              if (p.prices[pr].amount > 0) {
                priceList.push(p.prices[pr].amount);
              }
            }
          });
        }
      });
      this.cheapestPrice = Math.min.apply( Math, priceList);
    }

    goToLogin() {
      this.$state.go('myvolumio.login');
    }

    goToMyVolumio() {
      if (this.authUser) {
        this.$state.go('myvolumio.plans');
      } else {
        this.$state.go('myvolumio.signup');
      }
    }

    goToSettings() {
      this.$state.go('volumio.plugin', { pluginName: 'miscellanea/my_music' });
    }


    /* ====== PADDLE PAYMENT HANDLING */

    getPaddleProductId(){
      if(this.productsObj[this.$scope.model.selectedProduct].prices === undefined || this.selectedPlanDuration === undefined){
        return undefined;
      }
      return this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].paddleId;
    }

    getTrialParameters(){
      if(this.productsObj[this.$scope.model.selectedProduct].prices === undefined || this.selectedPlanDuration === undefined){
        return undefined;
      }
      var trialParameters = {"trialDays":"", "trialDaysAuth":"", "trialAuth":""};
      if ( this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].trial.trialEnabled &&
           this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].trial.trialDays &&
           this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].trial.trialDaysAuth &&
           this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].trial.trialAuth) {

        trialParameters.trialDays = this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].trial.trialDays;
        trialParameters.trialDaysAuth = this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].trial.trialDaysAuth;
        trialParameters.trialAuth = this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].trial.trialAuth;

      }
      return trialParameters;
    }

    isTrial() {
      return !!this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].trial;
    }

    handlePayment() {

      if (this.$scope.model.selectedProduct === 'free') {
        this.$state.go('myvolumio.profile');
        return;
      }

      var paddleId = this.getPaddleProductId();
      var trialDays = '';
      var trialDaysAuth = '';
      var trialPrice = '';
      var trialAuth = '';
      if (this.isTrial()) {
        var trialParameters = this.getTrialParameters();
        trialDays = trialParameters.trialDays;
        trialDaysAuth = trialParameters.trialDaysAuth;
        trialAuth = trialParameters.trialAuth;
        trialPrice = 0;
      }

      if(paddleId === undefined || !Number.isInteger(paddleId) ){
        alert("Error, no transaction occurred, no paddleId found.");
        return;
      }
      if(!this.newUser){
        alert("Error, no transaction occurred, no authenticated user found.");
        return;
      }
      /* jshint ignore:start */

      let checkoutProps = {
        product: paddleId,
        email: this.newUser.email,
        passthrough: { "email": this.newUser.email, "uid": this.newUser.uid },
        trialDays: trialDays,
        trialDaysAuth: trialDaysAuth,
        price: trialPrice,
        auth:trialAuth,
        successCallback: (data) => {
          this.successCallback(data);
        },
        closeCallback: (data) => {
          this.closeCallback(data);
        }
      }

      if (this.couponCode) {
        checkoutProps.coupon = this.couponCode;
      }

      Paddle.Checkout.open(checkoutProps, false);
      /* jshint ignore:end */
    }

    successCallback(data) {
      this.$state.go('myvolumio.payment-success');
    }

    closeCallback(error) {
      this.modalService.openDefaultErrorModal('MYVOLUMIO.COMPLETE_CHECKOUT');
    }

  }

  export default MyVolumioPremiumStreamingController;
