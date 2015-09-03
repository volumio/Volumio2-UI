class BrowseService {
  constructor ($rootScope, $log, socketService, mockService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;

    this._listBy = 'track';

    //this._filters = mockService.get('getBrowseFilters');
    //this._sources = mockService.get('getBrowseSources');

    //this._list = mockService.get('getBrowseList');

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  fetchLibrary(item) {
    let obj = {uri: item.uri};
    //console.log('CALL', obj);
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
      console.log('pushBrowseFilters', data);
    	this.filters = data;
    });
    this.socketService.on('pushBrowseSources', (data) => {
      console.log('pushBrowseSources', data);
    	this.sources = data;
    });
    this.socketService.on('pushBrowseLibrary', (data) => {
      console.log('pushBrowseLibrary', data);
      this.list = data.navigation.list;
      this.breadcrumbs = data.navigation.prev;
    });
  }

  initService() {
    this.socketService.emit('getBrowseFilters');
    this.socketService.emit('getBrowseSources');
    //this.socketService.emit('browseLibrary', {});
  }

}

export default BrowseService;
