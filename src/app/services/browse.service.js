class BrowseService {
  constructor ($rootScope, $log, socketService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;

    this._listBy = 'track';

    this._filters = [
      {name:'Artist', uri: 'artist'},
      {name:'Album', uri: 'album'},
      {name:'Genere', uri: 'genere'},
      {name:'XXX', uri: 'yyy'}
    ];

    this._sources = [
      {name:'USB', uri: 'usb'},
      {name:'NAS', uri: 'nas'},
      {name:'Web Radio', uri: 'web-radio'},
      {name:'Spotify', uri: 'spotify'}
    ];

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  add() {
    // TODO add and update the queue
  }

  save(trackIndex) {
    //this.socketService.emit('updatePlaybackSettings', settingsObj);
  }

  clearAll() {
  }

  isFirst() {

  }

  isLast() {

  }

  get filters() {
    return this._filters;
  }

  get sources() {
    return this._sources;
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('volumioPushBrowseData', (browseData) => {
    	console.log(browseData);
    });
  }

  initService() {
    this.socketService.emit('volumioBrowseLibrary',
      {'uid': 'index:root', 'sortby': '', 'datapath': [], 'entries': 0, 'index': 0});
  }

}

export default BrowseService;
