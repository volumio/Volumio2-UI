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
          type: 'static',
          state: 'volumio.plugin',
          params: {
            pluginName: 'settings'
          }
        }
      ],
      //Settings
      getSettings: {
        page: {
          "label": "Settings"
        },
        sections: [
          {
            "id": "section_player_name",
            "element": "section",
            "label": "Player name",
            "plugin": "settings/playback_conf",
            "onSave": "savePlayerName",
            "saveButton": {
              "label": "salva",
              "values": [
                "playerName"
              ]
            },
            "content": [
              {
                "id": "playerName",
                "element": "input",
                "type": "text",
                "label": "Player Name",
                "attributes":[
                  { "placeholder": "call me with a fancy name"}
                ],
                "value": "Volumio"
              }
            ]
          },
          {
            "id": "section_services_management",
            "element": "section",
            "label": "Services management",
            "description": "Enable or disable certain Volumio functionalities",
            "plugin": "/settings/playback_conf",
            "onSave": "saveServicesManagement",
            "saveButton": {
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
                "id": "airplay",
                "element": "switch",
                "label": "Airplay",
                "description": "Apple airplay",
                "value": "true"
              },
              {
                "id": "upnp",
                "element": "switch",
                "label": "UPNP Control",
                "value": "true"
              },
              {
                "id": "upnp_dlna_indexing",
                "element": "switch",
                "label": "UPNP/DLNA Indexing",
                "value": "true"
              },
              {
                "id": "dlna_library",
                "element": "switch",
                "label": "DLNA Library Server",
                "value": "true"
              }
            ]
          },
          {
            "id": "section_streaming_services",
            "element": "section",
            "label": "Streaming services",
            "description": "Enable or disable Spotify Streaming services",
            "plugin": "/settings/playback_conf",
            "onSave": "saveStreamingServices",
            "saveButton": {
              "label": "salva",
              "values": [
                "spotify_service",
                "spotify_username",
                "spotify_password",
                "prefer_high_quality"
              ]
            },
            "content": [
              {
                "id": "spotify_service",
                "element": "switch",
                "label": "Spotify Service",
                "value": "true"
              },
              {
                "id": "spotify_username",
                "element": "input",
                "attributes": [
                  {
                    "placeholder": "Type your spotify username"
                  },
                  {
                    "maxlength": "5"
                  }
                ],
                "label": "Username",
                "value": "",
                "visibleIf": {"field":"spotify_service", "value": "true"}
              },
              {
                "id": "spotify_password",
                "element": "input",
                "type": "password",
                "label": "Password",
                "value": "dusdhsudhsu",
                "visibleIf": {"field":"spotify_service", "value": "true"}
              },
              {
                "id": "prefer_high_quality",
                "element": "switch",
                "label": "Prefer high quality music",
                "value": "false",
                "visibleIf": {"field":"spotify_service", "value": "true"}
              }
            ]
          },
          {
            "id": "section_sound_quality",
            "type": "section",
            "label": "Sound quality tweaks",
            "description": "These profiles??.",
            "plugin": "/settings/playback_conf",
            "onSave": "saveSoundQuality",
            "saveButton": {
              "label": "salva",
              "values": [
                "kernel_profile"
              ]
            },
            "content": [
              {
                "id": "kernel_profile",
                "element": "select",
                "label": "Kernel profile",
                "value": {"value":"2","label":"Less Jitter"},
                "options": [
                  {
                    "value":"1",
                    "label": "Default"
                  },
                  {
                    "value":"2",
                    "label": "Less Jitter"
                  },
                  {
                    "value":"3",
                    "label": "Jitter"
                  },
                  {
                    "value":"4",
                    "label": "Focus"
                  }
                ]
              }
            ]
          },
          {
            "id": "section_updates",
            "type": "section",
            "label": "System updates",
            "content": [
              {
                "id": "update",
                "element": "button",
                "label": "System updates",
                "description": "You can check?...",
                "plugin": "/settings/playback_conf",
                "onClick": "systemUpdate"
              }
            ]
          }
        ]
      }
    };
  }
}

export default MockService;
