class MyVolumioEditProfileController {
  constructor($scope, $state, authService, $q, $filter, modalService, user) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.$q = $q;
    this.filteredTranslate = $filter('translate');
    this.modalService = modalService;

    this.user = user;
    this.emailChanged = false;

    this.form = {};

    this.avatarFile = {};
    this.isAvatarChanged = false;
    this.uploadingAvatar = false;

    this.deletingUser = false;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
      this.postAuthInit();
    });
  }

  postAuthInit() {
    this.copyValuesToForm();
  }

  copyValuesToForm() {
    for (var key in this.user) {
      if (key.startsWith("$") || key === 'forEach') {
        continue;
      }
      this.form[key] = this.user[key];
    }
  }

  copyValuesToUser() {
    for (var key in this.form) {
      if (key.startsWith("$") || key === 'forEach') {
        continue;
      }
      this.user[key] = this.form[key];
    }
  }

  goToProfile() {
    this.$state.go('myvolumio.profile');
  }

  isUserFilledWithMandatory() {
    return this.authService.isUserFilledWithMandatory(this.user);
  }

  doEdit() {
    var promises = [];
    if (this.form.password) {
      if (!this.validatePasswordMatch()) {
        return;
      }
      var updatingPassword = this.updatePassword();
      promises.push(updatingPassword);
    }
    if (this.emailChanged === true) {
      var updatingEmail = this.updateEmail();
      promises.push(updatingEmail);
    }
    this.$q.all(promises).then(() => {
      this.updateUserData();
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  updateUserData() {
    this.copyValuesToUser();
    this.authService.saveUserData(this.user).then(() => {
      this.goToProfile();
    }).catch((error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  updatePassword() {
    var updating = this.$q.defer();
    this.authService.updatePassword(this.form.password).then(() => {
      updating.resolve();
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  updateEmail() {
    var updating = this.$q.defer();
    this.authService.updateEmail(this.form.email).then(() => {
      updating.resolve();
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  validatePasswordMatch() {
    if (this.form.password === this.passwordCheck) {
      return true;
    }

    this.modalService.openDefaultErrorModal("MYVOLUMIO.ERROR_VALIDATION_PASSWORD_MATCH");
    return false;
  }

  notifyEmailChanged() {
    this.emailChanged = true;
  }

  avatarChange(file) {
    this.isAvatarChanged = true;
    this.$scope.$apply();
    this.avatarFile = file;
  }

  saveAvatar() {
    this.uploadingAvatar = true;
    this.authService.changeAvatar(this.avatarFile, this.user.uid).then((url) => {
      this.uploadingAvatar = false;
      this.isAvatarChanged = false;
      this.form.photoUrl = url;
    }).catch((error) => {
      this.uploadingAvatar = false;
      this.modalService.openDefaultErrorModal(error);
    });
  }

  logIn() {
    this.$state.go('myvolumio.login');
  }

  deleteUser() {
    this.modalService.openDefaultConfirm('MYVOLUMIO.CONFIRM_DELETE_ACCOUNT_TITLE', 'MYVOLUMIO.CONFIRM_DELETE_ACCOUNT', () => {
      this.doDeleteUser();
    });
  }

  doDeleteUser() {
    this.deletingUser = true;
    this.authService.deleteUser(this.user).then(() => {
      this.deletingUser = false;
      this.$state.go('myvolumio.access');
    }).catch(error => {
      this.deletingUser = false;
      this.modalService.openDefaultErrorModal(error);
    });
  }

}

export default MyVolumioEditProfileController;