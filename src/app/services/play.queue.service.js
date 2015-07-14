class PlayQueue {
  constructor ($log, socketService) {
    'ngInject';
    this.$log = $log;

    this._queue = [
      {artist: 'Nirvana', album: 'Nevermind', title: 'Come as you are'},
      {artist: 'Led Zeppelin', album: 'Led II', title: 'Rock n roll'},
      {artist: 'Korn', album: 'Untouchable', title: 'Roll'},
    ];

    // TODO featch queue on load

    // TODO fetch queue on server emit
    //this.socketService.on('volumioPushState', (data) => {
     //console.log(data);
     //this.state = data;
    //});

    // TODO this or player should be notified about the current song
  }


  add() {
    // TODO add and update the queue
    //this.socketService.emit('volumioPlay');
  }

  remove() {
    //this.socketService.emit('volumioPause');
  }

  clearAll() {
    //this.socketService.emit('spopUpdateTracklist');
  }

  isFirst() {

  }

  isLast() {

  }

  get queue() {
    return this._queue;
  }

  get lenght() {
    return this._queue.lenght;
  }


}

export default PlayQueue;
