class PlayerService {
  constructor($rootScope, $log, $interval, socketService) {
    'ngInject';
    this.$log = $log;
    this.$interval = $interval;
    this.socketService = socketService;

    this.state = null;
    this.trackInfo = null;

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
  }

  // PLAYER --------------------------------------------------------------------
    // METHODS -----------------------------------------------------------------
  play() {
    console.log('play');
    this.socketService.emit('play');
  }

  pause() {
    this.stopSeek();
    this.socketService.emit('pause');
  }

  stop() {
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

  shuffle() {
    console.log(!this.state.random);
    this.socketService.emit('setRandom', {value: !this.state.random});
  }

  repeatAlbum() {
    this.socketService.emit('setRepeat', {value: !this.state.repeat});
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
      //console.log('val', val, 'seek', sec);
      this.socketService.emit('seek', sec);
    }
  }

  get seek() {
    return null;
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
    return Math.floor((this.elapsedTime / this._seekScale) / this.state.duration * 100 * 10) ;
  }

  calculateElapsedTimeString() {
    //let elapsedSeconds = Math.ceil(this.elapsedTime / this._seekScale);
    //console.log(this.elapsedTime);
    let momentDuration = moment.duration(this.elapsedTime),
      minutes = momentDuration.minutes(),
      seconds = momentDuration.seconds();
    this.elapsedTimeString = minutes + ':' +
        ((seconds < 10) ? ('0' + seconds) : seconds);
    // if (elapsedSeconds === 1) {
    //   this.elapsedTimeString = '0:00';
    // } else {
    //   let seconds = Math.floor(elapsedSeconds % 60);
    //   if (seconds < 10) {
    //     seconds = '0' + seconds;
    //   }
    //   this.elapsedTimeString = Math.floor(elapsedSeconds / 60).toFixed(0) + ':' +
    //       seconds;
    // }
    //console.log(elapsedSeconds, this.elapsedTimeString);
  }

  startSeek() {
    this.stopSeek();
    this.elapsedTime = this.state.seek;
    this.intervalHandler = this.$interval(() => {
      this.elapsedTime = (this.elapsedTime + this._thick);
      this.seekPercent = this.calculateSeekPercent();
      this.calculateElapsedTimeString();
      if (this.seekPercent >= this._seekScale) {
        this.stopSeek();
        this.seekPercent = 0;
      }
    }, this._thick);
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
      } else if (this.state.status === 'stop') {
        this.stopSeek();
        this.elapsedTimeString = '0:00';
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
