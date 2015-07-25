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
      getSettings: {
        page: {
          "label": "Settings"
        },
        sections: [
          {
            "section_player_name": {
              "element": "section",
              "label": "Player name",
              "plugin": "settings/playback_conf",
              "onSave": "savePlayerName",
              "savebutton": {
                "label": "salva",
                "values": [
                  "playerName"
                ]
              },
              "content": [
                {
                  "playerName": {
                    "element": "textBox",
                    "label": "Player Name",
                    "value": "volumio"
                  }
                }
              ]
            }
          },
          {
            "section_services_management": {
              "element": "section",
              "label": "Services management",
              "text": "Enable or disable certain Volumio functionalities",
              "plugin": "/settings/playback_conf",
              "onSave": "saveServicesManagement",
              "savebutton": {
                "label": "salva",
                "values": [
                  "airplay",
                  "upnp",
                  "upnp_dlna_indexing",
                  "dlna_library"
                ]
              },
              "content": [
                {
                  "airplay": {
                    "element": "switch",
                    "label": "Airplay",
                    "value": "true"
                  }
                },
                {
                  "upnp": {
                    "element": "switch",
                    "label": "UPNP Control",
                    "value": "true"
                  }
                },
                {
                  "upnp_dlna_indexing": {
                    "element": "switch",
                    "label": "UPNP/DLNA Indexing",
                    "value": "true"
                  }
                },
                {
                  "dlna_library": {
                    "element": "switch",
                    "label": "DLNA Library Server",
                    "value": "true"
                  }
                }
              ]
            }
          },
          {
            "section_streaming_services": {
              "element": "section",
              "label": "Streaming services",
              "plugin": "/settings/playback_conf",
              "onSave": "saveStreamingServices",
              "savebutton": {
                "label": "salva",
                "values": [
                  "spotify_service",
                  "spotify_username",
                  "spotify_password",
                  "prefer_high_quality"
                ]
              },
              "text": "Enable or disable Spotify Streaming services",
              "content": [
                {
                  "spotify_service": {
                    "element": "switch",
                    "label": "Spotify Service",
                    "value": "true"
                  }
                },
                {
                  "spotify_username": {
                    "element": "input",
                    "attributes": [
                      {
                        "placeholder": ""
                      },
                      {
                        "maxLen": "5"
                      }
                    ],
                    "label": "Username",
                    "value": "",
                    "visibleif": "spotify_service:true"
                  }
                },
                {
                  "spotify_password": {
                    "element": "password",
                    "label": "Password",
                    "value": "dusdhsudhsu",
                    "visibleif": "spotify_service:true"
                  }
                },
                {
                  "prefer_high_quality": {
                    "element": "switch",
                    "label": "Prefer high quality music",
                    "value": "true",
                    "visibleif": "spotify_service:true"
                  }
                }
              ]
            }
          },
          {
            "section_sound_quality": {
              "type": "section",
              "label": "Sound quality tweaks",
              "plugin": "/settings/playback_conf",
              "onSave": "saveSoundQuality",
              "savebutton": {
                "label": "salva",
                "values": [
                  "kernel_profile"
                ]
              },
              "text": "These profiles??.",
              "content": [
                {
                  "kernel_profile": {
                    "element": "select",
                    "label": "Kernel profile",
                    "value": "1",
                    "options": [
                      {
                        "1": "Default"
                      },
                      {
                        "2": "Less Jitter"
                      },
                      {
                        "3": "Jitter"
                      },
                      {
                        "4": "Focus"
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "section_updates": {
              "type": "section",
              "label": "System updates",
              "content": [
                {
                  "update": {
                    "element": "button",
                    "label": "System updates",
                    "text": "You can check?...",
                    "plugin": "/settings/playback_conf",
                    "onClick": "systemUpdate"
                  }
                }
              ]
            }
          }
        ]
      }
    };
  }
}

export default MockService;
