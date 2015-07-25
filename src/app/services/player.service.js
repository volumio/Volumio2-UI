class PlayerService {
  constructor ($rootScope, $log, socketService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;

    this._volume = 80;
    this._volumeStep = 10;
    //this._lastVolume = 80;
    //this._mute = false;

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
    this.volume += this.volumeStep;
  }

  volumeDown() {
    this.volume -= this.volumeStep;
  }

  mute() {
    this.socketService.emit('volume', this._volume);
  }

    // GETTER & SETTER ---------------------------------------------------------
  get volume() {
    return parseInt(this._volume);
  }

  set volume(volume) {
    if(volume < 0 ) {
      this._volume = 0;
    } else if(volume > 100) {
      this._volume = 100;
    }
    this._volume = volume;
    this.socketService.emit('volume', this._volume);
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
