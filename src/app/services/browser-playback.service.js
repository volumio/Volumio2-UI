import { Howl } from 'howler';
import ObserverService from './utils/observer-service';


const exampleTrack = 'http://techslides.com/demos/samples/sample.flac';


const hasTrackChanged = (a, b) => a.uri !== b.uri;
const hasPlayPauseChanged = (a, b) => a.status !== b.status;
const hasSeekChanged = (a, b) => a.seek !== b.seek;
const parseServerState = (obj) => ({
  uri: obj.uri,
  status: obj.status,
  seek: obj.seek,
});

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
    this.sound.mute(!this.state.mute, this.howlerSoundID);
    this.updateState({ mute: !this.state.mute });
  }

  setVolume(vol) {
    this.sound.volume(vol, this.howlerSoundID);
    this.updateState({ volume: vol });
  }


  syncServerState(obj) {
    console.log('hit sync state');
    const serverState = parseServerState(obj);

    if (hasTrackChanged(this.prevServerState, serverState)) {
      this.sound.changeSrc(serverState.uri);
    }

    if (hasPlayPauseChanged(this.prevServerState, serverState)) {
      if (serverState.status === 'play') {
        this.howlerSoundID = this.sound.play(this.howlerSoundID);
      } else {
        this.sound.pause(this.howlerSoundID);
      }
    }

    if (hasSeekChanged(this.prevServerState, serverState)) {
      const seekSeconds = parseInt((serverState.seek / 1000));

      this.sound.seek(seekSeconds, this.howlerSoundID);
    }

    this.prevServerState = Object.assign({}, serverState);
  }
}

export default BrowserPlaybackService;
