export default class FavouriteTrackBtnDirective {
  constructor(themeManager) {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('favourite-track-btn', 'components/favourite-track-btn'),
      scope: {},
      controller: FavouriteBtnController,
      controllerAs: 'favouriteTrackBtn',
      bindToController: true
    };
    return directive;
  }
}

class FavouriteBtnController {
  constructor($log, playerService, playlistService) {
    this.playerService = playerService;
    this.playlistService = playlistService;
    this.$log = $log;
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
}
