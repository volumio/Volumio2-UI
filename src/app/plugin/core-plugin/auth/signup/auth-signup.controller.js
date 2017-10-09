class AuthSignupController {
  constructor($scope, $state, authService, modalService) {
    this.$state = $state;
    this.modalService = modalService;
    this.authService = authService;

    this.jqAgreeCheckbox = $('.button-checkbox').find('input:checkbox');
    this.jqAgreeButton = $('.button-checkbox').find('button');
    this.agreeButtonSettings = {
      on: {icon: 'glyphicon glyphicon-check'},
      off: {icon: 'glyphicon glyphicon-unchecked'}
    };

   this.init();
  }
  
  init(){
    this.authInit();
    this.initTermsAgreementButton();
  }
  
  authInit() {
    this.authService.getUserPromise().then((user) => {
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher());
    }).catch((error) => {
      console.log(error);
    });
  }
  
  getAuthWatcher(){
    return (user) => {
      this.postAuthInit(user);
    };
  }
  
  postAuthInit(user){
    this.setUser(user);
  }
  
  setUser(user){
    this.user = user;
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  clickShowTerms() {
    this.openTermsModal();
  }

  //agreement UI behaviour
  initTermsAgreementButton() { //TODO ANGULARIZE THIS
    this.updateAgreementDisplay();
    if (this.jqAgreeButton.find('.state-icon').length === 0) {
      this.jqAgreeButton.prepend('<i class="state-icon ' + this.agreeButtonSettings[this.jqAgreeButton.data('state')].icon + '"></i>&nbsp;');
    }
  }

  clickAgreementButton() {
    this.jqAgreeCheckbox.prop('checked', !this.jqAgreeCheckbox.is(':checked'));
    this.jqAgreeCheckbox.triggerHandler('change');
    this.updateAgreementDisplay();
  }

  changeAgreementCheckbox() {
    this.updateAgreementDisplay();
  }

  updateAgreementDisplay() {
    var isChecked = this.jqAgreeCheckbox.is(':checked');
    this.jqAgreeButton.data('state', (isChecked) ? "on" : "off");
    this.jqAgreeButton.find('.state-icon').removeClass().addClass('state-icon ' + this.agreeButtonSettings[this.jqAgreeButton.data('state')].icon);
    if (isChecked) {
      this.jqAgreeButton.removeClass('btn-default').addClass('btn-info active');
    } else {
      this.jqAgreeButton.removeClass('btn-info active').addClass('btn-default');
    }
  }
  //end

  openTermsModal() {
    let
            templateUrl = 'app/plugin/core-plugin/auth/modals/auth-terms-modal/auth-terms-modal.html',
            controller = 'AuthTermsModalController',
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
      this.showFormErrors();
      return;
    }
    //TODO STANDARDIZE THIS (1/2)
    var user = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      email: this.email,
      avatarId: 0,
      social: {},
      country: ''
    };
    this.authService.signup(user).then((newUser) => {
      this.$state.go('volumio.auth.profile');
    },(error) => {
      //TODO UI
      alert(error);
      console.log('Error');
      console.log(error);
    });
  }

  validate()
  {
    //TODO "Server Side" validation
    return true;
  }

  showFormErrors() {
    //TODO 
  }

}

export default AuthSignupController;