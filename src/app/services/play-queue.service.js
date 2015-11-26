class PlayQueueService {
  constructor($rootScope, $log, socketService) {
    'ngInject';
    this.$log = $log;
    this._queue = null;
    this.socketService = socketService;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  // play(index) {
  //   console.log('PlayQueueService play', index);
  //   this.socketService.emit('play', {value: index});
  // }

  //play song and add to queue
  addPlay(item) {
    console.log('PlayQueueService addPlay', item);
    this.socketService.emit('addPlay', {
      uri: item.uri,
      service: (item.service || null)
    });
  }

  playPlaylist(index) {
    console.log('PlayQueueService playPlaylist', index);
    this.socketService.emit('playPlaylist', {name: index.title});
  }

  //add to queue for song
  add(item) {
    console.log('PlayQueueService addToQueue', item);
    this.socketService.emit('addToQueue', {uri: item.uri});
  }

  //add to queue method for playlist
  enqueue(index) {
    console.log('PlayQueueService enqueue', index);
    this.socketService.emit('enqueue', {name: index.title});
  }

  remove(index) {
    console.log('removeFromQueue', index);
    this.socketService.emit('removeFromQueue', {value: index});
  }

  clearAll() {
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

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushQueue', (data) => {
      console.log('pushQueue', data);
      this._queue = data;
    });
  }

  initService() {
    this.socketService.emit('getQueue');
  }
}

export default PlayQueueService;
