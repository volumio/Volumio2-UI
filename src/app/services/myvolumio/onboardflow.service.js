class OnBoardFlowService {
  constructor($http, $log, $window) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.$window = $window;

    this.init();
  }

  init() {
    this.loadOnBoardFlowDefaults();
    this.injectOnboardFlowScript();
  }

  loadOnBoardFlowDefaults(){
    this.$window.onboardFlowSettings = {
        "siteKey":              "Y7UECCYe",
        "user": {
            "id":               "",
            "customerID":       "",
            "email":            "",
            "imageUrl":         "",
        }
    };
  }

  injectOnboardFlowScript() {
    // jshint ignore: start
    const po = document.createElement('script');
    po.type = "text/javascript";
    po.async = true;
    po.src = "https://media.onboardflow.com/gen/tracker/Y7UECCYe.min.js";
    po.onload = po.onreadystatechange = function() {var rs = this.readyState; if (rs && rs != 'complete' && rs != 'loaded') return;
    OnboardFlowLoader = new OnboardFlowLoaderClass(); OnboardFlowLoader.identify(window.onboardFlowSettings);};
    document.head.appendChild(po);
    // jshint ignore: end
  }

  updateUserData(data) {
    this.$window.onboardFlowSettings.debugMode = true;
    this.$window.onboardFlowSettings.user.id = data.uid;
    this.$window.onboardFlowSettings.user.customerID = data.subscriptionId;
    this.$window.onboardFlowSettings.user.email = data.email;
    if (data.photoUrl.length) {
      this.$window.onboardFlowSettings.user.imageUrl = data.photoUrl;
    }
    this.updateUserCustomProperties(data);
  }

  updateUserCustomProperties(data) {
    if (!this.$window.onboardFlowSettings.customProperties) {
      this.$window.onboardFlowSettings.customProperties = {};
    }
    this.$window.onboardFlowSettings.customProperties.plan = data.plan;
  }
}

export default OnBoardFlowService;
