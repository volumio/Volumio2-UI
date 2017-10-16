class ModalController {
  constructor($uibModalInstance, dataObj, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.$translate = $translate;
    
    this.disableCancelButton = false;
    this.callback = null;

    this.init();
  }

  init() {
    this.checkDisableCancelButton();
    this.bindCallback();
  }
  
  checkDisableCancelButton(){
    if (this.dataObj.disableCancelButton && this.dataObj.disableCancelButton === true) {
      this.disableCancelButton = true;
    }
  }
  
  bindCallback(){
    if(this.dataObj.callback && typeof this.dataObj.callback === "function"){
      this.callback = this.dataObj.callback;
    }
  }

  ok() {
    this.$uibModalInstance.close();
    if(this.callback !== undefined && this.callback !== null){
      this.callback();
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default ModalController;
