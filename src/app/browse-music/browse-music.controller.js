class BrowseMusicController {
  constructor($scope, browseService, playQueueService, playlistService, socketService,
    modalService, $timeout, matchmediaService, $compile, $document, $rootScope, $log, playerService,
    uiSettingsService, $state, themeManager, $stateParams) {
    'ngInject';
    this.$log = $log;
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.playlistService = playlistService;
    this.socketService = socketService;
    this.modalService = modalService;
    this.playerService = playerService;
    this.$timeout = $timeout;
    this.matchmediaService = matchmediaService;
    this.$compile = $compile;
    this.$document = $document;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.uiSettingsService = uiSettingsService;
    this.themeManager = themeManager;
    this.$stateParams = $stateParams;
    this.isDedicatedSearchView = false;
    this.historyUri = [];

    if (this.browseService.isBrowsing || this.browseService.isSearching) {
      // this.renderBrowseTable();
    }
    $scope.$on('browseService:fetchEnd', () => {
      // this.renderBrowseTable();
    });

    this.initController();
  }

  initController() {
    console.log(this.browseService);
    /* I receive it also when I search */
    this.socketService.on('pushBrowseLibrary', (data) => {
      console.log(data);
      console.log(this.browseService);
    });

    
    /* let bindedBackListener = this.backListener.bind(this);
    this.$document[0].addEventListener('keydown', bindedBackListener, false);
    this.$scope.$on('$destroy', () => {
      this.$document[0].removeEventListener('keydown', bindedBackListener, false);
    });

    this.$scope.$watch( () => this.$stateParams.isDedicatedSearch , (isDedicatedSearch) => {
      if (isDedicatedSearch) {
        this.setDedicatedSearch();
      } else {
        this.unsetDedicatedSearch();
      }
    }, true); */
  }



  fetchLibrary(item, back = false) {
    this.$log.debug(item);
    if (item.uri !== 'cd') {
      this.browseService.fetchLibrary(item, back);
    }
  }

  handleItemClick(item) {
    console.log(item);
  }

}

export default BrowseMusicController;