class MyVolumioSignupNewController {
  constructor($scope, paymentsService, productsService, $state, authService, modalService, $translate, $filter, user, $log, socketService, $rootScope, statisticsService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.modalService = modalService;
    this.authService = authService;
    this.$translate = $translate;
    this.filteredTranslate = $filter('translate');
    this.paymentsService = paymentsService;
    this.productService = productsService;
    this.$log = $log;
    this.socketService = socketService;
    this.$rootScope = $rootScope;
    this.statisticsService = statisticsService;


    this.user = user;
    this.newUser = null;

    this.form = {
      termsCheckbox: false,
      marketingConsent: false
    };
    this.$scope.step = 1;
    this.signUpInitiated = false;
    this.products = [];
    this.productsObj = {};

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
    this.initSocket();
    if (this.productService.isVolumioV3) {
      this.$scope.model.selectedProduct = 'premium';
    } else {
      this.$scope.model.selectedProduct = 'virtuoso';
    }

  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      // this.postAuthInit();
    });
  }

  postAuthInit() {
    if (this.user !== null) {
      // Make sure we only redirect if the user arrived at some point and not when we sign up
      if (!this.signUpInitiated) {
        this.$state.go('myvolumio.profile');
      }
    }
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

  clickShowTerms() {
    this.openTermsModal();
  }

  /* !!! */

  stepForwards() {
    if (this.$scope.step < 2) {
      this.$scope.step++;
    }
  }

  stepBackwards() {
    this.$scope.step === 1;
  }

  initProducts() {
    this.productService.getProducts().then(products => {
      this.productsObj = products;

      if (this.productService.isVolumioV3) {
        this.products = [ products.free, products.premium ];
      } else {
        this.products = [ products.free, products.virtuoso, products.superstar ];
      }
    });
  }

  clickAgreementButton() {
    this.form.termsCheckbox = !this.form.termsCheckbox;
  }
  clickMarketingConsentButton() {
    this.form.marketingConsent = !this.form.marketingConsent;
  }


  openTermsModal() {
    let
      templateUrl = 'app/components/myvolumio/modals/myvolumio-terms-modal/myvolumio-terms-modal.html',
      controller = 'MyVolumioTermsModalController',
      params = {
        title: 'Terms and conditions'
      };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'md');
  }

  submitForm() {
    if (this.validate() !== true) {
      return;
    }

    this.signUpInitiated = true;

    var user = {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email,
      marketingConsent: this.form.marketingConsent,
      avatarId: 0,
      social: {},
      country: ''
    };
    this.authService.signup(user).then((newUser) => {
      /* this.$state.go('myvolumio.profile'); */
      this.newUser = newUser;
      this.statisticsService.signalLead();
      this.stepForwards();
    }, (error) => {
      this.modalService.openDefaultErrorModal(error);
      this.signUpInitiated = false;
    });
  }

  validate() {
    //other validations are made in HTML5
    return (this.validateFormCheckBox() && this.validatePasswordMatch());
  }

  validateFormCheckBox() {
    if (this.form.termsCheckbox === true) {
      return true;
    }
    this.modalService.openDefaultErrorModal("MYVOLUMIO.ERROR_VALIDATION_TERMS_UNACCEPTED");
    return false;
  }

  validatePasswordMatch() {
    if (this.password === this.passwordConfirm) {
      return true;
    }

    this.modalService.openDefaultErrorModal("MYVOLUMIO.ERROR_VALIDATION_PASSWORD_MATCH");
    return false;
  }

  isSocialEnabled() {
    return this.authService.isSocialEnabled();
  }

  goToLogin() {
    this.$state.go('myvolumio.login');
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

  getProduct() {
    return this.productsObj[this.$scope.model.selectedProduct];
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
      this.showSignupErrorModal('no paddleId found');
      return;
    }
    if(!this.newUser){
      this.showSignupErrorModal('no authenticated user found');
      return;
    }
    /* jshint ignore:start */

    if (!this.newUser || !this.newUser.email || !this.newUser.uid) {
      this.newUser = this.authService.getCurrentAuthUser();
      if (!this.newUser || !this.newUser.email || !this.newUser.uid) {
        this.showSignupErrorModal('missing email and uid');
        return;
      }
    }

    var checkoutProps = {
      product: paddleId,
      email: this.newUser.email,
      passthrough: { "email": this.newUser.email, "uid": this.newUser.uid },
      successCallback: (data) => {
        this.successCallback(data);
      },
      closeCallback: (data) => {
        this.closeCallback(data);
      }
    }

    if (this.couponCode) {
      checkoutProps.coupon = this.couponCode;
    } else {
      checkoutProps.trialDays = trialDays;
      checkoutProps.trialDaysAuth = trialDaysAuth;
      checkoutProps.price = trialPrice;
      checkoutProps.auth = trialAuth;
    }

    Paddle.Checkout.open(checkoutProps, false);
    /* jshint ignore:end */
  }

  successCallback(data) {
    this.statisticsService.signalSubscriptionCreated(this.getProduct(), this.selectedPlanDuration, this.isTrial(), data);
    this.$state.go('myvolumio.payment-success');
  }

  closeCallback(error) {
    this.modalService.openDefaultErrorModal('MYVOLUMIO.COMPLETE_CHECKOUT');
  }

  getTrialOverride() {
    return this.productService.getTrialOverride();
  }

  onCouponCodeChange(data){
    this.$log.debug('myvolumio coupon :', data);
    this.couponCode = data;
    if (this.couponCode.length) {
      this.productService.setTrialOverride(true);
    } else {
      this.productService.setTrialOverride(false);
    }
  }

  initSocket() {
    if (!this.socketService.isSocketAvalaible()) {
      return;
    }

    this.registerListener();
    this.$rootScope.$on('socket:reconnect', () => {
      this.registerListener();
    });
  }

  registerListener() {
    if (!this.socketService.isSocketAvalaible()) {
      return;
    }
    this.socketService.on('userUpgradedFromDeviceCode', () => {
      this.executeUserUpgradedFromDeviceCode();
    });

    this.$rootScope.$on('$destroy', () => {
      this.socketService.off('userUpgradedFromDeviceCode');
    });
  }

  executeUserUpgradedFromDeviceCode(){
    if (this.$state.current.name === 'myvolumio.signup') {
      this.$state.go('myvolumio.profile');
    }
  }

  showSignupErrorModal(message){
    var errorMessage = this.filteredTranslate("MYVOLUMIO.SIGNUP_ERROR_CONTACT_SUPPORT") + " " + message;
    this.modalService.openDefaultErrorModal(errorMessage);
  }

  closeSignup(){
    this.$state.go('volumio.playback');
  }

  getShownPrice(){
    var planDuration = this.selectedPlanDuration;
    var returnedPrice = this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].localizedPrice.replace('.00','');
    if (planDuration === 'yearly') {
      returnedPrice = this.productService.getMonthlyPriceFromYearlyPrice(returnedPrice);
    }
    returnedPrice = returnedPrice + ' / ' + this.filteredTranslate('MYVOLUMIO.MONTH').toUpperCase().toLowerCase();
    return returnedPrice;
  }

  getShownPriceMessage(){
    var planDuration = this.selectedPlanDuration;
    var returnedPrice = this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].localizedPrice.replace('.00','');
    var message = '';
    if (planDuration === 'yearly') {
      message = this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].localizedPrice.replace('.00','') + ' ' + this.filteredTranslate('MYVOLUMIO.YEARLY_PER').toUpperCase().toLowerCase();
    } else {
      message = this.productService.getYearlyPriceFromMonhtlyPrice(this.productsObj[this.$scope.model.selectedProduct].prices[this.selectedPlanDuration].localizedPrice.replace('.00','')) + ' ' + this.filteredTranslate('MYVOLUMIO.YEARLY_PER').toUpperCase().toLowerCase();
    }
    return message;
  }

  getSaveMessage(){
    var planDuration = this.selectedPlanDuration;
    var message = null;
    if (planDuration === 'yearly' && this.productService.showSavingMessage) {
      var monthlyPrice =  this.productsObj[this.$scope.model.selectedProduct].prices['monthly'].localizedPrice.replace('.00','');
      var yearlyPrice = this.productsObj[this.$scope.model.selectedProduct].prices['yearly'].localizedPrice.replace('.00','');
      var savePrice = this.productService.getYearlySaving(monthlyPrice, yearlyPrice);
      message = this.filteredTranslate('MYVOLUMIO.SAVE').toUpperCase().toLowerCase() + ' ' + savePrice;
    }
    return message;
  }
}

export default MyVolumioSignupNewController;
