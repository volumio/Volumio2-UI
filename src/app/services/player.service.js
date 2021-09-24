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
    this._dbVolume = null;
    this.mute = undefined;
    this.disableVolumeControl = false;

    this._shuffle = false;
    this._repeatTrack = false;
    this._repeatAlbum = false;

    this.localVolume = 0;
    this.lastVolumeUpdateTime = -1000;

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

  volatilePlay() {
    this.$log.debug('volatilePlay');
    this.socketService.emit('volatilePlay');
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
      this.socketService.emit('prev');
  }

  next() {
      this.socketService.emit('next');
  }

  skipBackwards() {
    this.socketService.emit('skipBackwards');
  }

  skipForward() {
    this.socketService.emit('skipForward');
  }

  shuffle() {
      this.$log.debug(!this.state.random);
      this.socketService.emit('setRandom', {value: !this.state.random});
  }

  repeatAlbum(repeat,repeatSingle) {
      this.socketService.emit('setRepeat', {value: repeat, repeatSingle: repeatSingle});
  }

  rebuildSpopLibrary() {
    this.socketService.emit('spopUpdateTracklist');
  }

  rebuildLibrary() {
    this.socketService.emit('rebuildLibrary');
  }

  set seek(val) {
    if (this.state && !this.state.disableUi) {
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

  get duration(){
    return this.state.duration;
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
    // Track length is shown as mm:ss - do the same for elapsed time
    minutes += hours*60;
    this.elapsedTimeString = minutes + ':' +
                             ((seconds < 10) ? ('0' + seconds) : seconds);
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
  get remoteVolume() {
    if (this.state) {
      return parseInt(this.state.volume);
    } else {
      return 0;
    }
  }

  getRemoteDbVolume() {
    if (this.state && this.state.dbVolume !== undefined) {
      return parseFloat(this.state.dbVolume);
    } else {
      return null;
    }
  }

  set remoteVolume(volume) {
    if (volume < 0) {
      volume = 0;
    } else if (volume > 100) {
      volume = 100;
    }
    this.$log.debug('volume', volume);
    this.socketService.emit('volume', volume);
  }

  get volume(){
    if(Date.now() - this.lastVolumeUpdateTime > 1000){
      this.localVolume = this.remoteVolume;
    }
    if(Date.now() - this.lastVolumeUpdateTime > 100){
      this._dbVolume = this.getRemoteDbVolume();
    }
    return this.localVolume;
  }

  set volume(volume){
    if(Date.now() - this.lastVolumeUpdateTime > 100 && this.localVolume !== volume){
      this.lastVolumeUpdateTime = Date.now();
      this.remoteVolume = volume;
    }
    this.localVolume = volume;
  }

  isDbVolumeAvailable() {
    return this._dbVolume !== null && !isNaN(this._dbVolume);
  }

  getDbVolume() {
    if (this._dbVolume !== null) {
      return this._dbVolume.toFixed(1);
    }
    return false;
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

  loadFileFormatIcon(trackType) {
    var currentFileFormat;
    var currentTrackType;
    if (trackType) {
      currentTrackType = trackType;
    } else {
      currentTrackType = this.state.trackType;
    }
    if (currentTrackType) {
      switch (currentTrackType) {
        case 'dff':
          currentFileFormat = {
            url: 'dsd',
            name: 'dff dsd'
          };
          break;
        case 'dsf':
          currentFileFormat = {
            url: 'dsd',
            name: 'dsf dsd'
          };
          break;
        case 'ogg':
          currentFileFormat = {
            url: 'ogg',
            name: 'oga vorbis'
          };
          break;
        case 'oga':
          currentFileFormat = {
            url: 'ogg',
            name: 'ogg vorbis'
          };
          break;
        case 'wv':
          currentFileFormat = {
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
        case 'cd':
        case 'tidal':
        case 'qobuz':
        case 'mg':
        case 'mb':
        case 'wma':
        case 'qobuz':
        case 'tidal':
          currentFileFormat = {
            url: currentTrackType,
            name: currentTrackType
          };
          break;
        default:
          this.state.fileFormat = null;
      }
    } else {
      this.state.fileFormat = null;
    }
    if (!trackType) {
      this.state.fileFormat = currentFileFormat;
    } else {
      return currentFileFormat;
    }

  }

  registerListner() {
    this.socketService.on('pushState', (data) => {
      this.$log.debug('pushState', data);
      this.state = data;
      this.state.disableUi = this.state.disableUiControls || this.state.service === 'analogin';

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
      this.mute = data.mute;
      this.disableVolumeControl = data.disableVolumeControl;

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
