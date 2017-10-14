class AuthEditProfileController {
  constructor($scope, $state, authService, $q) {
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.$q = $q;

    this.user = null;
    this.emailChanged = false;
    
    this.avatarFile = {};
    this.isAvatarChanged = false;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.authService.getUserPromise(false).then((user) => {
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher(), false);
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
  }

  setUser(user) {
    this.user = user;
  }

  goToProfile() {
    this.$state.go('volumio.auth.profile');
  }

  isUserFilledWithMandatory() {
    return this.authService.isUserFilledWithMandatory(this.user);
  }

  doEdit() {
    var promises = [];
    if (this.user.password) {
      if (!this.checkPasswordMatch()) {
        this.showPasswordNotMatchError();
        return;
      }
      var updatingPassword = this.updatePassword();
      promises.push(updatingPassword);
    }
    if (this.emailChanged === true) {
      var updatingEmail = this.updateEmail();
      promises.push(updatingEmail);
    }
    console.log(this.user);
    console.log(this.user.lastName);
    this.$q.all(promises).then(() => {
      console.log("resolved");
      this.updateUserData();
    }).catch(error => {
      alert(error); //TODO error
    });
  }
  
  updateUserData(){
    console.log(this.user);
    this.authService.saveUserData(this.user).then(() => {
      this.goToProfile();
    }).catch((error) => {
      alert(error); //TODO error in modoal
    });
  }

  updatePassword() {
    var updating = this.$q.defer();
    this.authService.updatePassword(this.user.password).then(() => {
      console.log("update pass");
      updating.resolve();
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  updateEmail() {
    var updating = this.$q.defer();
    this.authService.updateEmail(this.user.email).then(() => {
      console.log("update email");
      updating.resolve();
    }).catch((error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  checkPasswordMatch() { //TODO
    return true;
  }

  showPasswordNotMatchError() {
    //TODO
    alert('Pass not match');
  }
  
  notifyEmailChanged(){
    this.emailChanged = true;
  }
  
  avatarChange(file){
    this.isAvatarChanged = true;
    this.$scope.$apply();
    this.avatarFile = file;
  }
  
  saveAvatar(){
    this.authService.changeAvatar(this.avatarFile,this.user.uid).then((url) => {
      this.user.photoUrl = url;
    }).catch((error) => {
      alert(error); //TODO
    });
  }

}

export default AuthEditProfileController;