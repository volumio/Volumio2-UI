class PlayQueueService {
  constructor ($rootScope, $log, socketService) {
    'ngInject';
    this.$log = $log;
    this._queue = null;
    this.socketService = socketService;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  add() {
    // TODO add and update the queue
  }

  remove(trackIndex) {
    this.socketService.emit('volumioRemoveQueueItem', trackIndex);
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
    this.socketService.on('volumioPushQueue', (queue) => {
      //console.log(queue);
      this._queue = queue;
    });
  }

  initService() {
    this.socketService.emit('volumioGetQueue');
  }
}

export default PlayQueueService;
