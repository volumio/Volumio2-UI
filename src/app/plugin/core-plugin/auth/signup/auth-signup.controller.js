class AuthSignupController {
  constructor($scope, $state, authService, modalService, $translate) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.modalService = modalService;
    this.authService = authService;
    this.$translate = $translate;

    this.agreeButtonSettings = {
      on:  'glyphicon glyphicon-check',
      off: 'glyphicon glyphicon-unchecked'
    };
    this.termsButtonIcon = this.agreeButtonSettings.off;
    
    this.form = {
      termsCheckbox: false
    };

    this.init();
  }

  init() {
    this.authInit();
    this.initTermsAgreementButton();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user,(user) => {
      this.user = user;
    });
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
  initTermsAgreementButton() {
    this.updateAgreementDisplay();
  }

  clickAgreementButton() {
    this.form.termsCheckbox = !this.form.termsCheckbox;
    this.updateAgreementDisplay();
  }

  updateAgreementDisplay() {
    this.termsButtonIcon = this.agreeButtonSettings[(this.form.termsCheckbox) ? "on" : "off"];
  }

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
    }, (error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  validate()
  {
    //other validations are made in HTML5
    return (this.validateFormCheckBox() && this.validatePasswordMatch());
  }

  validateFormCheckBox() {
    if (this.form.termsCheckbox === true) {
      return true;
    }
    this.modalService.openDefaultErrorModal("AUTH.ERROR_VALIDATION_TERMS_UNACCEPTED");
    return false;
  }

  validatePasswordMatch() {
    if (this.password === this.passwordConfirm) {
      return true;
    }

    this.modalService.openDefaultErrorModal("AUTH.ERROR_VALIDATION_PASSWORD_MATCH");
    return false;
  }

}

export default AuthSignupController;