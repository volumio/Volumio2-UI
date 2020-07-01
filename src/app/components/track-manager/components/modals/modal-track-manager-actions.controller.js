class ModalTrackManagerActionsController {
  constructor($uibModalInstance, dataObj, playerService, $state, socketService, $log, $timeout, browseService,
      $translate, uiSettingsService, $http, modalService, authService) {
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
    this.$http = $http;
    this.modalService = modalService;
    this.authService = authService;

    this.creditsLoading = false;
    this.creditsError = false;
    this.storyError = false;
    this.currentItemMetas = {};
    this.trackStoryLoading = false;
    this.creditRequestOptions = {"timeout":7000};

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

  getTrackStory() {
    if (!this.checkAuthAndSubscription().authEnabled || this.checkAuthAndSubscription().plan !== 'superstar') {
      this.showPremiumFeatureModal();
      return;
    }
    this.trackStoryLoading = true;
    if (this.playerService.state) {
      let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
      let metaObject = {
        'endpoint': 'metavolumio',
        'data': {
          'mode':'storyTrack',
          'artist': this.playerService.state.artist,
          'album': this.playerService.state.album,
          'track': this.playerService.state.title
        }
      };
      return this.$http.post(mataVolumioUrl, metaObject, this.creditRequestOptions).then((response) => {
        if (response.data && response.data.success && response.data.data && response.data.data.value) {
          this.storyError = false;
          this.currentItemMetas.trackStory = response.data.data.value;
          this.showTrackStory();
        } else {
          this.storyError = true;
        }
        this.trackStoryLoading = false;
      });
    }
  }

  getAlbumCredits() {
    if (this.currentItemMetas.albumCredits) {
      this.showAlbumCredits();
      return;
    }
    const albumInfo = this.playerService.state;
    this.currentItemMetas.albumCredits = '';
    if (albumInfo && albumInfo.artist && albumInfo.album) {
      this.creditsLoading = true;
      let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
      let metaObject = {
        'endpoint': 'metavolumio',
        'data': {
          'mode':'creditsAlbum',
          'artist': albumInfo.artist,
          'album': albumInfo.album
        }
      };
      return this.$http.post(mataVolumioUrl, metaObject).then((response) => {
        if (response.data && response.data.success && response.data.data && response.data.data.value) {
          this.creditsError = false;
          this.currentItemMetas.albumCredits = response.data.data.value;
          this.showAlbumCredits();
        } else {
          this.creditsError = true;
        }
        this.creditsLoading = false;
      });
    }
  }

  showAlbumCredits() {
    let creditsObject = {
      'title': this.playerService.state.album,
      'credits': this.currentItemMetas.albumCredits
    };
    this.showCreditsDetails(creditsObject);
  }
  
  showTrackStory() {
    let creditsObject = {
      title: this.playerService.state.album,
      story: this.currentItemMetas.trackStory
    };
    this.showCreditsDetails(creditsObject);
  }

  showCreditsDetails(details) {
    const templateUrl = 'app/browse-music/components/modal/modal-credits-details.html';
    const controller = 'ModalCreditsDetailsController';
    const params = {
      title: details.title,
      story: details.story || null,
      credits: details.credits
    };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'md'
    );
  }

  showPremiumFeatureModal() {
    this.showCreditsDetails({
      title: 'Music and Artists Credit Discovery',
      story: `
        <h2 class="text-center">This feature is available for Volumio Superstart subscribers.</h2>
        <p class="text-center">Enhanced metadata for your local music and much more.</p>
      `,
      upgradeCta: true
    });
  }

  checkAuthAndSubscription() {
    let result = {
      authEnabled: false,
      plan: null
    };
    if (this.authService) {
      result.authEnabled = this.authService.isEnabled;
      if (this.authService.user) {
        result.plan = this.authService.user.plan;
      }
    }
    return result;
  }

}

export default ModalTrackManagerActionsController;
