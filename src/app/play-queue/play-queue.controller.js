class PlayQueueController {
  constructor($scope, playQueueService, socketService, matchmediaService) {
    'ngInject';
    this.playQueueService = playQueueService;
    this.matchmediaService = matchmediaService;
    this.socketService = socketService;

    this.renderPlayQueueTable();
    $scope.$on('playQueueService:pushQueue', () => {
      this.renderPlayQueueTable();
    });
  }

  renderPlayQueueTable() {
    if (!this.playQueueService.queue || this.playQueueService.queue.length === 0) {
      return false;
    }
    console.log(this.playQueueService.queue);
    this.table = '';
    let angularThis = `angular.element('#playQueueTable').scope().playQueue`;
    console.log(angularThis);
    for (var i = 0, ll = this.playQueueService.queue.length ; i < ll; i++) {
      let item = this.playQueueService.queue[i];
      this.table += `
      <tr>
        <td
            class="image"
            onclick="${angularThis}.playQueueService.play(${i})">
          <img
              class="${(!item.icon) ? '' : 'hidden'}"
              ${(!item.icon) ? 'src="' + this.socketService.host + item.albumart + '"' : ''}
              alt="${item.title}"/>
          <i class="${item.icon} ${(item.icon) ? '' : 'hidden'}"></i>
        </td>
        <td onclick="${angularThis}.playQueueService.play(${i})">
          <div class="title">
            ${item.name}
          </div>
          <div class="artist-album ${(item.artist || item.album) ? '' : 'hidden'}">
            ${item.artist} - ${item.album}
          </div>
        </td>
        <td class="commandButtons">
          <button
              class="btn-link"
              onclick="${angularThis}.playQueueService.remove(${i})">
            <i class="fa fa-times-circle"></i>
          </button>
        </td>
      </tr>
      `;
    }
    let tbody = document.createElement('tbody');
    window.requestAnimationFrame(() => {
      angular.element(tbody).append(this.table);
      console.log(angular.element('#playQueueTable'));
      angular.element('#playQueueTable tbody').replaceWith(tbody);
    });
  }
}

export default PlayQueueController;
