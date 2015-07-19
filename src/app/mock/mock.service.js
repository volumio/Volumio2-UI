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
      getBrowseFilters : [
        {name:'Artist', uri: 'artist'},
        {name:'Album', uri: 'album'},
        {name:'Genere', uri: 'genere'}
      ],
      getBrowseSources: [
        {name:'USB', uri: 'usb'},
        {name:'NAS', uri: 'nas'},
        {name:'Web Radio', uri: 'web-radio'},
        {name:'Spotify', uri: 'spotify'}
      ],
      getBrowseList: {
        navigation: {
          prev: {
            uri: ''
          },
          next: {
            uri: ''
          },
          pagination: {
            currentPage: 1,
            totItems: 20,
            itemsPerPage: 10,
            totPages: 2,
          },
          list: [
            {track: 'track a', artist: 'artist a', uri: 'uri'},
            {track: 'track b', artist: 'artist b', uri: 'uri'},
            {track: 'track c', artist: 'artist c', uri: 'uri'}
          ]
        }
      }
    }
  }
}

export default MockService;
