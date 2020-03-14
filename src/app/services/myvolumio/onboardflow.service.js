class OnBoardFlowService {
  constructor($http, $log, $window) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.onBoardFlowStarted = false;
    this.onBoardFlowDebugMode = true;
    this.init();
  }

  init() {

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

  updateUserData(data) {
    if (data && data.uid) {
      if (!this.$window.onboardFlowSettings) {
        this.loadOnBoardFlowDefaults();
      }
      this.$window.onboardFlowSettings.user.id = data.uid;
      this.$window.onboardFlowSettings.user.customerID = data.subscriptionId;
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
      this.updateUserCustomProperties(data);
      if (!this.onBoardFlowStarted) {
        this.initializeOnBoardFlow();
      }
    }

  }

  updateUserCustomProperties(data) {
    if (!this.$window.onboardFlowSettings || !(data && data.uid)) {
      return;
    }
    if (data.plan) {
      this.$window.onboardFlowSettings.customProperties.plan = data.plan;
    }
    if (data.createdAt) {
      this.$window.onboardFlowSettings.customProperties.createdAt = data.createdAt;
    }
    if (data.devices) {
      this.$window.onboardFlowSettings.customProperties.devices = data.devices;
    }
  }
}

export default OnBoardFlowService;
