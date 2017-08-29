class PlayerService {
  constructor($rootScope, $log, $interval, socketService, themeManager, uiSettingsService, $document) {
    'ngInject';
    this.$log = $log;
    this.$interval = $interval;
    this.socketService = socketService;
    this.themeManager = themeManager;
    this.$rootScope = $rootScope;
    this.uiSettingsService = uiSettingsService;
    this.$document = $document;

    this.serverStateNumeral = -1;
    this.stateNumeral = 0;

    this.state = null;
    this.trackInfo = null;
    this.favourite = {
      favourite: false
    };

    this.seek = 0;
    this._thick = 1000;
    this._seekScale = 1000;
    this.elapsedTimeString = '0:00';

    this._volume = 80;
    this._volumeStep = 10;

    this._shuffle = false;
    this._repeatTrack = false;
    this._repeatAlbum = false;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  // PLAYER --------------------------------------------------------------------
    // METHODS -----------------------------------------------------------------
  play() {
    this.$log.debug('play');
    this.socketService.emit('play');
  }

  pause() {
    this.$log.debug('pause');
    this.stopSeek();
    this.socketService.emit('pause');
  }

  stop() {
    this.$log.debug('stop');
    this.socketService.emit('stop');
    this.$interval.cancel(this.intervalHandler);
    this.seekPercent = 0;
    this.elapsedTime = 0;
    this.calculateElapsedTimeString();
  }

  prev() {
    if (this.state.trackType !== 'webradio') {
      this.socketService.emit('prev');
    }
  }

  next() {
    if (this.state.trackType !== 'webradio') {
      this.socketService.emit('next');
    }
  }

  shuffle() {
    if (this.state.trackType !== 'webradio') {
      this.$log.debug(!this.state.random);
      this.socketService.emit('setRandom', {value: !this.state.random});
    }
  }

  repeatAlbum() {
    if (this.state.trackType !== 'webradio') {
      this.socketService.emit('setRepeat', {value: !this.state.repeat});
    }
  }

  rebuildSpopLibrary() {
    this.socketService.emit('spopUpdateTracklist');
  }

  rebuildLibrary() {
    this.socketService.emit('rebuildLibrary');
  }

  set seek(val) {
    if (this.state) {
      this.stopSeek();
      // if (val === 0) {
      //   val = 1;
      // }
      let sec = Math.ceil(this.state.duration / this._seekScale * val);
      //this.$log.debug('val', val, 'seek', sec);
      this.socketService.emit('seek', sec);
    }
  }

  get seek() {
    return null;
  }

  // VOLUME --------------------------------------------------------------------
    // METHODS -----------------------------------------------------------------
  volumeUp() {
    // this.volume += this._volumeStep;
    this.socketService.emit('volume', '+');
  }

  volumeDown() {
    // this.volume -= this._volumeStep;
    this.socketService.emit('volume', '-');
  }

  toggleMute() {
    if (this.state.mute) {
      this.$log.debug('unmute', this.state.mute);
      this.socketService.emit('unmute');
    } else {
      this.$log.debug('mute', this.state.mute);
      this.socketService.emit('mute');
    }
  }

  calculateSeekPercent() {
    return Math.floor((this.elapsedTime / this._seekScale) / this.state.duration * 100 * 10) ;
  }

  calculateElapsedTimeString() {
    //this.$log.debug(this.elapsedTime);
    let momentDuration = moment.duration(this.elapsedTime),
      hours = momentDuration.hours(),
      minutes = momentDuration.minutes(),
      seconds = momentDuration.seconds();
    if (this.hours > 0) {
      this.elapsedTimeString = hours + ':' + minutes + ':' +
        ((seconds < 10) ? ('0' + seconds) : seconds);
    } else {
      this.elapsedTimeString = minutes + ':' +
        ((seconds < 10) ? ('0' + seconds) : seconds);
    }
  }

  startSeek() {
    this.stopSeek();
    this.intervalHandler = this.$interval(() => {
      this.elapsedTime += this._thick;
      this.updateSeek();
    }, this._thick);
  }

  updateSeek() {
    this.seekPercent = this.calculateSeekPercent();
    this.calculateElapsedTimeString();
    if (this.seekPercent >= this._seekScale) {
      this.stopSeek();
      this.seekPercent = 0;
    }
  }

  stopSeek() {
    if (this.intervalHandler) {
      this.$interval.cancel(this.intervalHandler);
    }
  }


    // GETTER & SETTER ---------------------------------------------------------
  get volume() {
    if (this.state) {
      return parseInt(this.state.volume);
    } else {
      return 0;
    }
  }

  set volume(volume) {
    if (volume < 0) {
      volume = 0;
    } else if (volume > 100) {
      volume = 100;
    }
    //The numeral is used to ensure that socket.io events are not processed by the backend in a problematic order
    //The be will discard any volume event that has nu
    this.$log.log('volume ' + volume + ', numeral ' + this.stateNumeral);
    this.socketService.emit('volume', {volume: volume, numeral: this.stateNumeral});
    this.stateNumeral++;
  }

  get albumart() {
    if (this.state && this.state.albumart) {
      return this.getAlbumart(this.state.albumart);
    } else {
      return null;
    }
  }

  getAlbumart(albumart) {
    if (!albumart) {
      return '';
    }
    if (~albumart.indexOf('http')) {
      return albumart;
    } else {
      return `${this.socketService.host}${albumart}`;
    }
  }

  init() {
    this.registerListner();
    this.initService();
  }

  updatePageTitle() {
    this.pageTitle = '';
    if (this.state.status !== 'play' || (!this.state.artist && !this.state.title)) {
        this.pageTitle = this.uiSettingsService.defaultPageTitle;
    } else {
      if (this.state.artist) {
        this.pageTitle = this.state.artist;
      }
      if (this.state.title) {
        this.pageTitle += (this.pageTitle) ? ` - ${this.state.title}` : this.state.title;
      }
    }
    if (this.pageTitle) {
      this.$document[0].title = this.pageTitle;
    }
  }

  updateFavicon() {
    if (this.themeManager.theme === 'volumio') {
      if (this.state.status === 'play') {
        this.$rootScope.favicon = `${this.$rootScope.variantAssetsUrl}/favicons/favicon-play.png`;
      } else if (this.state.status === 'pause') {
        this.$rootScope.favicon = `${this.$rootScope.variantAssetsUrl}/favicons/favicon-pause.png`;
      } else {
        this.$rootScope.favicon = `${this.$rootScope.variantAssetsUrl}/favicons/favicon.png`;
      }
    }
  }

  loadFileFormatIcon() {
    if (this.state.trackType) {
      switch (this.state.trackType) {
        case 'dff':
          this.state.fileFormat = {
            url: 'dsd',
            name: 'dff dsd'
          };
          break;
        case 'dsf':
          this.state.fileFormat = {
            url: 'dsd',
            name: 'dsf dsd'
          };
          break;
        case 'ogg':
          this.state.fileFormat = {
            url: 'ogg',
            name: 'oga vorbis'
          };
          break;
        case 'oga':
          this.state.fileFormat = {
            url: 'ogg',
            name: 'ogg vorbis'
          };
          break;
        case 'wv':
          this.state.fileFormat = {
            url: 'wavpack',
            name: 'wavpack'
          };
          break;
        case 'aac':
        case 'aiff':
        case 'alac':
        case 'dsd':
        case 'dts':
        case 'flac':
        case 'm4a':
        case 'mp3':
        case 'mp4':
        case 'opus':
        case 'spotify':
        case 'wav':
        case 'wawpack':
        case 'airplay':
        case 'YouTube':
        case 'rr':
        case 'bt':
        case 'wma':
          this.state.fileFormat = {
            url: this.state.trackType,
            name: this.state.trackType
          };
          break;
        default:
          this.state.fileFormat = null;
      }
    } else {
      this.state.fileFormat = null;
    }
  }

  registerListner() {
    this.socketService.on('connected', () => {
      this.serverStateNumeral = -1;
    });

    this.socketService.on('pushState', (data) => {
      if(data.numeral < this.serverStateNumeral){
        return;
      }
      this.serverStateNumeral = data.numeral;

      this.$log.debug('pushState', data);
      this.state = data;

      this.state.disableUi = this.state.service === 'airplay' || this.state.service === 'analogin';

      this.elapsedTime = this.state.seek;
      if (this.state.status === 'play') {
        this.startSeek();
      } else if (this.state.status === 'stop') {
        this.stopSeek();
        this.elapsedTimeString = '0:00';
        this.updateSeek();
      } else if (this.state.status === 'pause') {
        this.stopSeek();
        this.updateSeek();
      }
      if (this.state.duration) {
        this.songLength = Math.floor(this.state.duration / 60);
        let sec = this.state.duration % 60;
        sec = String(sec).length === 1 ? `0${sec}` : sec;
        this.songLength += `:${sec}`;
      } else {
        this.elapsedTimeString = undefined;
        this.songLength = undefined;
      }

      //Forward emit event
      this.$rootScope.$broadcast('socket:pushState', this.state);

      this.updatePageTitle();
      this.updateFavicon();
      this.loadFileFormatIcon();
    });

    this.socketService.on('pushTrackInfo', (data) => {
      this.$log.debug('pushTrackInfo', data);
      this.trackInfo = data;
    });

    this.socketService.on('pushGetSeek', (data) => {
      this.$log.debug('pushGetSeek', data);
      this.seek = data;
    });

    this.socketService.on('urifavourites', (data) => {
      this.$log.debug('urifavourites', data);
      this.favourite = data;
    });
  }

  initService() {
    this.socketService.emit('getState');
    this.socketService.emit('getTrackInfo');
    this.socketService.emit('getSeek');
  }
}

export default PlayerService;
