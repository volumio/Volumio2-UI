class AuthService {
  constructor($rootScope, $timeout, angularFireService, $q, $state, databaseService) {
    'ngInject';
    this.rootScope = $rootScope;
    this.angularFireService = angularFireService;
    this.$q = $q;
    this.$state = $state;
    this.databaseService = databaseService;

    this.mandatoryFields = [
      'username',
      'firstName',
      'lastName'
    ];
  }

  login(user, pass) {
    return this.angularFireService.login(user, pass);
  }

  loginWithFacebook() {
    this.loginWithProvider('facebook');
  }

  loginWithGoogle() {
    this.loginWithProvider('google');
  }

  loginWithProvider(provider) {
    this.angularFireService.loginWithProvider(provider);
  }

  promiseIsLogged() {

  }

  getUserPromise(filter = true) {
    var getting = this.$q.defer();
    this.angularFireService.getUserPromise().then((user) => {
      if (filter) {
        this.filterAccessPromise(user, getting);
        return;
      }
      getting.resolve(user);
    }).catch(error => {
      getting.reject(error);
    });
    return getting.promise;
  }

  bindWatcher(watcher, filter = true) {
    if (filter) {
      return this.angularFireService.addAuthListener(this.getFilterAccessMethod(watcher));
    }
    return this.angularFireService.addAuthListener(watcher);
  }

  unbindWatcher() {
    //TODO
  }

  filterAccessPromise(user, promise) {
    if (user === null) {
      console.log("user is null");
      promise.resolve(user);
      return;
    }
    if (!this.isUserFilledWithMandatory(user)) {
      this.redirectToEditProfile();
      promise.reject('Missing mandatory user fields'); //TODO error
    }
    if(!this.isUserVerified(user)){
      this.redirectToVerifyUser();
      promise.reject('User is not verified'); //TODO error
    }
    promise.resolve(user);
  }

  getFilterAccessMethod(watcher) {
    return (user) => {
      if (this.isUserFilledWithMandatory(user)) {
        return watcher;
      }
      this.redirectToEditProfile();
      return null;
    };
  }

  isUserFilledWithMandatory(user) {
    for (var i in this.mandatoryFields) {
      if (user && !user.hasOwnProperty(this.mandatoryFields[i])) {
        console.log("user is false");
        return false;
      }
    }
    return true;
  }
  
  isUserVerified(user){
    return true;
    //TODO server mechanism
    if(user.verified === true){
      return true;
    }
    return false;
  }

  redirectToEditProfile() {
    this.$state.go('volumio.auth.edit-profile');
  }
  
  redirectToVerifyUser(){
    this.$state.go('volumio.auth.verify-user');
  }

  signup(user) {
    var signingUp = this.$q.defer();
    this.angularFireService.signup(user).then((user) => {
      signingUp.resolve(user);
    }, (error) => {
      signingUp.reject(error);
    });
    return signingUp.promise;
  }

  logOut() {
    this.angularFireService.logOut();
  }

  saveUserData(user) {
    var saving = this.$q.defer();
    if (user.password) {
      delete user.password;
    }
    this.databaseService.updateFirebaseObject(user).then(() => {
      saving.resolve();
    }).catch((error) => {
      saving.reject(error);
    });
    return saving.promise;
  }

  updatePassword(password) {
    var updating = this.$q.defer();
    this.angularFireService.updatePassword(password).then(() => {
      updating.resolve();
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  updateEmail(email) {
    var updating = this.$q.defer();
    this.angularFireService.updateEmail(email).then(() => {
      updating.resolve();
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }
  
  getFirebaseAuthService(){
    return this.angularFireService.getAuthService();
  }

}

export default AuthService;
