class ModalTrackManagerActionsController {
  constructor($uibModalInstance, dataObj, playerService, $state, socketService, $log, $timeout, browseService) {
    'ngInject';

    this.$log = $log;
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.playerService = playerService;
    this.$state = $state;
    this.socketService = socketService;
    this.$timeout = $timeout;
    this.browseService = browseService;
  }

  goTo(type) {
    this.$state.go('volumio.browse');
    this.browseService.backHome();
    let emitPayload = {
      type: type,
      value: this.playerService.state[type]
    };
    this.$log.debug('goTo', emitPayload);
    this.$timeout(() => {
      this.socketService.emit('goTo', emitPayload);
    }, 1000, true);
    this.closeModal();
  }

  tweetTrack() {
    let windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let twitterUrl = 'http://twitter.com/share?';
    let shareQuerystring = encodeURI(`text=♫ ${this.playerService.state.artist} - ${this.playerService.state.title}`);
    shareQuerystring += '&hashtags=nowplaying';
    shareQuerystring += '&via=volumio';
    shareQuerystring += '&url=http://www.volumio.com';
    let shareUrl = `${twitterUrl}${shareQuerystring}`;
    console.log(shareUrl);
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
