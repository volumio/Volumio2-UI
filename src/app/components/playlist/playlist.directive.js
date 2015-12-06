class PlaylistDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('playlist', 'components/playlist'),
      scope: false,
      controller: PlaylistController,
      controllerAs: 'playlist',
      bindToController: true
    };
    return directive;
  }
}

class PlaylistController {
  constructor($rootScope, $http, $log, playerService, socketService, mockService) {
    this.socketService = socketService;
    this.playerService = playerService;
    console.log(this.playerService);
    'ngInject';
    let endpoint = 'http://sublinode.gestiolink.ch/client/constellation1';
    if ($rootScope.initConfig && $rootScope.initConfig.restendpoint) {
      endpoint = $rootScope.initConfig.restendpoint;
    }
    $http.get(endpoint)
      .then((response) => {
        this.playlistData = response.data;
        //this.playlistData.playlist = this.playlistData.playlist.concat(mockService.get('playlist'));
        playerService.deviceID = response.data.name;
      }, (err) => {
        $log.log('Endpoint error', err);
      });
  }

  playPlaylist(playlist) {
    console.log('playPlaylist', playlist.prettyname);
    this.socketService.emit('playPlaylist', {name: playlist.prettyname});
  }
}

export default PlaylistDirective;
