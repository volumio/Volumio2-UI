class AuthService {
  constructor($rootScope, $timeout, angularFireService, $q, $state, databaseService, remoteStorageService, stripeService, $filter, modalService, socketService, $http, $location, themeManager) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.angularFireService = angularFireService;
    this.$q = $q;
    this.$state = $state;
    this.databaseService = databaseService;
    this.remoteStorageService = remoteStorageService;
    this.stripeService = stripeService;
    this.filteredTranslate = $filter('translate');
    this.modalService = modalService;
    this.socketService = socketService;
    this.$http = $http;
    this.$location = $location;
    this.themeManager = themeManager;

    this.isEnabled = false;
    this.abilitationDefer = this.$q.defer();
    this.abilitationPromise = this.abilitationDefer.promise;

    this.user = null;
    this.mandatoryFields = [
      'username',
      'firstName',
      'lastName'
    ];

    this.socketPromise;
    this.socketDeferred;

    this.isFirstSyncroDone = false;
    this.isJustLogged = false;

    this.preInit();
    this.init();
  }
  
  preInit(){
    //TODO move this logic after enabled by pushMenuItems
    if(this.themeManager.theme === 'volumio' && this.themeManager.variant === 'volumio'){
      this.enableAuth(true);
    }else{
      this.enableAuth(false);
    }
  }

  init() {
    if (this.isEnabled) {
      this.initSocket();
      //this.checkLoadMyVolumio();
      this.startSyncronizationWithBackend();
      this.watchUser();
    }
  }

  enableAuth(enabled = true) {
    this.isEnabled = enabled;
    this.abilitationDefer.resolve(this.isEnabled);
    this.init();
  }
  
  isAuthEnabled(){
    return this.abilitationPromise;
  }

  startSyncronizationWithBackend() {
    this.waitForUser().then(user => {
      this.user = user;
      this.syncronizeWithBackend(true);
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  watchUser() {
    this.$rootScope.$watch(() => this.angularFireService.dbUser, (user) => {
      this.user = user;
      this.syncronizeWithBackend();
    });
  }

  initSocket() {
    this.socketDeferred = this.$q.defer();
    this.socketPromise = this.socketDeferred.promise;

    this.$rootScope.$on('socket:init', () => {
      this.registerListner();
      this.socketDeferred.resolve();
    });

    this.$rootScope.$on('socket:disconnect', () => {
      this.socketDeferred = this.$q.defer();
      this.socketPromise = this.socketDeferred.promise;
    });

    this.$rootScope.$on('socket:reconnect', () => {
      this.registerListner();
      this.socketDeferred.resolve();
    });
  }

  syncronizeWithBackend(overrideRaceCondition = false) {
    if (overrideRaceCondition === true || this.isFirstSyncroDone) {
      this.socketPromise.then(() => {
        if (this.isJustLogged) { //TODO CHECK USER
          this.isJustLogged = false;
          this.sendUserTokenToBackend().then(() => {
            this.isFirstSyncroDone = true;
          });
        } else {
          this.getMyVolumioStatus().then((status) => {
            var loggedIn = status.loggedIn;
            var uid = status.uid;
            if (loggedIn === true) { //BE logged
              if (this.user === null) {
                this.requestUserToBackend().then(() => {
                  this.isFirstSyncroDone = true;
                });
              } else if (this.user.uid !== uid) {
                //TODO MODAL
                this.logOut().then(() => {
                  this.requestUserToBackend().then(() => {
                    this.isFirstSyncroDone = true;
                  });
                });
              } else {
                //BE & FE are already synced
                this.isFirstSyncroDone = true;
              }
            } else { //BE not logged
              if (this.user !== null) {
                this.sendUserTokenToBackend().then(() => {
                  this.isFirstSyncroDone = true;
                });
              } else {
                this.isFirstSyncroDone = true;
              }
            }
          });
        }
      }).catch(error => {
        this.modalService.openDefaultErrorModal(error);
      });
  }
  }

  getMyVolumioStatus() {
    var getting = this.$q.defer();

    this.socketService.on('pushMyVolumioStatus', (data) => {
      getting.resolve(data);
    });

    this.$rootScope.$on('$destroy', () => {
      this.socketService.off('pushMyVolumioStatus');
    });

    this.socketService.emit('getMyVolumioStatus');

    return getting.promise;
  }

  sendUserTokenToBackend() {
    var sending = this.$q.defer();
    this.getUserToken(this.user.uid).then((response) => {
      var token = response.data;
      this.socketService.emit('setMyVolumioToken', {
        "token": token
      }, () => {
        sending.resolve();
      });
    }).catch(error => {
      sending.reject(error);
    });
    return sending.promise;
  }

  getUserToken(uid) {
    return this.$http({
      url: 'https://us-central1-myvolumio.cloudfunctions.net/generateToken', //TODO dynamic conf + auth
      method: "GET",
      params: {uid: uid}
    });
  }

  requestUserToBackend() {
    var requesting = this.$q.defer();
    this.emitUserRequest().then(() => {
      requesting.resolve();
    }).catch((error) => {
      requesting.reject(error);
    });
    return requesting.promise;
  }

  emitUserRequest() {
    var emitting = this.$q.defer();
    this.socketService.emit('getMyVolumioToken', undefined, () => {
      emitting.resolve();
    });
    return emitting.promise;
  }

  login(user, pass) {
    return this.angularFireService.login(user, pass).then(() => {
      this.isJustLogged = true;
      window.isJustLogged = true;
    });
  }

  loginWithProvider(provider) {
    //facebook, google, github, ...
    return this.angularFireService.loginWithProvider(provider).then(() => {
      this.isJustLogged = true;
      window.isJustLogged = true;
    });
  }

  loginWithToken(token) {
    return this.angularFireService.loginWithToken(token);
  }

  requireUser() {
    return this.angularFireService.requireUser();
  }

  requireNullUserOrRedirect() {
    return this.angularFireService.waitForUser().then(user => {
      var gettingUser = this.$q.defer();
      if (user === null) {
        gettingUser.resolve(null);
      } else {
        this.$state.go('volumio.auth.profile');
        gettingUser.reject('AUTH.USER_ALREADY_LOGGED');
      }
      return gettingUser.promise;
    });
  }

  requireVerifiedUserOrRedirect() {
    return this.angularFireService.requireUser().then(user => {
      return this.validateUser(user);
    });
  }

  waitForUser() {
    return this.angularFireService.waitForUser();
  }

  validateUser(user) {
    var validating = this.$q.defer();
    if (user === null) {
      validating.resolve(user);
      return;
    }
    if (!this.isUserFilledWithMandatory(user)) {
      validating.reject(this.filteredTranslate('AUTH.USER_MISSING_MANDATORY_FIELDS'));
      this.modalService.openDefaultErrorModal('AUTH.USER_MISSING_MANDATORY_FIELDS');
      this.redirectToEditProfile();
      return;
    }
    validating.resolve(user);
    return validating.promise;
//    this.isUserVerified().then(() => {
//      validating.resolve(user);
//    }).catch(() => {
//      validating.reject(this.filteredTranslate('AUTH.USER_EMAIL_NOT_VERIFIED'));
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
    var loggingOut = this.$q.defer();
    this.logOutBackend().then(() => {
      this.logOutFrontend().then(() => {
        loggingOut.resolve();
      });
    }).catch((error) => {
      loggingOut.reject(error);
    });
    return loggingOut.promise;
  }

  logOutBackend() {
    var emitting = this.$q.defer();
    this.socketPromise.then(() => {
      this.socketService.emit('myVolumioLogout');
      emitting.resolve();
    }).catch(error => {
      emitting.reject(error);
    });
    return emitting.promise;
  }

  logOutFrontend() {
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
    this.angularFireService.deleteAuthUser().then(() => {
      deleting.resolve();
    }).catch(error => {
      deleting.reject(error);
    });
    return deleting.promise;
  }

  registerListner() {
    this.registerLogoutListener();
    this.registerLoginListener();
  }

  registerLogoutListener() {
    this.socketService.on('pushMyVolumioLogout', () => {
      this.logOutFrontend();
    });

    this.$rootScope.$on('$destroy', () => {
      this.socketService.off('pushMyVolumioLogout');
    });
  }

  registerLoginListener() {
    this.socketService.on('pushMyVolumioToken', (data) => {
      if (data !== null && data.token !== null) {
        this.loginWithToken(data.token);
      }
    });

    this.$rootScope.$on('$destroy', () => {
      this.socketService.off('pushMyVolumioToken');
    });
  }

  isSocialEnabled() {
    if (this.isValidDomainForSocialLogin(this.$location.host())) {
      return true;
    }
    return false;
  }

  isIP(address) {
    var r = new RegExp('^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])');
    return r.test(address);
  }

  isValidDomainForSocialLogin(domain) {
    if (domain === 'localhost') {
      return true;
    }
    return false;
  }

}

export default AuthService;
