class StatisticsService {
  constructor($http, $log, $window, cloudService, $rootScope, socketService) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.cloudService = cloudService;
    this.socketService = socketService;
    this.fbInit = false;
    this.gaInit = false;
    this.privacySettings = {};
    this.init();
  }

  init() {
    if(this.cloudService && this.cloudService.isOnCloud) {
      this.initStatistics();
    }
  }

  initStatistics() {
    if (!this.fbInit) {
      this.fbInit = true;
      this.initializeFB();
    }
    if (!this.gaInit) {
      this.gaInit = true;
      this.initializeGA();
    }
  }

  initializeFB() {
    this.$log.debug('Starting FB');
    // jshint ignore: start
    var fbScript = document.createElement('script');
    fbScript.innerHTML += '!function(f,b,e,v,n,t,s)';
    fbScript.innerHTML += '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?';
    fbScript.innerHTML += 'n.callMethod.apply(n,arguments):n.queue.push(arguments)};';
    fbScript.innerHTML += 'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";';
    fbScript.innerHTML += 'n.queue=[];t=b.createElement(e);t.async=!0;';
    fbScript.innerHTML += 't.src=v;s=b.getElementsByTagName(e)[0];';
    fbScript.innerHTML += 's.parentNode.insertBefore(t,s)}(window, document,"script",';
    fbScript.innerHTML += '"https://connect.facebook.net/en_US/fbevents.js");';
    fbScript.innerHTML += 'fbq("init", "454468238446042");';
    fbScript.innerHTML += 'fbq("track", "PageView");';
    document.head.appendChild(fbScript);
    var pScript = document.createElement('noscript');
    pScript.innerHTML = '<img height="1" width="1" src="https://www.facebook.com/tr?id=454468238446042&ev=PageView&noscript=1"/>';
    document.head.appendChild(pScript);
    // jshint ignore: end
  }

  initializeGA() {
    this.$log.debug('Starting GA');
    // jshint ignore: start
    var gaScript1 = document.createElement('script');
    gaScript1.async = true;
    gaScript1.src = 'https://www.google-analytics.com/analytics.js';
    document.head.appendChild(gaScript1);
    var gaScript2 = document.createElement('script');
    gaScript2.innerHTML += 'window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;';
    gaScript2.innerHTML += 'ga("create", "UA-92970181-1", "auto");';
    gaScript2.innerHTML += 'ga("send", "pageview");';
    gaScript2.innerHTML += 'ga("set", "anonymizeIp", true);';
    document.head.appendChild(gaScript2);
    // jshint ignore: end
  }

  initStats() {
    // Dummy function to get the service loaded
  }

  pushPrivacySettings(data) {
    this.$log.debug('pushPrivacySettings', data);
    this.privacySettings = data;
    if (this.privacySettings.allowUIStatistics) {
      this.initStatistics();
    }
  }

}

export default StatisticsService;
