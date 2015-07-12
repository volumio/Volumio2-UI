class PlaybackController {
  constructor (player, playlist) {
    'ngInject';
    this.player = player;
    this.playlist = playlist;
    this.test = 'asd';
  }

  addTrack() {
    let newTrack = {
      artist: 'Led Zeppelin',
      album: 'Led Zepperin II',
      track: Math.random() * 10
    };

    this.playlist.addTrack(newTrack);

  }

}

export default PlaybackController;
