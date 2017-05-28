class PlayerButtonsDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('player-buttons', 'components/player-buttons'),
      scope: false,
      controller: PlayerButtonsController,
      controllerAs: 'playerButtons',
      bindToController: true
    };
    return directive;
  }
}

class PlayerButtonsController {
  constructor(playerService, playQueueService, hotkeys, $scope) {
    'ngInject';
    this.playerService = playerService;
    this.hotkeys = hotkeys;
    this.playQueueService = playQueueService;
    this.$scope = $scope;
    this._addHotkeys();
  }

  _addHotkeys() {
    this.hotkeys.bindTo(this.$scope)
      .add({
        combo: 'space',
        description: 'Play/pause',
        callback: () => {
          const {status, service} = this.playerService.state;

          if (status === 'play' && service === 'webradio') {
            this.playerService.stop();
          } else if (status === 'play') {
            this.playerService.pause();
          } else {
            this.playerService.play();
          }
        }
      })
      .add({
        combo: 'x',
        description: 'Stop',
        callback: () => {
          this.playerService.stop();
        }
      })
      .add({
        combo: 'right',
        description: 'Next track',
        callback: () => this.playerService.next()
      })
      .add({
        combo: 'left',
        description: 'Previous track',
        callback: () => this.playerService.prev()
      })
      .add({
        combo: 'up',
        description: 'Volume up',
        callback: () => this.playerService.volumeUp()
      })
      .add({
        combo: 'down',
        description: 'Volume down',
        callback: () => this.playerService.volumeDown()
      })
      .add({
        combo: '1',
        description: 'Playlist item 1',
        callback: () => this.playQueueService.play(0)
      })
      .add({
        combo: '2',
        description: 'Playlist item 2',
        callback: () => this.playQueueService.play(1)
      })
      .add({
        combo: '3',
        description: 'Playlist item 3',
        callback: () => this.playQueueService.play(2)
      })
      .add({
        combo: '4',
        description: 'Playlist item 4',
        callback: () => this.playQueueService.play(3)
      })
      .add({
        combo: '5',
        description: 'Playlist item 5',
        callback: () => this.playQueueService.play(4)
      })
      .add({
        combo: '6',
        description: 'Playlist item 6',
        callback: () => this.playQueueService.play(5)
      })
      .add({
        combo: '7',
        description: 'Playlist item 7',
        callback: () => this.playQueueService.play(6)
      })
      .add({
        combo: '8',
        description: 'Playlist item 8',
        callback: () => this.playQueueService.play(7)
      })
      .add({
        combo: '9',
        description: 'Playlist item 9',
        callback: () => this.playQueueService.play(8)
      });
  }
}

export default PlayerButtonsDirective;
