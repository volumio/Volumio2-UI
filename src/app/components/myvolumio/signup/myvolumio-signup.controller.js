class MyVolumioSignupController {
  constructor($scope, $state, authService, modalService, $translate, user) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.modalService = modalService;
    this.authService = authService;
    this.$translate = $translate;

    this.user = user;

    this.agreeButtonSettings = {
      on: 'glyphicon glyphicon-check',
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
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.postAuthInit();
    });
  }

  postAuthInit() {
    if (this.user !== null) {
      this.$state.go('myvolumio.profile');
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
    //TODO STANDARDIZE THIS (1/2)
    var user = {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email,
      avatarId: 0,
      social: {},
      country: ''
    };
    this.authService.signup(user).then((newUser) => {
      this.$state.go('myvolumio.profile');
    }, (error) => {
      this.modalService.openDefaultErrorModal(error);
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

}

export default MyVolumioSignupController;
