class ModalTrackManagerActionsController {
  constructor($uibModalInstance, dataObj, playerService, $state, socketService, $log, $timeout, browseService,
      $translate, uiSettingsService) {
    'ngInject';

    this.$log = $log;
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.playerService = playerService;
    this.$state = $state;
    this.socketService = socketService;
    this.$timeout = $timeout;
    this.browseService = browseService;
    this.$translate = $translate;
    this.uiSettingsService = uiSettingsService;
  }

  goTo(type) {
    this.$state.go('volumio.browse');
    let emitPayload = {
      type: type,
      value: this.playerService.state[type],
      artist: this.playerService.state.artist,
      album: this.playerService.state.album
    };
    this.browseService.goTo(emitPayload);
    this.closeModal();
  }

  tweetTrack(data) {
    let windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let twitterUrl = 'http://twitter.com/share?';
    let shareQuerystring = encodeURI(`text=♫ ${this.playerService.state.artist} - ${this.playerService.state.title}`);
    shareQuerystring += '&hashtags=nowplaying';
    if (data && data.via) {
      shareQuerystring += '&via=' + data.via;
    } else {
      shareQuerystring += '&via=volumio';
    }
    if (data && data.url) {
      shareQuerystring += '&url=' + data.url;
    } else {
      shareQuerystring += '&url=http://www.volumio.com';
    }
    let shareUrl = `${twitterUrl}${shareQuerystring}`;
    let width  = 500,
        height = 400,
        left   = Math.ceil((windowWidth  - width)  / 2),
        top    = Math.ceil((windowHeight - height) / 2),
        url    = shareUrl,
        opts   = `status=1,width=${width},height=${height},top=${top},left=${left}`;
    window.open(url, 'twitter', opts);
    this.closeModal();
  }

  closeModal() {
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default ModalTrackManagerActionsController;
