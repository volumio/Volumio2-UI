class AuthService {
  constructor($rootScope, $timeout, $window, angularFireService, $q, $state, databaseService, remoteStorageService,
    stripeService, $filter, modalService, socketService, $http, $location, themeManager, cloudService) {
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
    this.$window = $window;
    this.cloudService = cloudService;

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

    //race conditions
    this.isJustFeLogged = false;
    this.isUserBeingWatched = false;
    this.isSocketInit = false;

    this.isDev = null;

    this.init();
  }

  init() {
    this.initAuth();
  }

  initAuth() {
    //TODO move this logic after enabled by pushMenuItems
    var isEnabled = this.themeManager.theme === 'volumio' && this.themeManager.variant === 'volumio';
    isEnabled = isEnabled || this.cloudService.isOnCloud;
    this.enableAuth(isEnabled);
  }

  getUser() {
    return this.waitForDbUser();
  }

  enableAuth(enabled = true) {
    this.isEnabled = enabled;
    this.abilitationDefer.resolve(this.isEnabled);

    if (this.isEnabled === true && this.isSocketInit === false) {
      this.initSocket();
    }

    if (this.isEnabled === true && this.isUserBeingWatched === false) {
      this.watchUser();
    }
  }

  isAuthEnabled() {
    return this.abilitationPromise;
  }

  watchUser() {
    this.isUserBeingWatched = true;
    this.$rootScope.$watch(() => this.angularFireService.dbUser, (user) => {
      this.user = user;
      this.syncronizeWithBackend();
    });
  }

  initSocket() {
    this.isSocketInit = true;
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

  syncronizeWithBackend() {
    this.socketPromise.then(() => {
      if (this.isJustFeLogged) { //JUST LOGGED
        this.isJustFeLogged = false;
        this.sendUserTokenToBackend().then(() => {});
        return;
      }
      this.getMyVolumioStatus().then((status) => { //NEED SYNC
        var loggedIn = status.loggedIn;
        var uid = status.uid;
        if (loggedIn === true) { //BE LOGGED
          if (this.user === null) { //FE NOT LOGGED
            this.requestUserToBackend().then(() => {});
          } else if (this.user.uid !== uid) { //FE LOGGED MISMATCH
            this.logOutFrontend().then(() => {
              this.requestUserToBackend().then(() => {});
            });
          } else { //BE & FE SYNCED
            //DO NOTHING
          }
        } else { //BE NOT LOGGED
          if (this.user !== null) { //FE LOGGED
            this.sendUserTokenToBackend().then(() => {});
          } else { //FE & BE NOT LOGGED
            //DO NOTHING
          }
        }
      });
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  getMyVolumioStatus() {
    var getting = this.$q.defer();

    if (this.isSocketInit === false) {
      getting.resolve(false);
      return getting.promise;
    }

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

    if (this.isSocketInit === false) {
      sending.resolve(false);
      return sending.promise;
    }

    this.getUserToken(this.user.uid).then((response) => {
      var token = response;
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

  getUserToken(uid = null) {
    return this.angularFireService.getToken().then(idToken => {
      return this.$http({
        url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/getCustomToken',
        method: "GET",
        params: { idToken: idToken }
      }).then(response => {
        return response.data;
      });
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
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

    if (this.isSocketInit === false) {
      emitting.resolve(false);
      return emitting.promise;
    }

    this.socketService.emit('getMyVolumioToken', undefined, () => {
      emitting.resolve();
    });
    return emitting.promise;
  }

  login(user, pass) {
    return this.angularFireService.login(user, pass).then(() => {
      this.isJustFeLogged = true;
    });
  }

  loginWithProvider(provider) {
    //facebook, google, github, ...
    return this.angularFireService.loginWithProvider(provider).then(() => {
      this.isJustFeLogged = true;
    });
  }

  loginWithToken(token) {
    return this.angularFireService.loginWithToken(token);
  }

  requireUser() {
    return this.angularFireService.requireUser();
  }

  requireUserOrRedirectToCloudLogin() {
    return this.angularFireService.requireUser().then((user) => {
      if (user) {
        return user;
      } else {
        this.$state.go('myvolumio.login');
        throw ('MYVOLUMIO.USER_NOT_LOGGED');
      }
    });
  }

  requireNullUserOrRedirect() {
    return this.angularFireService.waitForUser().then(user => {
      var gettingUser = this.$q.defer();
      if (user === null) {
        gettingUser.resolve(null);
      } else {
        this.$state.go('myvolumio.profile');
        // if(!this.cloudService.isOnCloud){
        // }else{
        //   this.$state.go('myvolumio.login');
        // }
        gettingUser.reject('MYVOLUMIO.USER_ALREADY_LOGGED');
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

  waitForDbUser() {
    return this.angularFireService.waitForDbUser();
  }

  validateUser(user) {
    var validating = this.$q.defer();
    if (user === null) {
      validating.resolve(user);
      return;
    }
    if (!this.isUserFilledWithMandatory(user)) {
      validating.reject(this.filteredTranslate('MYVOLUMIO.USER_MISSING_MANDATORY_FIELDS'));
      this.modalService.openDefaultErrorModal('MYVOLUMIO.USER_MISSING_MANDATORY_FIELDS');
      this.redirectToEditProfile();
      return;
    }
    validating.resolve(user);
    return validating.promise;
    //    this.isUserVerified().then(() => {
    //      validating.resolve(user);
    //    }).catch(() => {
    //      validating.reject(this.filteredTranslate('MYVOLUMIO.USER_EMAIL_NOT_VERIFIED'));
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
    this.$state.go('volumio.edit-profile');
  }

  redirectToVerifyUser() {
    this.$state.go('volumio.verify-user');
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
    if (this.isSocketInit === false) {
      return this.$q.resolve(false);
    }
    this.socketService.emit('myVolumioLogout');
    return this.$q.resolve(true);
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
    if (this.isSocketInit === false) {
      return;
    }

    this.socketService.on('pushMyVolumioLogout', () => {
      this.logOutFrontend();
    });

    this.$rootScope.$on('$destroy', () => {
      this.socketService.off('pushMyVolumioLogout');
    });
  }

  registerLoginListener() {
    if (this.isSocketInit === false) {
      return;
    }

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
    if (domain === 'localhost' || domain === 'myvolumio.org') {
      return true;
    }
    return false;
  }

}

export default AuthService;