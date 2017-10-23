class AuthService {
  constructor($rootScope, $timeout, angularFireService, $q, $state, databaseService, remoteStorageService, stripeService, $filter) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.angularFireService = angularFireService;
    this.$q = $q;
    this.$state = $state;
    this.databaseService = databaseService;
    this.remoteStorageService = remoteStorageService;
    this.stripeService = stripeService;
    this.filteredTranslate = $filter('translate');

    this.user = null;
    this.mandatoryFields = [
      'username',
      'firstName',
      'lastName'
    ];
    
    this.init();
  }

  init() {
    this.$rootScope.$watch(() => this.angularFireService.dbUser, (user) => {
      this.user = user;
    });
  }

  login(user, pass) {
    return this.angularFireService.login(user, pass);
  }

  loginWithFacebook() {
    return this.loginWithProvider('facebook');
  }

  loginWithGoogle() {
    return this.loginWithProvider('google');
  }

  loginWithProvider(provider) {
    return this.angularFireService.loginWithProvider(provider);
  }

  filterAccessPromise(user, promise) {
    if (user === null) {
      promise.resolve(user);
      return;
    }
    if (!this.isUserFilledWithMandatory(user)) {
      promise.reject(this.filteredTranslate('AUTH.USER_MISSING_MANDATORY_FIELDS'));
      this.redirectToEditProfile();
      return;
    }
    promise.resolve(user);
    return;
//    this.isUserVerified().then(() => {
//      promise.resolve(user);
//    }).catch(() => {
//      promise.reject(this.filteredTranslate('AUTH.USER_EMAIL_NOT_VERIFIED')); 
//      this.redirectToVerifyUser();
//    });
  }

  isUserFilledWithMandatory(user) {
    for (var i in this.mandatoryFields) {
      if (user &&
              (!user.hasOwnProperty(this.mandatoryFields[i]) ||
                      user[this.mandatoryFields[i]] === undefined ||
                      user[this.mandatoryFields[i]].length === 0
                      )
              ) {
        return false;
      }
    }
    return true;
  }

  isUserVerified() {
    return this.angularFireService.isLoggedAndVerified();
  }

  resendEmailVerification() {
    return this.angularFireService.sendEmailVerification();
  }

  redirectToEditProfile() {
    this.$state.go('volumio.auth.edit-profile');
  }

  redirectToVerifyUser() {
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
    return this.angularFireService.logOut();
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

  getFirebaseAuthService() {
    return this.angularFireService.getAuthService();
  }

  recoverPassword(email) {
    return this.angularFireService.recoverPassword(email);
  }

  changeAvatar(file, userId) {
    var changing = this.$q.defer();
    this.remoteStorageService.uploadFile(file, userId).then((url) => {
      const userAvatarPath = `/users/${userId}/photoUrl`;
      this.databaseService.write(userAvatarPath, url).then(() => {
        changing.resolve(url);
      });
    }).catch((error) => {
      changing.reject(error);
    });
    return changing.promise;
  }

  getAvatarUrl(userId) {
    const path = 'userAvatars/' + userId;
    return this.remoteStorageService.getDownloadUrl(path);
  }

  deleteUser(user) {
    if (this.isSubscribedToPlan(user)) {
      var deleting = this.$q.defer();
      this.stripeService.cancelSubscription(user.subscriptionId, user.uid).then(() => {
        this.deleteUserFromFirebase(user).then(() => {
          deleting.resolve();
        });
      }).catch(error => {
        deleting.reject(error);
      });
      return deleting.promise;
    }
    return this.deleteUserFromFirebase(user);
  }

  isSubscribedToPlan(user) {
    return (user.plan && (user.plan === 'virtuoso' || user.plan === 'superstar')); // TODO move logic in product service
  }

  deleteUserFromFirebase(user) {
    var deleting = this.$q.defer();
    const userPath = `users/${user.uid}`;
    this.databaseService.delete(userPath).then(() => {
      this.angularFireService.deleteAuthUser().then(() => {
        deleting.resolve();
      });
    }).catch(error => {
      deleting.reject(error);
    });
    return deleting.promise;
  }

}

export default AuthService;
