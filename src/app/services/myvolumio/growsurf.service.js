class GrowSurfService {
  constructor($http, $log, $window) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.init();
  }

  init() {
    this.initializeGrowSurf();
  }

  initializeGrowSurf() {
    this.injectGrowSurfScript();
  }

  injectGrowSurfScript() {
    // jshint ignore: start
    var growSurftScript = document.createElement('script');
    growSurftScript.type = "text/javascript";
    growSurftScript.async = true;
    growSurftScript.innerHTML = '(function(g,r,s,f){g.growsurf={};g.grsfSettings={campaignId:"m29j1e",version:"2.0.0"};s=r.getElementsByTagName("head")[0];f=r.createElement("script");f.async=1;f.src="https://growsurf.com/growsurf.js"+"?v="+g.grsfSettings.version;f.setAttribute("grsf-campaign", g.grsfSettings.campaignId);!g.grsfInit?s.appendChild(f):"";})(window,document);';
    document.head.appendChild(growSurftScript);
    // jshint ignore: end
  }
}

export default GrowSurfService;
