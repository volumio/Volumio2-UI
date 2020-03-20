class OnBoardFlowService {
  constructor($http, $log, $window, databaseService) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.USER_DEVICES_REF = 'user_devices';
    this.onBoardFlowStarted = false;
    this.onBoardFlowDebugMode = true;
    this.databaseService = databaseService;
  }

  initializeOnBoardFlow() {
    this.injectOnboardFlowScript();
    this.onBoardFlowStarted = true;
  }

  loadOnBoardFlowDefaults(){
    this.$window.onboardFlowSettings = {
        "siteKey":"Y7UECCYe",
        "user": {
            "id":"",
            "customerID":"",
            "email":"",
            "imageUrl":"",
        },
        "customProperties": {}
    };
  }

  injectOnboardFlowScript() {
    // jshint ignore: start
    var onboardFlowScript = document.createElement('script');
    onboardFlowScript.type = "text/javascript";
    onboardFlowScript.async = true;
    onboardFlowScript.innerHTML = '(function() {var po = document.createElement("script"); po.type = "text/javascript"; po.async = true;';
    onboardFlowScript.innerHTML += 'po.src = "https://media.onboardflow.com/gen/tracker/Y7UECCYe.min.js";';
    onboardFlowScript.innerHTML += 'po.onload = po.onreadystatechange = function() {var rs = this.readyState; if (rs && rs != "complete" && rs != "loaded") return;';
    onboardFlowScript.innerHTML += 'OnboardFlowLoader = new OnboardFlowLoaderClass(); OnboardFlowLoader.identify(window.onboardFlowSettings); OnboardFlowLoader.debugMode = ' + this.onBoardFlowDebugMode+ ';};';
    onboardFlowScript.innerHTML += 'var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s);})();';
    document.head.appendChild(onboardFlowScript);
    // jshint ignore: end
  }

  updateOnboardFlowUserData(data) {
    if (data && data.uid && data.paddleUserId) {
      this.$log.debug('Updating onboardflow', data);
      if (!this.$window.onboardFlowSettings) {
        this.loadOnBoardFlowDefaults();
      }
      this.$window.onboardFlowSettings.user.id = data.uid;
      this.$window.onboardFlowSettings.user.customerID = data.paddleUserId;
      this.$window.onboardFlowSettings.user.email = data.email;
      if (data.photoUrl && data.photoUrl.length) {
        this.$window.onboardFlowSettings.user.imageUrl = data.photoUrl;
      }
      if (data.firstName) {
        this.$window.onboardFlowSettings.user.first_name = data.firstName;
      }
      if (data.lastName) {
        this.$window.onboardFlowSettings.user.last_name = data.lastName;
      }
      this.getUserDevices(data.uid).then(devices => {
        this.$window.onboardFlowSettings.customProperties.devices = devices && devices.length ? devices.length : 0;
        if (!this.onBoardFlowStarted) {
          this.initializeOnBoardFlow(this.$window.onboardFlowSettings);
        }
      });
    }
  }

  getUserDevices(uid){
    return this.databaseService.getArray(`/${this.USER_DEVICES_REF}/${uid}`);
  }

}

export default OnBoardFlowService;
