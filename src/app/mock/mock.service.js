class MockService {
  constructor() {
    'ngInject';
    this.init();
  }

  get(requestName) {
    if (this._mock[requestName]) {
      return this._mock[requestName];
    }
    throw 'No mock data present';
  }

  init() {
    this._mock = {
      //installedPlugins
      installedPlugins: [
        {
          prettyName: 'Nome Plugin 1',
          enabled: true,
          active: true,
          category: "Category 1"
          name: 'name'
        },
        {
          prettyName: 'Nome Plugin 2',
          enabled: true,
          active: true,
          category: "Category 2"
          name: 'name2'
        },
      ],
      //installablePlugins
      installablePlugins: {
        metaData: {
          repoUlr: 'fetching ulr',
          repoStatus: 'Up'
        },
        categories: [
          {
            name: 'Categoria 1',
            id: 'CAT1',
            description: 'Descrizione categoria',
            plugins: [
              {
                name: 'Nome plugin available 1',
                version: 'v1',
                url: 'url to zip',
                license: 'license',
                description: 'plugin 1 desc',
                author: 'plugin 1 author',
                updated: 'plugin 1 date update'
              },
              {
                name: 'Nome plugin available 2',
                version: 'v2',
                url: 'url to zip',
                license: 'license',
                description: 'plugin 2 desc',
                author: 'plugin 2 author',
                updated: 'plugin 2 date update'
              }
            ]
          },
          {
            name: 'Categoria 2',
            id: 'CAT2',
            description: 'Descrizione categoria 2',
            plugins: [
              {
                name: 'Nome plugin available 3',
                version: 'v3',
                url: 'url to zip',
                license: 'license',
                description: 'plugin 3 desc',
                author: 'plugin 3 author',
                updated: 'plugin 3 date update'
              }
            ]
          }
        ]
      },
      //Custom modals
      customModals: {
        'title': 'titolo in alto della modale',
        'message': 'contenuto html <p>paragraph</p>',
        'size': 'lg',
        'buttons': [
          {
            'name': 'Nome bottone',
            'class': 'btn btn-primary',
            'emit': 'emit',
            'payload': 'payload emit'
          },
          {
            'name': 'Nome bottone 2',
            'class': 'btn btn-primary',
            'emit': 'emit 2',
            'payload': 'payload emit 2'
          },
          {
            'name': 'Close',
            'class': 'btn btn-warning'
          }
        ]
      },
      //Ripper
      ripper: {
        content: '<strong>Content</strong> of ripper',
        title: 'Rip Cd',
        artist: 'Noep',
        album: 'Movee',
        tracks: [
          {
            number: 1,
            title: 'titolo traccia 1'
          },
          {
            number: 2,
            title: 'titolo traccia 2'
          }
        ]
      },
      //Playlist component
      playlist: [
        {
          'order': 2,
          'prettyname': 'Bar Day',
          'path': 'bergues-bar-day',
          'intensity': 2,
          'description': 'Une ambiance sphistiquée aux influences jazzy.',
          'styles': 'jazzy, soul, lounge',
          'ambienticons': [
            'fa-building',
            'fa-glass'
          ],
          'createdAt': '2015-11-28T09:44:14.319Z',
          'updatedAt': '2015-11-28T09:44:14.326Z',
          'id': 'playlist-test1'
        },
        {
          'ambienticons': [
            'fa-building',
            'fa-glass'
          ],
          'createdAt': '2015-11-28T09:40:07.313Z',
          'description': 'Im too lazy to go on the web to copy and .....',
          'intensity': 1,
          'order': 1,
          'path': 'bergues-bar-morning',
          'prettyname': 'Bar Morning',
          'styles': 'jazzy, hip, world',
          'updatedAt': '2015-11-28T09:48:54.036Z',
          'id': 'test3'
        }
      ],
      //Network status plugin
      networkInfos: [{
        type: 'wireless',
        ssid: 'Mare Nostrum',
        signal: 5,
        status: 'connected',
        ip: '192.168.1.12',
        speed: '100M',
        online: false
      },
      {
        type: 'cable',
        status: 'connected',
        ip: '192.168.1.120',
        speed: '1000M',
        online: true
      }],
      //Wi fi plugin
      wirelessNetworks: {
        connectedTo: {
          signal: 5,
          encryption: 'wpa2',
          ssid: 'Mare Nostrum'
        },
        available: [
          {
            signal: 5,
            encryption: 'wpa2',
            ssid: 'miarete1'
          },
          {
            signal: 4,
            encryption: 'wpa2',
            ssid: 'AUAUAUA'
          },
          {
            signal: 3,
            encryption: 'wep',
            ssid: 'Speck'
          },
          {
            signal: 2,
            encryption: 'open',
            ssid: 'asd'
          },
          {
            signal: 1,
            encryption: 'open',
            ssid: 'ASD'
          }]
      },
      //Network drives plugin
      infoShare: [
        {
          name: 'SHARE su 192.168.10.35',
          id: 'suasianure 2',
          mounted: 'true',
          size: '40 GB',
          fstype: 'cifs'
        },
        {
          name: 'SHARE su 192.168.10.99',
          id: 'id nuovo',
          mounted: 'false',
          size: '450 GB',
          fstype: 'nfs'
        }
      ],
      listUsbDrives: [
        {
          name: 'Transcend 2',
          size: '2gb',
          freespace: '3gb'
        },
        {
          name: 'Sandisk',
          size: '2gb',
          freespace: '3gb'
        }
      ],
      //My muisc plugin
      myCollectionStats: {
        artists: '120', albums: '23', songs: '67', playtime: '10h'
      },
      //Browse
      getBrowseFilters: [
        {name: 'Genres by Name', index: 'index:Genres by Name'},
        {name: 'Artists by Name', index: 'index:Artists by Name'},
        {name: 'Albums by Name', index: 'index:Albums by Name'},
        {name: 'Albums by Artist', index: 'index:Albums by Artist'},
        {name: 'Tracks by Name', index: 'index:Tracks by Name'}
      ],
      getBrowseSources: [
        {name: 'USB', uri: 'usb'},
        {name: 'NAS', uri: 'nas'},
        {name: 'Web Radio', uri: 'web-radio'},
        {name: 'Spotify', uri: 'spotify'},
        {
          name: 'CD Player',
          pluginName: 'cd_controller',
          pluginType: 'music_service',
          uri: 'cd',
          info: 'Pink Floyd - Wish you were Here',
          menuItems: [
            {
              name: 'play',
              icon: 'fa fa-folder-open-o',
              socketCall: {
                emit: 'callMethod',
                payload: {
                  endpoint: 'music_service/cd_controller',
                  method: 'playCD',
                  data: ''
                }
              }
            },
            {
              name: 'rip',
              icon: 'fa fa-folder-open-o',
              socketCall: {
                emit: 'callMethod',
                payload: {
                  endpoint: 'music_service/cd_controller',
                  method: 'ripCD',
                  data: ''
                }
              }
            },
            {
              name: 'eject',
              icon: 'fa fa-folder-open-o',
              socketCall: {
                emit: 'callMethod',
                payload: {
                  endpoint: 'music_service/cd_controller',
                  method: 'ejectCD',
                  data: ''
                }
              }
            }
          ]}
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
      getMultiRoomDevices: {
        misc: {debug: true},
        list: [
          {
            id: 'device_1',
            host: 'http://192.168.0.120:3000',
            model: 'model Small',
            signal: 'low',
            name: 'Bedroom',
            state: {
              status: 'play',
              volume: 80,
              mute: false,
              artist: 'Franz ferdinand',
              track: 'No you Girls'
            },
            child: [
              {
                id: 'device_3',
                host: 'http://192.168.0.18:3000',
                model: 'xx',
                signal: 'low',
                name: 'Bedroom left'
              },
              {
                id: 'device_4',
                host: 'http://192.168.0.18:3000',
                model: 'yy',
                signal: 'low',
                name: 'Bedroom right'
              },
              {
                id: 'device_5',
                host: 'http://192.168.0.18:3000',
                model: 'zz',
                signal: 'low',
                name: 'Bedroom center'
              }
            ]
          },
          {
            id: 'device_2',
            host: 'http://192.168.0.10:3000',
            model: 'model Xlarge',
            signal: 'high',
            name: 'Living room',
            state: {
              status: 'play',
              volume: 80,
              mute: false,
              artist: 'Korn',
              track: 'Adidas'
            }
          },
          {
            id: 'device_6',
            host: 'http://192.168.0.18:3000',
            model: 'model Xlarge',
            signal: 'high',
            name: 'Garden',
            state: {
              status: 'play',
              volume: 80,
              mute: false,
              artist: 'Banks',
              track: 'Warm water'
            }
          }
        ]
      },
      //Sidemenu
      getMenuItems: [
        {
          id: 'home',
          name: 'Home',
          state: 'volumio.playback'
        },
        {
          id: 'components',
          name: 'Components',
          state: 'volumio.components'
        },
        {
          id: 'network',
          name: 'Network',
          state: 'volumio.plugin',
          params: {
            pluginName: 'network'
          }
        },
        {
          id: 'multi-room',
          name: 'Multi Room',
          state: 'volumio.multi-room'
        },
        {
          id: 'modal',
          name: 'Power off',
          params: {
            modalName: 'modal-power-off'
          }
        },
        {
          id: 'static-page',
          name: 'Credits',
          pageName: 'test-static-page'
        }
      ],
      multiRoomDevices: [
        {
          name: 'AxiomAir4',
          ip: 'http://192.168.1.159:3000',
          isSelf: true,
          state: {
            volume: 0,
            track: 'aa',
            artist: 'bb',
            albumart: ''
          }
        },
        {
          name: 'AxiomAir6',
          ip: 'http://192.168.1.129:3000',
          state: {
            volume: 0,
            track: 'aa',
            artist: 'bb',
            albumart: ''
          }
        },
        {
          name: 'AxiomAir6',
          ip: 'http://192.168.1.129:3000',
          state: {
            volume: 0,
            track: 'aa',
            artist: 'bb',
            albumart: ''
          }
        },
        {
          type: 'GROUP',
          name: 'Kitchen',
          server: {
            name: 'AxiomAir',
            ip: 'http://192.168.1.111:3000',
            state: {
              volume: 50,
              track: 'Group track',
              artist: 'art',
              albumart: ''
            }
          },
          clients: [
            {
              name: 'Child 1',
              ip: 'http://192.168.1.110:3000',
              state: {
                volume: 0,
                track: '',
                artist: '',
                albumart: ''
              }
            },
            {
              name: 'Child 2',
              ip: 'http://192.168.1.116:3000',
              state: {
                volume: 0,
                track: 'aa',
                artist: 'bb',
                albumart: ''
              }
            }
          ]
        }
      ],
      //Settings
      getSettings: {
        page: {
          'label': 'Settings',
          'description': 'If you mess up with this configuration, you can reset to default.'
        },
        sections: [
          {
            'id': 'section_player_name',
            'element': 'section',
            'label': 'Player name',
            'plugin': 'settings/playback_conf',
            'onSave': {
              'type': 'plugin',
              'endpoint': 'music_services/spop',
              'method': 'saveSpopConf',
              'askForConfirm': {'title': 'Confirm', 'message': 'Do you want to save this values?'}
            },
            'saveButton': {
              'label': 'salva',
              'data': [
                'playerName'
              ]
            },
            'content': [
              {
                'id': 'playerName',
                'element': 'input',
                'type': 'text',
                'label': 'Player Name',
                'attributes': [
                  {'placeholder': 'call me with a fancy name'}
                ],
                'value': 'Volumio'
              }
            ]
          },
          {
            'id': 'section_services_management',
            'element': 'section',
            'label': 'Services management',
            'description': 'Enable or disable certain Volumio functionalities',
            'onSave': {
              'type': 'plugin',
              'endpoint': 'music_services/spop',
              'method': 'saveSpopConf'
            },
            'saveButton': {
              'label': 'salva',
              'data': [
                'airplay',
                'upnp',
                'upnp_dlna_indexing',
                'dlna_library'
              ]
            },
            'content': [
              {
                'id': 'airplay',
                'element': 'switch',
                'label': 'Airplay',
                'description': 'Apple airplay',
                'value': true
              },
              {
                'id': 'upnp',
                'element': 'switch',
                'label': 'UPNP Control',
                'value': true
              },
              {
                'id': 'upnp_dlna_indexing',
                'element': 'switch',
                'label': 'UPNP/DLNA Indexing',
                'value': true
              },
              {
                'id': 'dlna_library',
                'element': 'switch',
                'label': 'DLNA Library Server',
                'value': true
              }
            ]
          },
          {
            'id': 'section_streaming_services',
            'element': 'section',
            'label': 'Streaming services',
            'description': 'Enable or disable Spotify Streaming services',
            'onSave': {
              'type': 'plugin',
              'endpoint': 'music_services/spop',
              'method': 'saveSpopConf'
            },
            'saveButton': {
              'label': 'salva',
              'data': [
                'spotify_service',
                'spotify_username',
                'spotify_password',
                'prefer_high_quality'
              ]
            },
            'content': [
              {
                'id': 'spotify_service',
                'element': 'switch',
                'label': 'Spotify Service',
                'value': true
              },
              {
                'id': 'spotify_username',
                'element': 'input',
                'attributes': [
                  {'placeholder': 'Type your spotify username'},
                  {'maxlength': 5}
                ],
                'label': 'Username',
                'value': 'asd',
                'visibleIf': {'field': 'spotify_service', 'value': true}
              },
              {
                'id': 'spotify_password',
                'element': 'input',
                'type': 'password',
                'label': 'Password',
                'value': 'dusdhsudhsu',
                'visibleIf': {'field': 'spotify_service', 'value': true}
              },
              {
                'id': 'prefer_high_quality',
                'element': 'switch',
                'label': 'Prefer high quality music',
                'value': 'false',
                'visibleIf': {'field': 'spotify_service', 'value': true}
              }
            ]
          },
          {
            'id': 'section_sound_quality',
            'type': 'section',
            'label': 'Sound quality tweaks',
            'description': 'These profiles??',
            'onSave': {
              'type': 'plugin',
              'endpoint': 'music_services/spop',
              'method': 'saveSpopConf'
            },
            'saveButton': {
              'label': 'salva',
              'data': [
                'kernel_profile'
              ]
            },
            'content': [
              {
                'id': 'kernel_profile',
                'element': 'select',
                'label': 'Kernel profile',
                'value': {'value': 2 ,'label': 'Less Jitter'},
                'options': [
                  {
                    'value': 1,
                    'label': 'Default'
                  },
                  {
                    'value': 2,
                    'label': 'Less Jitter'
                  },
                  {
                    'value': 3,
                    'label': 'Jitter'
                  },
                  {
                    'value': 4,
                    'label': 'Focus'
                  }
                ]
              }
            ]
          },
          {
            'id': 'section_updates',
            'type': 'section',
            'label': 'System updates',
            'content': [
              {
                'id': 'update',
                'element': 'button',
                'label': 'System updates',
                'description': 'You can check?...',
                'onClick': {
                  'type': 'emit',
                  'data': 'search-for-upgrade',
                  'message': 'updateCheck',
                  'askForConfirm': {'title': 'Confirm', 'message': 'are you sure?'}
                }
              }
            ]
          }
        ]
      }
    };
  }
}

export default MockService;
