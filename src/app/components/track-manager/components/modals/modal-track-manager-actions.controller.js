import { reject } from "lodash";

class ModalTrackManagerActionsController {
  constructor($uibModalInstance, dataObj, playerService, $state, socketService, $log, $timeout, browseService,
      $translate, uiSettingsService, $http, modalService, authService, $filter) {
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
    this.filteredTranslate = $filter('translate');

    this.creditsLoading = false;
    this.creditsError = false;
    this.storyError = false;
    this.artistStoryLoading = false;
    this.artistError = false;
    this.albumStoryError = false;
    this.albumStoryLoading = false;
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

  requestMetavolumioApi(requestObject) {
    return new Promise((resolve, reject) => {
      let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
      this.$http.post(mataVolumioUrl, requestObject, this.creditRequestOptions)
        .then((response) => {
          if (response.data && response.data.success && response.data.data && response.data.data.value) {
            resolve(response.data.data);
          } else {
            reject({ error: true });
          }
          this.trackStoryLoading = false;
        })
        .catch(err => reject(err));
    });
  }

  getArtistStory() {
    if (this.checkAuthAndSubscription().authEnabled && this.checkAuthAndSubscription().plan !== 'superstar') {
      this.showPremiumFeatureModal();
      return;
    }
    this.artistStoryLoading = true;
    let metaObject = {
      'endpoint': 'metavolumio',
      'data': {
        'mode':'storyArtist',
        'artist': this.playerService.state.artist,
      }
    };

    this.requestMetavolumioApi(metaObject)
      .then(result => {
          this.artistError = false;
          this.currentItemMetas.artistStory = result.value;
          this.showArtistStory();
      })
      .catch(error => {
        this.artistError = true;
      })
      .finally(() => {
        this.artistStoryLoading = false;
      });
  }

  getTrackStory() {
    if (this.checkAuthAndSubscription().authEnabled && this.checkAuthAndSubscription().plan !== 'superstar') {
      this.showPremiumFeatureModal();
      return;
    }
    this.trackStoryLoading = true;
    let metaObject = {
      'endpoint': 'metavolumio',
      'data': {
        'mode':'storyTrack',
        'artist': this.playerService.state.artist,
        'album': this.playerService.state.album,
        'track': this.playerService.state.title
      }
    };

    this.requestMetavolumioApi(metaObject)
      .then(result => {
        this.storyError = false;
        this.currentItemMetas.trackStory = result.value;
        this.showTrackStory();
      })
      .catch(error => {
        this.storyError = true;
      })
      .finally(() => {
        this.trackStoryLoading = false;
      });
  }


  getAlbumCredits() {
    if (this.checkAuthAndSubscription().authEnabled && this.checkAuthAndSubscription().plan !== 'superstar') {
      this.showPremiumFeatureModal();
      return;
    }
    this.creditsLoading = true;
    let metaObject = {
      'endpoint': 'metavolumio',
      'data': {
        'mode':'creditsAlbum',
        'artist': this.playerService.state.artist,
        'album': this.playerService.state.album
      }
    };

    this.requestMetavolumioApi(metaObject)
      .then(result => {
        this.creditsError = false;
        this.currentItemMetas.albumCredits = result.value;
        this.showAlbumCredits();
      })
      .catch(error => {
        this.creditsError = true;
      })
      .finally(() => {
        this.creditsLoading = false;
      });
  }

  getAlbumStory() {
    if (this.checkAuthAndSubscription().authEnabled && this.checkAuthAndSubscription().plan !== 'superstar') {
      this.showPremiumFeatureModal();
      return;
    }
    this.albumStoryLoading = true;
    let metaObject = {
      'endpoint': 'metavolumio',
      'data': {
        'mode':'storyAlbum',
        'artist': this.playerService.state.artist,
        'album': this.playerService.state.album
      }
    };

    this.requestMetavolumioApi(metaObject)
      .then(result => {
        this.albumStoryError = false;
        this.currentItemMetas.albumStory = result.value;
        this.showAlbumStory();
      })
      .catch(error => {
        this.albumStoryError = true;
      })
      .finally(() => {
        this.albumStoryLoading = false;
      });
  }


  showAlbumCredits() {
    let creditsObject = {
      'title': this.playerService.state.album,
      'credits': this.currentItemMetas.albumCredits
    };
    this.showCreditsDetails(creditsObject);
  }

  showAlbumStory() {
    let creditsObject = {
      title: this.playerService.state.album,
      story: this.currentItemMetas.albumStory
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

  showArtistStory() {
    let creditsObject = {
      title: this.playerService.state.artist,
      story: this.currentItemMetas.artistStory
    };
    this.showCreditsDetails(creditsObject);
  }

  showCreditsDetails(details) {
    const templateUrl = 'app/browse-music/components/modal/modal-credits-details.html';
    const controller = 'ModalCreditsDetailsController';
    const params = {
      title: details.title,
      story: details.story || null,
      credits: details.credits,
      upgradeCta: details.upgradeCta || false
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
      title: this.filteredTranslate('MYVOLUMIO.MODAL_DISCOVERY_PREMIUM_TITLE'),
      story: `
        <h2 class="text-center">${ this.filteredTranslate('MYVOLUMIO.MODAL_DISCOVERY_PREMIUM_HEADING') }</h2>
        <p class="text-center">${ this.filteredTranslate('MYVOLUMIO.MODAL_DISCOVERY_PREMIUM_TEXT') }</p>
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
