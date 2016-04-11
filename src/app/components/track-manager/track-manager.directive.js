class TrackManagerDirective {
  constructor(themeManager, $log) {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('track-manager', 'components/track-manager'),
      scope: {
        type: '@'
      },
      link: linkFunc,
      controller: TrackManagerController,
      controllerAs: 'trackManager',
      bindToController: true
    };
    return directive;

    function linkFunc(scope, el, attr, trackManagerController) {
      let
        mouseupListener = () => {
          $log.debug('up', trackManagerController.playerService.seekPercent);
          trackManagerController.playerService.seek = trackManagerController.playerService.seekPercent;
        },
        mousedownListener = () => {
          $log.debug('down');
          trackManagerController.playerService.stopSeek();
        },
        trackManagerHandler;
      if (trackManagerController.type === 'slider') {
        setTimeout(() => {
          trackManagerHandler = el.find('.slider-handle')[0];
          if (trackManagerHandler) {
            trackManagerHandler.addEventListener('mousedown', mousedownListener, true);
            trackManagerHandler.addEventListener('mouseup', mouseupListener, true);
          }
        });
      } else if (trackManagerController.type === 'knob') {}

      scope.$on('$destroy', () => {
        if (trackManagerController.matchMediaHandler) {
          trackManagerController.matchMediaHandler();
          $log.debug('destroyedMatchmedia');
        }
        if (trackManagerHandler && trackManagerController.type === 'slider') {
          trackManagerHandler.removeEventListener('mousedown', mousedownListener, true);
          trackManagerHandler.removeEventListener('mouseup', mouseupListener, true);
        }
      });
    }
  }
}

class TrackManagerController {
  constructor(
      $element,
      playerService,
      playlistService,
      $timeout,
      modalService,
      matchmedia,
      socketService,
      $scope,
      knobFgColor,
      knobBgColor,
      matchmediaService,
      $log) {
    'ngInject';
    this.playerService = playerService;
    this.playlistService = playlistService;
    this.modalService = modalService;
    this.socketService = socketService;
    this.matchmediaService = matchmediaService;
    this.$scope = $scope;
    this.$log = $log;

    this.initWatchers();
    // this.initMatchmedia();

    if (this.type === 'knob') {
      this.knobOptions = {
        min: 0,
        max: 1001,
        fgColor: knobFgColor,
        bgColor: knobBgColor,
        width: 210,
        height: 210,
        displayInput: false,
        step: 1,
        angleOffset: 0,
        angleArc: 360
      };

      this.onChange = (value) => {
        $timeout.cancel(this.timeoutHandler);
        this.timeoutHandler = $timeout(() => {
          this.$log.debug('track manager', value);
          this.playerService.stopSeek();
          this.playerService.seek = value;
        }, 200, false);
      };
    }
  }

  toggleFavouriteTrack() {
    if (this.playerService.favourite.favourite) {
      this.$log.debug('Remove from favourite');
      this.playlistService.removeFromFavourites(this.playerService.state);
    } else {
      this.$log.debug('Add to favourite');
      this.playlistService.addToFavourites(this.playerService.state);
    }
  }

  addToPlaylist() {
    if (this.playerService.state.trackType !== 'webradio') {
      let
      templateUrl = 'app/browse/components/modal/modal-playlist.html',
      controller = 'ModalPlaylistController',
      params = {
        title: 'Add to playlist',
        item: this.playerService.state
      };
      this.modalService.openModal(
        controller,
        templateUrl,
        params,
        'sm');
    }
  }

  initWatchers() {
    this.$scope.$watch(() => {
      return this.playerService.state && this.playerService.state.albumart;
    }, (newVal) => {
      if (this.matchmediaService.isPhone) {
        let albumArtUrl = `url('${this.socketService.host}${newVal}')`;
        this.backgroundAlbumArtStyle = {
          'background-image': albumArtUrl
        };
      } else {
        this.backgroundAlbumArtStyle = {};
      }
    });

    this.$scope.$watch(() => this.matchmediaService.isPhone, (newVal) => {
      if (this.matchmediaService.isPhone) {
        let albumart = this.playerService.state && this.playerService.state.albumart;
        if (albumart) {
          let albumArtUrl = `url('${this.socketService.host}${albumart}')`;
          this.backgroundAlbumArtStyle = {
            'background-image': albumArtUrl
          };
        }
      } else {
        this.backgroundAlbumArtStyle = {};
      }
    });
  }

  // initMatchmedia() {
  //   this.matchMediaHandler = this.matchmedia.onPhone((mediaQueryList) => {
  //     if (mediaQueryList.matches) {
  //       let albumart = this.playerService.state && this.playerService.state.albumart;
  //       if (albumart) {
  //         let albumArtUrl = `url('${this.socketService.host}${albumart}')`;
  //         this.backgroundAlbumArtStyle = {
  //           'background-image': albumArtUrl
  //         };
  //       }
  //     } else {
  //       this.backgroundAlbumArtStyle = {};
  //     }
  //   });
  // }
}


export default TrackManagerDirective;
