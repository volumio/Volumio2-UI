class HeaderController {
  constructor(themeManager, matchmediaService, playerService, uiSettingsService) {
    'ngInject';
    this.themeManager = themeManager;
    this.matchmediaService = matchmediaService;
    this.playerService = playerService;
    this.uiSettingsService = uiSettingsService;
  }
}

export default HeaderController;
