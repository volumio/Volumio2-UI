class AuthProfileController {
  constructor($scope, $state, $stateParams, authService) {
    this.$state = $state;
    this.authService = authService;
    this.user = null;

  this.init();
  }
  
  init(){
    this.authInit();
  }
  
  authInit() {
    this.authService.getUserPromise().then((user) => {
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher());
    }).catch((error) => {
      console.log(error);
    });
  }
  
  getAuthWatcher(){
    return (user) => {
      this.postAuthInit(user);
    };
  }
  
  postAuthInit(user){
    this.setUser(user);
  }
  
  setUser(user){
    this.user = user;
    if(this.user)
    this.user.image = "http://www.giacomodeglinnocenti.it/me.jpg"; //TODO IMAGE 
  }

  goToPlans() {
    this.$state.go('volumio.auth.plans');
  }
   
  logIn(){
    this.$state.go('volumio.auth.login');
  }
  
  goToEdit(){
    this.$state.go('volumio.auth.edit-profile');
  }

}

export default AuthProfileController;