class BrowseService {
  constructor ($rootScope, $log, socketService, mockService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;

    this._listBy = 'track';

    this._filters = mockService.get('getBrowseFilters');
    this._sources = mockService.get('getBrowseSources');

    this._list = mockService.get('getBrowseList');

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  fetchLibrary(index) {
    console.log(index);
    this.socketService.emit('volumioBrowseLibrary',
      {'uid': index, 'sortby': '', 'datapath': [], 'entries': 0, 'index': 0});
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
    this._source = sources;
  }

  get list() {
    return this._list;
  }

  set list(list) {
    this._list = list;
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushBrowseFilters', (data) => {
    	this._filters = data;
    });
    this.socketService.on('pushBrowseSources', (data) => {
    	this._sources = data;
    });
    this.socketService.on('pushBrowseList', (data) => {
    	this._list = data;
    });
    this.socketService.on('volumioPushBrowseData', (browseData) => {
    	console.log(browseData);
    });
  }

  initService() {
    this.socketService.emit('getBrowseFilters');
    this.socketService.emit('getBrowseSources');
    this.socketService.emit('getBrowseList', {uri:'uri'});

    this.socketService.emit('volumioBrowseLibrary',
      {'uid': 'index:root', 'sortby': '', 'datapath': [], 'entries': 0, 'index': 0});
  }

}

export default BrowseService;
