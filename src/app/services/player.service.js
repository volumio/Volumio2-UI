class PlayerService {
  constructor ($rootScope, $log, socketService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;

    this.state = null;
    this.trackInfo = null;
    this.seek = null;

    this._volume = 80;
    this._volumeStep = 10;

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
    this.socketService.emit('play');
  }

  pause() {
    this.socketService.emit('pause');
  }

  stop() {
    this.socketService.emit('stop');
  }

  previus() {
    this.socketService.emit('prev');
  }

  next() {
    this.socketService.emit('next');
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
    this.socketService.emit('rebuildLibrary');
  }


  // VOLUME --------------------------------------------------------------------
    // METHODS -----------------------------------------------------------------
  volumeUp() {
    this.volume += this._volumeStep;
  }

  volumeDown() {
    this.volume -= this._volumeStep;
  }

  toggleMute() {
    this.socketService.emit('volume', 'mute');
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
    if(volume < 0 ) {
      volume = 0;
    } else if(volume > 100) {
      volume = 100;
    }
    this.socketService.emit('volume', volume);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushState', (data) => {
      console.log('pushState', data);
      this.state = data;
    });
    this.socketService.on('pushTrackInfo', (data) => {
      console.log('pushTrackInfo', data);
      this.trackInfo = data;
    });
    this.socketService.on('pushGetSeek', (data) => {
      console.log('pushGetSeek', data);
      this.seek = data;
    });
  }

  initService() {
    this.socketService.emit('getState');
    this.socketService.emit('getTrackInfo');
    this.socketService.emit('getSeek');
  }
}

export default PlayerService;
