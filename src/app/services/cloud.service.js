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
}

export default CloudService;
