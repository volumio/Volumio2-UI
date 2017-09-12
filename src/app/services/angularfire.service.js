class AngularFireService {
  constructor($rootScope, $timeout, $firebaseAuth) {
    'ngInject';
    this.rootScope = $rootScope;
    this.firebaseModule = firebase;
    this.authModule = $firebaseAuth;
    this.authService;
    console.log("AngularFire loaded");
    this.initFirebase();
    this.test();
  }

  initFirebase(){
    let config = this.getFirebaseConfig();
    this.firebaseModule.initializeApp(config);
    this.initServices();
  }
  
  initServices(){
    this.authService = this.authModule();
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
  
  test(){
    this.rootScope.firebaseUser = null;
    this.rootScope.error = null;

    this.authService.$signInWithEmailAndPassword('aaaa@bbb.cc','fdieifhiesfvhi').then((firebaseUser) => {
      this.rootScope.firebaseUser = firebaseUser;
      console.log(firebaseUser);
    }).catch((error) => {
      this.rootScope.error = error;
      console.log(error);
    });
  }

}

export default AngularFireService;
