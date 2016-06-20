class ModalNetwordDrivesPasswordController {
  constructor($uibModalInstance, dataObj) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.passwordInputType = 'password';
  }

  togglePasswordVisibility() {
    if (this.passwordInputType === 'password') {
      this.passwordInputType = 'input';
    } else {
      this.passwordInputType = 'password';
    }
  }

  save() {
    if (this.drivePasswordForm.$valid) {
      this.$uibModalInstance.close({
        username: this.dataObj.username,
        password: this.dataObj.password
      });
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

export default ModalNetwordDrivesPasswordController;
