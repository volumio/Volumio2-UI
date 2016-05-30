class PlayQueueController {
  constructor($scope, $log, playQueueService, socketService, matchmediaService, playerService, $document) {
    'ngInject';
    this.playQueueService = playQueueService;
    this.matchmediaService = matchmediaService;
    this.socketService = socketService;
    this.playerService = playerService;
    this.$document = $document;
    this.$log = $log;
    this.$scope = $scope;

    this.init();

    this.renderPlayQueueTable();
    $scope.$on('playQueueService:pushQueue', () => {
      this.renderPlayQueueTable();
    });
  }

  renderPlayQueueTable() {
    if (!this.playQueueService.queue || this.playQueueService.queue.length === 0) {
      angular.element('#playQueueList ul').replaceWith(document.createElement('ul'));
      return false;
    }
    this.list = '';

    let angularThis = `angular.element('#playQueueList').scope().playQueue`;
    for (var i = 0, ll = this.playQueueService.queue.length ; i < ll; i++) {
      let item = this.playQueueService.queue[i];
      this.list += `
      <li id="itemQueue-${i}">
        <div class="image"
            onclick="${angularThis}.playQueueService.play(${i})">
          <span class="rollover"></span>
          <img
              class="${(!item.icon) ? '' : 'hidden'}"
              ${(!item.icon) ? 'src="' + this.socketService.host + item.albumart + '"' : ''}
              alt="${item.title}"/>
          <i class="${item.icon} ${(item.icon) ? '' : 'hidden'}"></i>
        </div>
        <div class="titleArtist" onclick="${angularThis}.playQueueService.play(${i})">
          <div class="title">
            ${item.name}
          </div>
          <div class="artist-album ${(item.artist || item.album) ? '' : 'hidden'}">
            ${item.artist} - ${item.album}
          </div>
        </div>
        <div class="commandButtons">
          <button
              class="btn-link"
              onclick="${angularThis}.playQueueService.remove(${i})">
            <i class="fa fa-times-circle"></i>
          </button>
        </div>
      </li>
      `;
    }
    let ul = document.createElement('ul');
    angular.element(ul).append(this.list);
    window.requestAnimationFrame(() => {
      angular.element('#playQueueList ul').replaceWith(ul);
      let ulHandler = document.querySelector('#playQueueList ul');
      this.hilightCurrentTrack();
      if (ulHandler) {
        let sortable = Sortable.create(ulHandler, {
          onEnd: (evt) => {
            let emitPayload = {
              from: evt.oldIndex,
              to: evt.newIndex
            };
            this.socketService.emit('moveQueue', emitPayload);
          },
          animation: 250,
          delay: 150
        });
      }
    });
  }

  hilightCurrentTrack() {
    if (!this.playerService.state) {
      return false;
    }
    let position = this.playerService.state.position;
    let oldPlayingTrack = this.$document[0].querySelector('.isPlaying');
    if (oldPlayingTrack) {
      oldPlayingTrack.classList.remove('isPlaying');
    }
    let currentPlayingSong = this.$document[0].getElementById(`itemQueue-${position}`);
    if (currentPlayingSong && this.playerService.state.status === 'play') {
      currentPlayingSong.classList.add('isPlaying');
    }
  }

  init() {
    this.registerListner();
  }

  registerListner() {
    let socketEventHandler = this.$scope.$on('socket:pushState', () => {
      this.hilightCurrentTrack();
    });
    this.$scope.$on('$destroy', () => {
      socketEventHandler();
    });
  }
}

export default PlayQueueController;
