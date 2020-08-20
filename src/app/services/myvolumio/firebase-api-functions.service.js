class FirebaseApiFunctionsService {

  constructor($rootScope, $http, $q, devService, modalService, angularFireService) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.devService = devService;
    this.modalService = modalService;
    this.angularFireService = angularFireService;

    this.API_URL_PROD = 'https://functions.volumio.cloud';
    this.API_URL_DEV = 'https://functions-dev.volumio.cloud';
  }

  getApiUrl(){
    var isDev = this.devService.isDevSync();
    if(isDev){
      return this.API_URL_DEV;
    }else{
      return this.API_URL_PROD;
    }
  }

  getSubscriptionCancelUrl(userId, token){
    var url = this.getApiUrl()+'/api/v1/getSubscriptionCancelUrl';

    let promise = new Promise((resolve, reject) => {
      this.$http({
        url: url,
        method: "POST",
        params: { "token": token, "uid": userId }
      }).then(
        res => {
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      );
    });
    return promise;
  }

  executeUpdateSubscription(newPlan, planDuration, userId, token){
    var url = this.getApiUrl()+'/api/v1/updateSubscription';
    let promise = new Promise((resolve, reject) => {
      this.$http({
        url: url,
        method: "POST",
        params: { "token": token, "uid": userId, "newPlan": newPlan, "planDuration": planDuration }
      }).then(
        res => {
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      );
    });
    return promise;
  }

  executeCancelSubscription(userId, token){
    var url = this.getApiUrl()+'/api/v1/cancelSubscription';

    let promise = new Promise((resolve, reject) => {
      this.$http({
        url: url,
        method: "POST",
        params: { "token": token, "uid": userId }
      }).then(
        res => {
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      );
    });
    return promise;
  }

  doDisableDeviceApiCall(device, uid){
    var url = this.getApiUrl()+'/api/v1/disableMyVolumioDevice';

    return this.getUserToken().then(token => {
      return this.$http({
        url: url,
        method: "POST",
        params: { token: token, uid: uid, hwuuid: device.hwuuid }
      }).then(response => {
        return response.data;
      });
    });
  }

  doEnableDeviceApiCall(device, uid){
    var url = this.getApiUrl()+'/api/v1/enableMyVolumioDevice';

    return this.getUserToken().then(token => {
      return this.$http({
        url: url,
        method: "POST",
        params: { token: token, uid: uid, hwuuid: device.hwuuid }
      }).then(response => {
        return response.data;
      });
    });
  }

  deleteDevice(device, uid){
    var url = this.getApiUrl()+'/api/v1/deleteMyVolumioDevice';

    return this.getUserToken().then(token => {
      return this.$http({
        url: url,
        method: "POST",
        params: { token: token, uid: uid, hwuuid: device.hwuuid }
      }).then(response => {
        return response.data;
      });
    });
  }

  getUserToken(uid = null){
    var url = this.getApiUrl()+'/api/v1/getCustomToken';

    return this.angularFireService.getToken().then(idToken => {
      return this.$http({
        url: url,
        method: "GET",
        params: { idToken: idToken }
      }).then(response => {
        return response.data;
      });
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

}

export default FirebaseApiFunctionsService;
