class GrowSurfService {
  constructor($http, $log, $window, firebaseApiFunctionsService, cloudService) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.firebaseApiFunctionsService = firebaseApiFunctionsService;
    this.growSurfParticipantRegistered = false;
    this.growSurfParticipantRegistrationInProgress = false;
    this.cloudService = cloudService;
    this.campaignInfo = {};
    this.participant = {};
    this.init();
  }

  init() {
      this.initializeGrowSurf();
  }

  initializeGrowSurf() {
    this.getCampaingInfo();
    if (this.cloudService.isOnCloud) {
      this.injectGrowSurfScript();
    }
  }

  injectGrowSurfScript() {
    // jshint ignore: start
    // IMPORTANT, IN CASE OF CAMPAIGN CHANGE, UPDATE THE SCRIPT
    var growSurftScript = document.createElement('script');
    growSurftScript.type = "text/javascript";
    growSurftScript.async = true;
    growSurftScript.innerHTML = '(function(g,r,s,f){g.growsurf={};g.grsfSettings={campaignId:"ig3gk4",version:"2.0.0"};s=r.getElementsByTagName("head")[0];f=r.createElement("script");f.async=1;f.src="https://growsurf.com/growsurf.js"+"?v="+g.grsfSettings.version;f.setAttribute("grsf-campaign", g.grsfSettings.campaignId);!g.grsfInit?s.appendChild(f):"";})(window,document);';
    document.head.appendChild(growSurftScript);
    // jshint ignore: end
  }

  initializeGrowSurfConnection(token) {
    if (this.cloudService.isOnCloud) {
      if(!this.$window.growsurf) {
        this.$window.addEventListener('grsfReady', () => {
          this.initializeGrowSurfConnectionWithPotentialReferrer(token);
        });
      } else {
        this.initializeGrowSurfConnectionWithPotentialReferrer(token);
      }
    } else {
      this.registerGrowSurfParticipant(token);
    }
  }

  initializeGrowSurfConnectionWithPotentialReferrer(token) {
    let referrerId = null;
    referrerId = this.$window.growsurf.getReferrerId();
    this.$log.debug('GrowSurf referrerId: ' + referrerId);
    this.registerGrowSurfParticipant(token, referrerId);
  }

  registerGrowSurfParticipant(token, referrerId) {
    var apiEndpointUrl = this.firebaseApiFunctionsService.getApiUrl();
    if (this.growSurfParticipantRegistrationInProgress) {
      return;
    }
    this.growSurfParticipantRegistrationInProgress = true;
    this.$http({
      url: apiEndpointUrl + '/growsurf/myVolumioReferral/participant',
      method: "GET",
      params: { token: token, referrerId: referrerId}
    }).then(response => {
      if (response && response.data && response.data.success && response.data.participant) {
        this.$log.debug('GrowSurf registering participant success: ' + response.data.participant);
        this.growSurfParticipantRegistered = true;
        this.autoLoginGrowSurfParticipant(response.data);
        this.participant = response.data.participant;
      }
    }).catch(error => {
      this.$log.debug('GrowSurf registering participant error: ' + JSON.stringify(error.data));
    }).then(()=>{
      this.growSurfParticipantRegistrationInProgress = false;
    });
  }

  isGrowSurfParticipantRegistered() {
    return this.growSurfParticipantRegistered;
  }

  autoLoginGrowSurfParticipant(data) {
    if (data.participant && data.participant.authenticationHash && this.cloudService.isOnCloud) {
      this.$window.growsurf.init({
        email: data.participant.email,
        hash: data.participant.authenticationHash
      }, ()=>{
        this.$log.debug('GrowSurf participant logged in');
      });
    }
  }

  getCampaingInfo() {
    var apiEndpointUrl = this.firebaseApiFunctionsService.getApiUrl();
    this.$http({
      url: apiEndpointUrl + '/growsurf/myVolumioReferral/campaign',
      method: "GET"
    }).then(response => {
      if (response && response.data && response.data.success && response.data.campaign) {
        this.$log.debug('Campaign info: ' + response.data.campaign);
        this.campaignInfo = response.data.campaign;
      }
    }).catch(error => {
      this.$log.debug('Error getting campaign info: ' + JSON.stringify(error.data));
    });
  }
}

export default GrowSurfService;
