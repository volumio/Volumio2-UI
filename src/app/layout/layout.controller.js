class LayoutController {
  constructor($state, $log) {
    'ngInject';
    this.$state = $state;
    this.$log = $log;
  }

  swipeLeft() {
    const currentState = this.$state.current.name;
    this.$log.debug(this.$state.current.name);
    switch (currentState) {
      case 'volumio.browse':
        this.$state.go('volumio.playback');
        break;
      case 'volumio.playback':
        this.$state.go('volumio.play-queue');
        break;
    }
  }

  swipeRight() {
    const currentState = this.$state.current.name;
    switch (currentState) {
      case 'volumio.play-queue':
        this.$state.go('volumio.playback');
        break;
      case 'volumio.playback':
        this.$state.go('volumio.browse');
        break;
    }
  }
}

export default LayoutController;
