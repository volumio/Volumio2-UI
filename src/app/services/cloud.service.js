class CloudService{

  constructor($rootScope,$window){
    this.$rootScope = $rootScope;
    this.$window = $window;

  }

  isOnCloud(){
    return this.$window.location.hostname === 'myvolumio.org';
  }

}

export default CloudService;
