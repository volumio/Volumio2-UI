class PlayQueueController {
  constructor($scope, $log, playQueueService, socketService, matchmediaService) {
    'ngInject';
    this.playQueueService = playQueueService;
    this.matchmediaService = matchmediaService;
    this.socketService = socketService;
    this.$log = $log;

    this.renderPlayQueueTable();
    $scope.$on('playQueueService:pushQueue', () => {
      this.renderPlayQueueTable();
    });
  }

  renderPlayQueueTable() {
    if (!this.playQueueService.queue || this.playQueueService.queue.length === 0) {
      return false;
    }
    this.list = '';
    let angularThis = `angular.element('#playQueueList').scope().playQueue`;
    for (var i = 0, ll = this.playQueueService.queue.length ; i < ll; i++) {
      let item = this.playQueueService.queue[i];
      this.list += `
      <li>
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
    window.requestAnimationFrame(() => {
      angular.element(ul).append(this.list);
      angular.element('#playQueueList ul').replaceWith(ul);
      this.$log.debug('playQueueList ul', angular.element('#playQueueList ul')[0]);
      let ulHandler = document.querySelector('#playQueueList ul');
      setTimeout(function () {
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
      }, 300);
    });
  }
}

export default PlayQueueController;
