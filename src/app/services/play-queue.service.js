class PlayQueueService {
  constructor($rootScope, $log, socketService, playerService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;
    this.playerService = playerService;
    this.$rootScope = $rootScope;

    this._queue = null;
    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  play(index) {
    this.$log.debug('PlayQueueService play', index);
    this.socketService.emit('play', {value: index});
  }

  //play song and add to queue
  addPlay(item) {
    this.$log.debug('PlayQueueService addPlay', item);
    this.socketService.emit('addPlay', {
      uri: item.uri,
      title: item.title,
      albumart: (item.albumart || null),
      service: (item.service || null)
    });
  }

  replaceAndPlay(item) {
    this.$log.debug('PlayQueueService replaceAndPlay', item);
    this.socketService.emit('replaceAndPlay', {
      uri: item.uri,
      title: item.title,
      albumart: (item.albumart || null),
      service: (item.service || null)
    });
  }

  replaceAndPlayCue(item) {
    this.$log.debug('PlayQueueService replaceAndPlayCue', item);
    this.socketService.emit('replaceAndPlayCue', {
      uri: item.uri,
      number: item.number,
      service: (item.service || null)
    });
  }

  playPlaylist(index) {
    this.$log.debug('PlayQueueService playPlaylist', index);
    this.socketService.emit('playPlaylist', {name: index.title});
  }

  //add to queue for song
  add(item) {
    this.$log.debug('PlayQueueService addToQueue', item);
    this.socketService.emit('addToQueue', {
      uri: item.uri,
      title: item.title,
      albumart: (item.albumart || null),
      service: (item.service || null)
    });
  }

  //add to queue method for playlist
  enqueue(index) {
    this.$log.debug('PlayQueueService enqueue', index);
    this.socketService.emit('enqueue', {name: index.title});
  }

  addPlayCue(item) {
    this.$log.debug('addPlayCue', item);
    this.socketService.emit('addPlayCue', {
      uri: item.uri,
      number: item.number,
      service: (item.service || null)
    });
  }

  remove(index) {
    this.$log.debug('removeFromQueue', index);
    this.socketService.emit('removeFromQueue', {value: index});
  }

  clearQueue() {
    this.$log.debug('clearQueue');
    this.socketService.emit('clearQueue');
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
      this.$log.debug('pushQueue', data);
      this._queue = data;
      this.$rootScope.$broadcast('playQueueService:pushQueue');
    });
  }

  initService() {
    this.socketService.emit('getQueue');
  }
}

export default PlayQueueService;
