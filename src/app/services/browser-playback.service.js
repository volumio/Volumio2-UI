import { Howl } from 'howler';
import ObserverService from './utils/observer-service';


const exampleTrack = 'http://techslides.com/demos/samples/sample.flac';

class BrowserPlaybackService extends ObserverService {
  constructor() {
    'ngInject';
    super();
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
    this.sound.mute(!this.state.mute);
    this.updateState({ mute: !this.state.mute });
  }

  setVolume(vol) {
    this.sound.volume(vol);
    this.updateState({ volume: vol });
  }

  syncServerState(serverState) {
    if (serverState.status === 'play') {
      this.sound.play();
    } else if (serverState.status === 'pause') {
      this.sound.pause();
    }
  }
}

export default BrowserPlaybackService;
