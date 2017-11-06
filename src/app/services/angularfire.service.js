class AngularFireService {

  constructor($rootScope, $timeout, firebase, $firebaseAuth, $firebaseObject, $firebaseArray, $firebaseStorage, $q, $filter, modalService) {
    'ngInject';
    //consts
    this.USERS_REF = "users";

    //services
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.firebase = firebase;
    this.firebaseModule = firebase;
    this.$firebaseAuth = $firebaseAuth;
    this.$firebaseObject = $firebaseObject;
    this.$firebaseArray = $firebaseArray;
    this.$firebaseStorage = $firebaseStorage;
    this.$q = $q;
    this.authService;
    this.database;
    this.modalService = modalService;
    this.filteredTranslate = $filter('translate');

    this.authUser = null;
    this.dbUser = null;
    
    this.init();
  }

  //init and config
  init() {
    this.initFirebase();
    this.initServices();
    this.startAuthListening();
  }

  initFirebase() {
    let config = this.getFirebaseConfig();
    this.firebaseModule.initializeApp(config);
  }

  initServices() {
    this.authService = this.$firebaseAuth();
    this.database = this.firebase.database();
  }
  
  getFirebaseConfig() {
    let config = {
      apiKey: "AIzaSyDzEZmwJZS4KZtG9pEXOxlm1XcZikP0KbA",
      authDomain: "myvolumio.firebaseapp.com",
      databaseURL: "https://myvolumio.firebaseio.com",
      projectId: "myvolumio",
      storageBucket: "myvolumio.appspot.com",
      messagingSenderId: "560540102538"
    };
    return config;
  }

  /* ------------ AUTH ------------- */

  getAuthService() {
    return this.authService;
  }

  startAuthListening() {
    this.authService.$onAuthStateChanged((authUser) => {      
      this.setUserByAuth(authUser).then((dbUser) => {
        //user set done
      }).catch(error => {
        this.modalService.openDefaultErrorModal(error);
      });
    }, this);
  }
  
  requireUser(){
    return this.authService.$requireSignIn().then((authUser) => {
      return this.setUserByAuth(authUser);
    });
  }
  
  waitForUser(){
    return this.authService.$waitForSignIn();
  }

  setUserByAuth(authUser) {
    var gettingUser = this.$q.defer();
    if (authUser === null || authUser === undefined) {
      this.dbUser = null;
      this.authUser = null;
      gettingUser.resolve(null);
      return gettingUser.promise;
    }
    this.getRemoteDbUser(authUser.uid).then((dbUser) => {
      if ((dbUser.uid === undefined || dbUser.uid === null) && dbUser.$value === null) { //if user'snt on db
//        var userData = {
//          plan: 'free'
//        };
        var userData = {};
        this.loadSocialData(authUser, userData);
        this.createDbUser(authUser.uid, userData).then((dbUser) => {
          this.authUser = authUser;
          this.dbUser = dbUser;
          gettingUser.resolve(dbUser);
        });
        return;
      }
      this.authUser = authUser;
      this.dbUser = dbUser;
      gettingUser.resolve(dbUser);
    }).catch((error) => {
      gettingUser.reject(error);
    });
    return gettingUser.promise;
  }

  loadSocialData(authUser, userData) {
    //email
    if (authUser.email !== undefined || authUser.email !== null) {
      userData.email = authUser.email;
    }
    const provider = authUser.providerId || '';
    const providerDataProvider = authUser.providerData[0].providerId || '';
    if (this.isProviderASocial(provider) || this.isProviderASocial(providerDataProvider)) {
      //photo
      userData.photoURL = authUser.photoUrl || null;
      //name
      if (authUser.displayName) {
        var splittedName = authUser.displayName.split(" ");
        if (splittedName.length > 1) {
          userData.firstName = splittedName[0];
          splittedName.shift();
          userData.lastName = splittedName.join().replace(",", " ");
        }
      }
    }
  }

  setUser(dbUser) {
    this.dbUser = dbUser;
  }

  getUser() {
    return this.dbUser;
  }

  getRemoteAuthUser() {
    return this.authService.$getAuth();
  }

  getRemoteDbUser(userId) {
    var gettingDbUser = this.$q.defer();

    var userRef = this.database.ref(this.USERS_REF).child(userId);
    let userOnDb = this.$firebaseObject(userRef);
    userOnDb.$loaded().then((user) => {
      gettingDbUser.resolve(user);
    }, (error) => {
      gettingDbUser.reject(error);
    });

    return gettingDbUser.promise;
  }

  isLogged() {
    return this.dbUser !== null;
  }

  login(user, pass) {
    var userPromise = this.$q.defer();

    this.authService.$signInWithEmailAndPassword(user, pass).then((authUser) => {
      //this.checkSendVerificationEmail();
      this.setUserByAuth(authUser).then(user => {
        userPromise.resolve(user);
      });
    }).catch((error) => {
      this.error = error;
      userPromise.reject(error);
    });

    return userPromise.promise;
  }

  loginWithProvider(provider) { //social login works as signup too
    //$signInWithPopup could be an alternative flow to the following
    var logging = this.$q.defer();
    this.authService.$signInWithRedirect(provider).then(() => {
      // Never called because of page redirect
      // Instead, look at $onAuthStateChanged() to detect successful authentication
    }).catch((error) => {
      logging.reject(error);
    });
    return logging.promise;
  }
  
  loginWithToken(token){
    return this.authService.$signInWithCustomToken(token);
  }

  logOut() {
    this.setUserByAuth(null);
    var signingOut = this.authService.$signOut();
    return signingOut;
  }

  signup(user) {
    var userCreationing = this.$q.defer();
    this.createAuthUser(user).then((authUser) => {
      this.createDbUser(authUser.uid, user).then((newUser) => {
        this.authUser = authUser;
        this.dbUser = newUser;
        this.sendEmailVerification();
        userCreationing.resolve(newUser);
      }, (error) => {
        authUser.delete();
        userCreationing.reject(error);
      });
    }, (error) => {
      userCreationing.reject(error);
    });
    return userCreationing.promise;
  }

  createAuthUser(user) {
    var authUserCreationing = this.$q.defer();
    this.authService.$createUserWithEmailAndPassword(user.email, user.password).then(function (authUser) {
      authUserCreationing.resolve(authUser);
    }).catch(function (error) {
      authUserCreationing.reject(error);
    });
    return authUserCreationing.promise;
  }

  createDbUser(uid, user) {
    var dbUserCreationing = this.$q.defer();

    var userRef = this.database.ref(this.USERS_REF).child(uid);

    //TODO STANDARDIZE THIS (2/2)
    user.uid = uid;
    user.createdAt = this.firebase.database.ServerValue.TIMESTAMP;
    user.updatedAt = this.firebase.database.ServerValue.TIMESTAMP;
    //user.plan = 'free';
    delete user.password;

    userRef.set(user).then((ref) => {

      this.getRemoteDbUser(userRef.key).then((user) => {
        dbUserCreationing.resolve(user);
      }, (error) => {
        dbUserCreationing.reject(error);
      });

    }, (error) => {
      dbUserCreationing.reject(error);
    });

    return dbUserCreationing.promise;
  }

  checkSendVerificationEmail() {
    this.isLoggedAndVerified().then((verified) => {
      if (!verified) {
        this.sendEmailVerification();
      }
    });
  }

  sendEmailVerification() {
    var currentUrl = document.location.origin;
    var callbackUrl = `${currentUrl}/user/verify`;
    var actionCodeSettings = {
      url: callbackUrl
    };
    this.authUser.sendEmailVerification(/*actionCodeSettings*/)
            .then(() => {
              this.modalService.openDefaultModal('AUTH.PLEASE_VERIFY_EMAIL_TITLE', 'AUTH.USER_VERIFICATION_EMAIL_SENT_DESC');
            })
            .catch((error) => {
              this.modalService.openDefaultErrorModal(error);
            });
  }

  isLoggedAndVerified() {
    return this.authService.$requireSignIn(true);
  }

  updatePassword(password) {
    var updating = this.$q.defer();
    this.authService.$updatePassword(password).then(() => {
      updating.resolve();
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  updateEmail(email) {
    var updating = this.$q.defer();
    this.authService.$updateEmail(email).then(() => {
      updating.resolve();
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  recoverPassword(email) {
    return this.authService.$sendPasswordResetEmail(email);
  }

  deleteAuthUser() {
    return this.authUser.delete();
  }

  /* ------------ DATABASE ------------- */

  push(path, object) {
    var putting = this.$q.defer();
    var pathRef = this.database.ref(path);
    var list = this.$firebaseArray(pathRef);
    list.$add(object).then((ref) => {
      putting.resolve(ref);
    }, (error) => {
      putting.reject(error);
    });
    return putting.promise;
  }

  write(ref, object) {
    var writing = this.$q.defer();
    var ref = this.database.ref(ref);
    this.stripFirebaseAttributes(object);
    ref.set(object).then((ref) => {
      writing.resolve();
    }, (error) => {
      writing.reject(error);
    });
    return writing.promise;
  }

  saveObject(firebaseObject) {
    var updating = this.$q.defer();
    firebaseObject.$save().then((ref) => {
      updating.resolve();
    }, (error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  stripFirebaseAttributes(object) {
    for (var key in object) {
      if (key.indexOf('$') === 0) {
        delete object[key];
      }
      if (object.listeners) {
        delete object.listeners;
      }
    }
  }

  get() {
    var getting = this.$q.defer();
    var ref = this.database.ref(ref);
    var obj = this.$firebaseObject(ref);
    obj.$loaded(
            function (data) {
              getting.resolve(data);
            },
            function (error) {
              getting.reject(error);
            }
    );
    return getting.promise;
  }

  waitForValue(refPath, timeout = 30) {
    var waitingFor = this.$q.defer();
    var ref = this.database.ref(refPath);
    ref.on("value", (snapshot) => {
      if (!snapshot || snapshot.val() === undefined || snapshot.val() === null) {
        return;
      }
      var value = snapshot.val();
      waitingFor.resolve(value);
      ref.off();
      this.clearWaitForValueTimeout(timeouting);
    });
    var timeouting = this.setWaitForValueTimeout(ref, waitingFor, timeout);

    return waitingFor.promise;
  }

  setWaitForValueTimeout(ref, waitingFor, timeout) {
    return this.$timeout(() => {
      ref.off();
      waitingFor.reject(this.filteredTranslate('AUTH.ERROR_SERVER_TIMEOUT'));
    }, timeout * 1000);
  }

  clearWaitForValueTimeout(timeouting) {
    if (timeouting) {
      this.$timeout.cancel(timeouting);
    }
  }

  deleteFromDb(path) {
    var ref = this.database.ref(path);
    var obj = this.$firebaseObject(ref);
    return obj.$remove();
  }

  /* ------ UTILITIES ------- */

  isProviderASocial(provider) {
    if (this.contains(provider, 'google') || this.contains(provider, 'facebook') || this.contains(provider, 'github')) {
      return true;
    }
    return false;
  }

  contains(searchIn, searchFor) {
    if (searchIn === null || searchIn === undefined) {
      return false;
    }
    return searchIn.indexOf(searchFor) !== -1;
  }

  /* ------ STORAGE ------- */

  uploadFile(path, file) {
    var uploading = this.$q.defer();
    var storageRef = this.firebase.storage().ref(path);
    var storage = this.$firebaseStorage(storageRef);
    var uploadTask = storage.$put(file);
    uploadTask.$complete((snapshot) => {
      uploading.resolve(snapshot.downloadURL);
    });
    uploadTask.$error((error) => {
      uploading.reject(error);
    });
//oh really angularfire doc?
//    uploadTask.then((snapshot) => {
//      uploading.resolve(snapshot.downloadURL);
//    }).catch((error) => {
//      uploading.reject(error);
//    });
    return uploading.promise;
  }

  getDownloadUrl(path) {
    var getting = this.$q.defer();
    var storageRef = this.firebase.storage().ref(path);
    var storage = this.$firebaseStorage(storageRef);
    storage.$getDownloadURL().then((url) => {
      getting.resolve(url);
    }).catch(error => {
      getting.reject(error);
    });
    return getting.promise;
  }

}

export default AngularFireService;