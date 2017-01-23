class HeaderController {
  constructor(themeManager, matchmediaService, playerService) {
    'ngInject';
    this.themeManager = themeManager;
    this.matchmediaService = matchmediaService;
    this.playerService = playerService;
  }
}

export default HeaderController;
