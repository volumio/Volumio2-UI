class PlaylistService {
  constructor ($log) {
    'ngInject';

    this.$log = $log;
    this._status = 'stop';

    this._list = [
      {artist: 'Nirvana', album: 'blech', track: 'track one'},
      {artist: 'Muse', album: 'Origin of simmetry', track: 'Bliss'}
    ];
    this._currentTrack = this._list[0];
    this._name = 'Playlist one';
  }


  // STORAGE -------------------------------------------------------------------
    // METHODS -----------------------------------------------------------------
  savePlaylist() {
  }

  deletePlaylist() {
  }

  renamePlaylist() {
  }

    // GETTER & SETTER ---------------------------------------------------------
  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }




  // LIST --------------------------------------------------------------------
    // METHODS -----------------------------------------------------------------
  start() {

  }

  getNext() {

  }

  getPrev() {

  }

  addTrack(newTrack, position) {
    //Add to the end
    console.log('add Track', newTrack);
    if(!position) {
      this._list.unshift(newTrack);
    }
  }

  removeTrack(position) {

  }



    // GETTER & SETTER ---------------------------------------------------------
  get currentTrack() {
    return this._currentTrack;
  }

  set currentTrack(track) {
    this._currentTrack = track;
  }

  get list() {
    return this._list;
  }

  get length() {
    return this._list.length;
  }

}

export default PlaylistService;
