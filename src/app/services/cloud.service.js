class CloudService{

  constructor($rootScope,$window){
    this.$rootScope = $rootScope;
    this.$window = $window;

  }

  get isOnCloud() {
    if (this._isOnCloud !== undefined) {
      return this._isOnCloud;
    } else {
      this._isOnCloud = this.$window.location.hostname === 'myvolumio.org';
      return this._isOnCloud;
    }
  }

}

export default CloudService;
