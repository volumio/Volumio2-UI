class MockService {
  constructor () {
    'ngInject';
    this.init();
  }

  get(requestName) {
    if(this._mock[requestName]){
      return this._mock[requestName];
    }
    throw 'No mock data present';
  }

  init() {
    this._mock = {
      //Browse
      getBrowseFilters : [
        {name:'Genres by Name', index: 'index:Genres by Name'},
        {name:'Artists by Name', index: 'index:Artists by Name'},
        {name:'Albums by Name', index: 'index:Albums by Name'},
        {name:'Albums by Artist', index: 'index:Albums by Artist'},
        {name:'Tracks by Name', index: 'index:Tracks by Name'}
      ],
      getBrowseSources: [
        {name:'USB', uri: 'usb'},
        {name:'NAS', uri: 'nas'},
        {name:'Web Radio', uri: 'web-radio'},
        {name:'Spotify', uri: 'spotify'}
      ],
      getBrowseList: {
        pagination: {
          currentPage: 1,
          totItems: 20,
          itemsPerPage: 10,
          totPages: 2
        },
        list: [
          {track: 'track a', artist: 'artist a', uri: 'uri'},
          {track: 'track b', artist: 'artist b', uri: 'uri'},
          {track: 'track c', artist: 'artist c', uri: 'uri'}
        ]
      },
      //Menu
      getMenuItems: [
        {
          id: 'home',
          name: 'Home',
          type: 'static',
          state: 'volumio.playback'
        },
        {
          id: 'components',
          name: 'Components',
          type: 'static',
          state: 'volumio.components'
        },
        {
          id: 'network',
          name: 'Network',
          type: 'dynamic'
        },
        {
          id: 'settings',
          name: 'Settings',
          type: 'dynamic'
        },
      ],
      //Settings
      getSettings: ''
    };
  }
}

export default MockService;
