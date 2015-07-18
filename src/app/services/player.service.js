class PlayerService {
  constructor ($rootScope, $log, socketService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;

    this._volume = 80;
    this._lastVolume = 80;
    this._mute = false;

    this._shuffle = false;
    this._repeatTrack = false;
    this._repeatAlbum = false;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  // PLAYER --------------------------------------------------------------------
    // METHODS -----------------------------------------------------------------
  play() {
    console.log('play');
    this.socketService.emit('volumioPlay');
  }

  pause() {
    this.socketService.emit('volumioPause');
  }

  stop() {
    this.socketService.emit('volumioStop');
  }

  previus() {
    this.socketService.emit('volumioPrevious');
  }

  next() {
    this.socketService.emit('volumioNext');
  }

  shuffle() {
    this._shuffle = !this._shuffle;
  }

  repeatTrack() {
    this._repeatTrack = !this._repeatTrack;
  }

  repeatAlbum() {
    this._repeatAlbum = !this._repeatAlbum;
  }

  rebuildSpopLibrary() {
    this.socketService.emit('spopUpdateTracklist');
  }

  rebuildLibrary() {
    this.socketService.emit('volumioRebuildLibrary');
  }


    // GETTER & SETTER ---------------------------------------------------------
  get status() {
    return this._state.status;
  }

  set status(status) {
    //this._status = status;
  }

  get currentTrack() {
    return this._currentTrack;
  }

  set currentTrack(track) {
    this._currentTrack = track;
  }


  // VOLUME --------------------------------------------------------------------
    // METHODS -----------------------------------------------------------------
  volumeUp() {
    if(this._mute) {
      this.mute();
    }
    this.volume += 10;
  }

  volumeDown() {
    if(this._mute) {
      this.mute();
    }
    this.volume -= 10;
  }

  mute() {
    //debugger;
    if (!this._mute) {
      this._lastVolume = this.volume;
      this.volume = 0;
    } else {
        this.volume = this._lastVolume;
    }
    this._mute = !this._mute;
  }

    // GETTER & SETTER ---------------------------------------------------------
  get volume() {
    return parseInt(this._volume);
  }

  set volume(volume) {
    if(volume >= 0 && volume <= 100) {
      this._volume = volume;
    } else {
      throw('Volume value not valid: ' + volume);
    }
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('volumioPushState', (data) => {
     //console.log(data);
     this.state = data;
    });
  }

  initService() {
    //this.socketService.emit('playerInit');
    this.socketService.emit('volumioGetState');
  }
}

export default PlayerService;
