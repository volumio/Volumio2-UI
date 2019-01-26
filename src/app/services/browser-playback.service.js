import { Howl } from 'howler';
import ObserverService from './utils/observer-service';


const exampleTrack = 'http://techslides.com/demos/samples/sample.flac';


/**
 * https://github.com/goldfire/howler.js/issues/825#issuecomment-446322017
 */
Howl.prototype.changeSrc = function (newSrc) {
  var self = this;
  self.unload(true);
  self._src = newSrc;
  self.load();
};

class BrowserPlaybackService extends ObserverService {
  constructor(socketService, $log) {
    'ngInject';
    super();
    this.socketService = socketService;
    this.$log = $log;
    this.howlerSoundID = undefined;
    this.prevServerState = {};
    this.sound = new Howl({
      src: [
        exampleTrack
      ]
    });

    // only update this with updateState,
    // this object is pushed to observers
    this.state = {
      mute: false,
      volume: 1.0,
    };
  }

  toggleMute() {
    console.log('hit toggle mute');
    // this.sound.mute(!this.state.mute);
    // this.updateState({ mute: !this.state.mute });
  }

  setVolume(vol) {
    console.log('hit set volume');
    // this.sound.volume(vol);
    // this.updateState({ volume: vol });
  }


  syncServerState(obj) {
    console.log('hit sync state');
    // const serverState = {
    //   uri: obj.uri,
    //   status: obj.status,
    //   seek: obj.seek,
    // };

    // if (this.prevServerState.uri === serverState.uri &&
    //   this.prevServerState.status === serverState.status &&
    //   this.prevServerState.seek === serverState.seek) {
    //   return;
    // } else {
    //   this.prevServerState = serverState;
    // }

    // const seekTime = parseInt((serverState.seek / 1000));


    // if (serverState.status === 'play') {
    //   if (this.sound._src !== serverState.uri) {
    //     this.sound.changeSrc(serverState.uri);
    //     console.log('change src');
    //   }

    //   if (this.sound.playing() === false) {
    //     if (this.sound.state() !== 'loaded') {
    //       const d1 = new Date();
    //       let self = this; // boo
    //       this.sound.once('load', function () {
    //         const d2 = new Date();
    //         const deltaSeconds = ((d2.getTime() - d1.getTime()) / 1000);

    //         self.sound.seek(seekTime + deltaSeconds, self.howlerSoundID);
    //         self.howlerSoundID = self.sound.play(self.howlerSoundID);
    //         console.log('loaded play event');
    //       });
    //     } else {
    //       this.sound.seek(seekTime, this.howlerSoundID);
    //       this.howlerSoundID = this.sound.play(this.howlerSoundID);
    //       console.log('already loaded play event');
    //     }
    //   } else {
    //     this.sound.seek(seekTime, this.howlerSoundID);
    //     console.log('seek');
    //   }
    // } else if (serverState.status === 'pause') {
    //   this.sound.pause(this.howlerSoundID);
    //   console.log('pause');
    // } else {
    //   console.log('fell out');
    // }
  }
}

export default BrowserPlaybackService;
