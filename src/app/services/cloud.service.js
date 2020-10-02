class CloudService{
  constructor($rootScope,$window){
    'ngInject';
    this.$rootScope = $rootScope;
    this.$window = $window;
  }

  get isOnCloud() {
    if (this._isOnCloud !== undefined) {
      return this._isOnCloud;
    } else {
      this._isOnCloud = this.$window.location.hostname === 'myvolumio.org' || this.$window.location.hostname === 'myvolumio-dev.firebaseapp.com';
      return this._isOnCloud;
    }
  }

  get isCloudReferralLink() {
    let referralUrlPart = '/redirect?grsf=';
    if (this.$window.location.href.indexOf('myvolumio.org' + referralUrlPart) !== -1 ||
      this.$window.location.href.indexOf('myvolumio-dev.firebaseapp.com' + referralUrlPart) !== -1 ||
      this.$window.location.href.indexOf('localhost:3000' + referralUrlPart) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}

export default CloudService;
