class ModalController {
  constructor($uibModalInstance, dataObj, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.$translate = $translate;

    this.disableCancelButton = false;
    this.callback = null;
    this.cancelCallback = null;

    this.init();
  }

  init() {
    this.checkDisableCancelButton();
    this.bindCallbacks();
  }

  checkDisableCancelButton() {
    if (this.dataObj.disableCancelButton && this.dataObj.disableCancelButton === true) {
      this.disableCancelButton = true;
    }
  }

  bindCallbacks() {
    if (this.dataObj.callback && typeof this.dataObj.callback === "function") {
      this.callback = this.dataObj.callback;
    }
    if (this.dataObj.cancelCallback && typeof this.dataObj.cancelCallback === "function") {
      this.cancelCallback = this.dataObj.cancelCallback;
    }
  }

  ok() {
    this.$uibModalInstance.close();
    if (this.callback !== undefined && this.callback !== null) {
      this.callback();
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
    if (this.cancelCallback !== undefined && this.cancelCallback !== null) {
      this.cancelCallback();
    }
  }
}

export default ModalController;