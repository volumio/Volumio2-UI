class PlaylistController {
  constructor (playQueue) {
    'ngInject';
    this.playQueue = playQueue;
    console.log(playQueue);
  }
}

export default PlaylistController;
