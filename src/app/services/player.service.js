class PlayerService {
  constructor ($rootScope, $log, $interval, socketService) {
    'ngInject';
    this.$log = $log;
    this.$interval = $interval;
    this.socketService = socketService;

    this.state = null;
    this.trackInfo = null;

    this.seek = 0;
    this.thick = 500;

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
    this.$interval.cancel(this.intervalHandler);
    this.socketService.emit('pause');
  }

  stop() {
    this.$interval.cancel(this.intervalHandler);
    this.seekPercent = 0;
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

  calculateSeekPercent() {
    return Math.floor((this.elapsedTime / 1000) / this.state.duration * 100);
  }

  startSeek() {
    if(this.intervalHandler) {
      this.$interval.cancel(this.intervalHandler);
    }
    this.elapsedTime = this.state.seek;
    this.intervalHandler = this.$interval(() => {
      this.elapsedTime = (this.elapsedTime + this.thick);
      this.seekPercent = this.calculateSeekPercent();
    }, this.thick);
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
      if (this.state.status === 'play') {
        this.startSeek();
      }
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
