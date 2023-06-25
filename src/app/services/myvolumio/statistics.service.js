class StatisticsService {
  constructor($http, $log, $window, cloudService, $rootScope, socketService, databaseService) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.cloudService = cloudService;
    this.socketService = socketService;
    this.databaseService = databaseService;
    this.fbInit = false;
    this.gaInit = false;
    this.privacySettings = {};
    this.user = {};
    this.init();
  }

  init() {
    if(this.cloudService && this.cloudService.isOnCloud) {
      this.initStatistics();
    } else {
      setTimeout(()=>{
        this.initializePushUtil();
      }, 10000);
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
      gaScript1.src = 'https://www.googletagmanager.com/gtag/js?id=G-EMK40SCD1G';
      document.head.appendChild(gaScript1);
      var gaScript2 = document.createElement('script');
      gaScript2.innerHTML += 'window.dataLayer = window.dataLayer || [];';
      gaScript2.innerHTML += 'function gtag(){dataLayer.push(arguments);}';
      gaScript2.innerHTML += 'gtag("js", new Date());';
      gaScript2.innerHTML += 'gtag("config", "G-EMK40SCD1G", { "anonymize_ip": true });';
      document.head.appendChild(gaScript2);
      setTimeout(()=>{
        this.saveGACid();
      },3000)

      // jshint ignore: end
    }

  initializePushUtil() {
    this.$log.debug('Starting Push Util');
    // jshint ignore: start
    var vlScript = document.createElement('script');
    vlScript.async = true;
    vlScript.src = 'https://pushupdates.volumio.org/static/pushupdatesutil.js?env=production';
    document.head.appendChild(vlScript);
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

  signalLead() {
    if (this.gaInit) {
      this.$log.debug('Signalling lead');
      this.$window.gtag('event','registration', {'event_category':'lead','event_label':'myvolumio'});
    }

  }

  signalSubscriptionCreated(product, planDuration, isTrial, paddleData) {
    if (product && product.name && planDuration) {
      let productName = product.name.toLowerCase();
      let planCombo = productName + '_' + planDuration;
      let transactionId = this.user.uid + Date.now();
      let currency = 'EUR';
      if (paddleData && paddleData.checkout && paddleData.checkout.recurring_prices && paddleData.checkout.recurring_prices.customer && paddleData.checkout.recurring_prices.customer.currency) {
        currency = paddleData.checkout.recurring_prices.customer.currency;
      }
      if (paddleData && paddleData.user && paddleData.user.country) {
        this.saveUserCountry(paddleData.user.country);
      }

      if (this.gaInit) {
        this.$log.debug('Signalling subscription created on GA');
        let event = 'trial';
        if (!isTrial) {
          event = 'resubscription';
        }
        let purchaseObj = {'value':0,'currency':currency,'transaction_id':transactionId,'items':[{'id':planCombo,'name':productName,'price':0,'quantity':1}]};
        this.$window.gtag('event',event,{'event_category':'plan','event_label':planCombo});
        this.$window.gtag('event','purchase',purchaseObj);
      }
      if (this.fbInit) {
        this.$log.debug('Signalling subscription created on FB');
        let purchaseFBObj = {'value':0,'currency':currency,'transaction_id':transactionId,'contents':[{'id':planCombo,'name':productName,'price':0,'quantity':1}]};
        this.$window.fbq('track','Purchase',purchaseFBObj);
      }
    }
  }

  signalSubscriptionCancelled(user) {
    if (this.gaInit) {
      this.$log.debug('Signalling subscription cancelled');
      let planName = user && user.plan ? user.plan.toLowerCase() : 'free';
      let planDuration = user && user.planDuration ?  user.planDuration.toLowerCase() : 'monthly';
      let planCombo = planName + '_' + planDuration;
      this.$window.gtag('event','cancellation',{'event_category':'plan','event_label':planCombo});
    }
  }

  saveGACid() {
    this.$window.gtag('get', 'G-EMK40SCD1G', 'client_id', (client_id) => {
      if (this.user && this.user.uid && !this.user.gaCid && client_id) {
        this.databaseService.write('users/' + this.user.uid + '/gaCid', client_id);
      }
    });
  }

  saveUserCountry(countryCode) {
    if (countryCode && countryCode.length === 2 && !this.user.country) {
      this.databaseService.write('users/' + this.user.uid + '/country', countryCode);
    }
  }

  syncUser(user) {
    this.user = user;
    if (this.user && this.user.uid&& !this.user.gaCid && this.gaInit) {
      this.saveGACid();
    }
  }

}

export default StatisticsService;
