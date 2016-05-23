class BrowseService {
  constructor($rootScope, $log, socketService, mockService, $interval, $window) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;
    this.$interval = $interval;
    this.$window = $window;
    this.isBrowsing = false;
    this.$rootScope = $rootScope;
    this.$log = $log;

    this.isPhone = false;
    this.filterBy = 'all';
    //this._filters = mockService.get('getBrowseFilters');
    // this._sources = mockService.get('getBrowseSources');
    // this.$log.debug(this._sources);
    //this._list = mockService.get('getBrowseList');
    this.limiter = 10;
    this.scrollPositions = new Map();

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  fetchLibrary(item, back) {
    let obj = {uri: item.uri};
    this.$log.debug('fetchLibrary', item);
    this.currentFetchRequest = item;
    this.socketService.emit('browseLibrary', obj);
    this.isBrowsing = true;
    if (!back) {
      this.scrollPositions.delete(item.uri);
    }
  }

  backHome() {
    this.isBrowsing = false;
    this.list = [];
    this.scrollPositions.clear();
  }

  get filters() {
    return this._filters;
  }

  set filters(filters) {
    this._filters = filters;
  }

  get sources() {
    return this._sources;
  }

  set sources(sources) {
    this._sources = sources;
  }

  get list() {
    return this._list;
  }

  set list(list) {
    this._list = list;
  }

  get isBrowsing() {
    return this._isBrowsing;
  }

  set isBrowsing(val) {
    this._isBrowsing = val;
  }

  get breadcrumbs() {
    return this._breadcrumbs;
  }

  set breadcrumbs(breadcrumbs) {
    this._breadcrumbs = breadcrumbs;
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushBrowseFilters', (data) => {
      this.$log.debug('pushBrowseFilters', data);
      this.filters = data;
    });
    this.socketService.on('pushBrowseSources', (data) => {
      this.$log.debug('pushBrowseSources', data);
      this.sources = data;
    });
    this.socketService.on('pushBrowseLibrary', (data) => {
      this.list = data.navigation.list;

      this.listLength = this.list.length;
      this.$log.debug('pushBrowseLibrary', this.listLength, this.list);

      this.breadcrumbs = data.navigation.prev;
      this.$rootScope.$broadcast('browseService:fetchEnd');
    });
  }

  initService() {
    this.socketService.emit('getBrowseFilters');
    this.socketService.emit('getBrowseSources');
    this._isBrowsing = false;
    this._listBy = 'track';
    //this.socketService.emit('browseLibrary', {});
  }

}

export default BrowseService;
