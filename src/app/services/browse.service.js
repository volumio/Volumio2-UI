class BrowseService {
  constructor($rootScope, $log, socketService, mockService, $interval, $window) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;
    this.$interval = $interval;
    this.$window = $window;
    //this._filters = mockService.get('getBrowseFilters');
    //this._sources = mockService.get('getBrowseSources');
    //this._list = mockService.get('getBrowseList');
    this.limiter = 10;
    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  fetchLibrary(item) {
    let obj = {uri: item.uri};
    // console.log('fetchLibrary', item);
    this.currentFetchRequest = item;
    this.startPerf = performance.now();
    this.socketService.emit('browseLibrary', obj);
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

  //TODO remove requestAnimationFrame func
  // incLimiter() {
  //   if (this.limiter < this.listLength) {
  //     this.limiter += 8;
  //     this.$window.requestAnimationFrame(this.incLimiter.bind(this));
  //   }
  // }

  registerListner() {
    this.socketService.on('pushBrowseFilters', (data) => {
      console.log('pushBrowseFilters', data);
    	this.filters = data;
    });
    this.socketService.on('pushBrowseSources', (data) => {
      console.log('pushBrowseSources', data);
    	this.sources = data;
    });
    this.socketService.on('pushBrowseLibrary', (data) => {
      this.endPerf = performance.now();
      console.log('pushBrowseLibrary', data, 'BE wait time: ', this.endPerf - this.startPerf);
      this.list = data.navigation.list;
      this.listLength = this.list.length;
      this.breadcrumbs = data.navigation.prev;
      //TODO remove requestAnimationFrame
      // this.$window.requestAnimationFrame(this.incLimiter.bind(this));
      this.limiter = 10;
      if (this.limiterHandler) {
        this.$interval.cancel(this.limiterHandler);
      }
      this.limiterHandler = this.$interval(() => {
        if (this.limiter < this.listLength) {
          this.limiter += 2;
        } else {
          this.$interval.cancel(this.limiterHandler);
        }
      }, 30);
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
