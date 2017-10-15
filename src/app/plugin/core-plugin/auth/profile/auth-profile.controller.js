class AuthProfileController {
  constructor($scope, $state, $stateParams, authService) {
    this.$state = $state;
    this.authService = authService;
    this.user = null;

    this.isUserVerified = true;

    this.init();
  }

  init() {
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

  getAuthWatcher() {
    return (user) => {
      this.postAuthInit(user);
    };
  }

  postAuthInit(user) {
    this.setUser(user);
    this.checkUserVerified();
  }

  setUser(user) {
    this.user = user;
  }

  checkUserVerified() {
    this.authService.isUserVerified().then(() => {
      console.log("VERIFIED");
      this.isUserVerified = true;
    }).catch((error) => {
      console.log("NOT VERIFIED");
      console.log(error);
      this.isUserVerified = false;
    });
  }

  resendEmailVerification() {
    this.authService.resendEmailVerification();
  }

  goToPlans() {
    this.$state.go('volumio.auth.plans');
  }

  logIn() {
    this.$state.go('volumio.auth.login');
  }

  goToEdit() {
    this.$state.go('volumio.auth.edit-profile');
  }

  reAuth() {
    this.authService.logOut().then(() => {
      this.$state.go('volumio.auth.login');
    }).catch((error) => {
      alert(error);
    });
  }

  deleteUser() {
    if (!confirm('Are you sure to delete the user and remove all subscriptions?')) { //TODO Modal lang confirm
      return;
    }
    if (this.isSubscribedToPlan()) { 
      this.stripeService.cancelSubscription(this.user.subscriptionId, this.user.uid).then(() => {
        this.deleteUserFromFirebase();
      }).catch(error => {
        alert(error); //todo error in modal
      });
      return;
    }
    this.deleteUserFromFirebase();
  }
  
  isSubscribedToPlan(){
    return (this.user.plan && (this.user.plan === 'virtuoso' || this.user.plan === 'superstar')); // TODO move logic in product service
  }

  deleteUserFromFirebase() {
    this.authService.deleteUser(this.user.uid).then(() => {
      this.$state.go('volumio.auth.login');
    }).catch(error => {
      alert(error); //todo error in modal
    });
  }

}

export default AuthProfileController;