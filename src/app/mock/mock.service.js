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
      browseMusic: {
        getMainPageSources: {
          lists: [
            {
              title: 'Pinned',
              icon: 'fa-thumb-tack',
              showMoreUri: 'pin',
              service: 'smart_suggestions',
              items: [
                {
                  title: 'Artists',
                  uri: 'artists://',
                  albumart: 'https://h9aodgwnwvttt2hsvzpd3hjngau1-7be29a3e4adf930b235602881f0bfab2.eu2.myvolumio.org/albumart?sourceicon=music_service/mpd/artisticon.png',
                  extensionIcon: '',
                  plugin_type: 'music_service',
                  plugin_name: 'mpd',
                  explicit: false,
                  meta: '',
                  genre: '',
                  type: 'pin'
                },
                {
                  title: 'Albums',
                  uri: 'albums://',
                  albumart: 'http://192.168.1.2/albumart?sourceicon=music_service/mpd/albumicon.png',
                  extensionIcon: '',
                  plugin_type: 'music_service',
                  plugin_name: 'mpd',
                  explicit: false,
                  meta: '',
                  genre: '',
                  type: 'pin'
                }
              ]
            },
            {
              title: 'Recently played',
              icon: 'https://img.apksum.com/81/com.qobuz.music/5.6.3/icon.png',
              showMoreUri: 'recently_played',
              service: 'smart_suggestions',
              items: [
                {
                  title: 'Division bell',
                  uri: 'QOBUZ:uri_stuff',
                  albumart: 'https://lastfm.freetls.fastly.net/i/u/300x300/e7090eb6d05349ae8e0932264910d875.jpg',
                  extensionIcon: 'https://resources.mynewsdesk.com/image/upload/c_limit,dpr_2.0,f_auto,h_700,q_auto,w_1400/slza5xaljuypmtrtgnbo.jpg',
                  plugin_type: 'music_service',
                  plugin_name: 'streaming:qobuz',
                  explicit: false,
                  meta: '2014 Jun',
                  genre: 'POP',
                  type: 'cuesong'
                }
              ]
            },
          ]
        },
        getArtistPageContent: {
          info: {
            uri: 'artists://The%20Beatles',
            title: 'The Beatles',
            description: `
              <p>The Beatles were an iconic rock group from Liverpool, England. They are frequently cited as the most commercially successful and critically acclaimed band in modern history, with innovative music, a cultural impact that helped define the 1960s and an enormous influence on music that is still felt today. Currently, The Beatles are one of the two musical acts to sell more than 1 billion records, with only Elvis Presley having been able to achieve the same feat.</p>
              <p>After conquering Europe, with successful tours to Germany and Sweden, the Beatles led the mid-1960s musical 'British Invasion' into the United States. Although their initial musical style was rooted in 1950s rock and roll and homegrown skiffle, the group explored a great variety of musical styles including Psychedelic Rock, Experimental, Ballads, Western and Indian Classical among others. Their clothes, hairstyles, and statements made them trend-setters, while their growing social awareness saw their influence extend into the social and cultural revolutions of the 1960s.</p>
            `,
            service: 'mpd',
            type: 'artist',
            genre: 'Pop',
            local_albums: 2,
            streaming_albums: 132,
            albumart: 'https://lastfm.freetls.fastly.net/i/u/770x0/d586183f5e3fc6f578e753e0a3e29c79.jpg#d586183f5e3fc6f578e753e0a3e29c79',
            favorite: false,
            credits: [
              {
                "key": "drums (drum set)",
                "values": [
                  {
                    "name": "Phil Rudd",
                    "uri": "mbid:/artist/9e01d7c2-e322-4e24-a0fb-24e986523c01"
                  }
                ]
              },
              {
                "key": "bass",
                "values": [
                  {
                    "name": "Cliff Williams",
                    "uri": "mbid:/artist/44bb6793-2fa2-40be-9377-0bd0242368da"
                  }
                ]
              },
              {
                "key": "guitar",
                "values": [
                  {
                    "name": "Angus Young",
                    "uri": "mbid:/artist/a0a54c69-b0d2-4d2a-bcf8-994b8846b0d8"
                  },
                  {
                    "name": "Malcolm Young",
                    "uri": "mbid:/artist/ea719716-da05-46f8-bbd5-cc5803db3d0e"
                  }
                ]
              },
            ],
            availableListViews: ['list', 'grid'],
          },
          lists: [
            {
              title: 'Local albums',
              icon: '',
              items: [
                {
                  service: 'mpd',
                  type: 'folder',
                  title: 'Abbey Road (Anniversary Edition)',
                  artist: '',
                  albumart: 'https://lastfm.freetls.fastly.net/i/u/770x0/307370ac9c7cb089bcd6f60f1222f7c2.jpg#307370ac9c7cb089bcd6f60f1222f7c2',
                  uri: 'artists:///Abbey%20Road%20(Anniversary%20Edition)',
                  meta: 'Jun 2014',
                  genre: 'Pop rock',
                  extensionIcon: 'https://resources.mynewsdesk.com/image/upload/c_limit,dpr_2.0,f_auto,h_700,q_auto,w_1400/slza5xaljuypmtrtgnbo.jpg',
                  favorite: true,
                  tracks: [
                    {
                      uri: 'music-library/INTERNAL/The Beatles - Abbey Road (Anniversary Edition 2 CD 2019) [FLAC]/CD 1/01 - Come Together.flac',
                      service: 'mpd',
                      title: 'Come Together',
                      artist: 'The Beatles',
                      album: 'Abbey Road (Anniversary Edition)',
                      type: 'song',
                      tracknumber: '1',
                      duration: 260,
                      trackType: 'flac',
                      favorite: false
                    },
                    {
                      uri: 'music-library/INTERNAL/The Beatles - Abbey Road (Anniversary Edition 2 CD 2019) [FLAC]/CD 1/02 - Something.flac',
                      service: 'mpd',
                      title: 'Something',
                      artist: 'The Beatles',
                      album: 'Abbey Road (Anniversary Edition)',
                      type: 'song',
                      tracknumber: '2',
                      duration: 182,
                      trackType: 'flac',
                      favorite: false
                    },
                    {
                      uri: 'music-library/INTERNAL/The Beatles - Abbey Road (Anniversary Edition 2 CD 2019) [FLAC]/CD 1/04 - Oh! Darling.flac',
                      service: 'mpd',
                      title: 'Oh! Darling',
                      artist: 'The Beatles',
                      album: 'Abbey Road (Anniversary Edition)',
                      type: 'song',
                      tracknumber: '4',
                      duration: 207,
                      trackType: 'flac',
                      favorite: true
                    },
                    {
                      uri: 'music-library/INTERNAL/The Beatles - Abbey Road (Anniversary Edition 2 CD 2019) [FLAC]/CD 1/05 - Octopus\'s Garden.flac',
                      service: 'mpd',
                      title: 'Octopus\'s Garden',
                      artist: 'The Beatles',
                      album: 'Abbey Road (Anniversary Edition)',
                      type: 'song',
                      tracknumber: '5',
                      duration: 171,
                      trackType: 'flac',
                      favorite: false
                    },
                    {
                      uri: 'music-library/INTERNAL/The Beatles - Abbey Road (Anniversary Edition 2 CD 2019) [FLAC]/CD 1/06 - I Want You (She\'s So Heavy).flac',
                      service: 'mpd',
                      title: 'I Want You (She\'s So Heavy)',
                      artist: 'The Beatles',
                      album: 'Abbey Road (Anniversary Edition)',
                      type: 'song',
                      tracknumber: '6',
                      duration: 467,
                      trackType: 'flac',
                      favorite: false
                    }
                  ]
                }
              ]
            }
          ]
        },
        getAlbumPageContent: {
          info: {
            uri: 'album://Abbey%20Road%20(Remastered)',
            album: 'Abbey Road (Remastered)',
            artist: 'The Beatles',
            description: `
              <p>Abbey Road is the eleventh studio album by English rock band the Beatles, released on 26 September 1969 by Apple Records. The recording sessions for the album were the last in which all four Beatles participated. Although Let It Be was the final album that the Beatles completed before the band's dissolution in April 1970, most of the album had been recorded before the Abbey Road sessions began. A two-sided hit single from the album, "Something" backed with "Come Together", released in October, topped the Billboard Hot 100 chart in the US.</p>
              <p>Abbey Road is a rock album that incorporates genres such as blues, pop, and progressive rock, and it makes prominent use of the Moog synthesizer and the Leslie speaker. Side two contains a medley of song fragments edited together to form a single piece. The album was recorded amid a more enjoyable atmosphere than the Get Back/Let It Be sessions earlier in the year, but there were still frequent disagreements within the band. John Lennon had privately left the group by the time the album was released and McCartney publicly quit the following year.</p>
            `,
            service: 'mpd',
            type: 'album',
            genre: 'Pop',
            duration: '99:23',
            year: 'Sep 2019',
            favorite: true,
            albumart: 'https://lastfm.freetls.fastly.net/i/u/770x0/e97046f5bc772a726c602cc2e01830c0.webp#e97046f5bc772a726c602cc2e01830c0',
            credits: [
              {
                "key": "drums (drum set)",
                "values": [
                  {
                    "name": "Phil Rudd",
                    "uri": "mbid:/artist/9e01d7c2-e322-4e24-a0fb-24e986523c01"
                  }
                ]
              },
              {
                "key": "bass",
                "values": [
                  {
                    "name": "Cliff Williams",
                    "uri": "mbid:/artist/44bb6793-2fa2-40be-9377-0bd0242368da"
                  }
                ]
              },
              {
                "key": "guitar",
                "values": [
                  {
                    "name": "Angus Young",
                    "uri": "mbid:/artist/a0a54c69-b0d2-4d2a-bcf8-994b8846b0d8"
                  },
                  {
                    "name": "Malcolm Young",
                    "uri": "mbid:/artist/ea719716-da05-46f8-bbd5-cc5803db3d0e"
                  }
                ]
              },
            ],
            availableListViews: ['list'],
          },
        }
      },
      wizard: {
        "steps": [
          "Language", "Name", "Output", "Network", "Music", "Done"
        ],
        "language": {
          "defaultLanguage": {"code": "en", "language": "English"},
          "available": [
            {"code": "en", "language": "English"},
            {"code": "it", "language": "Italiano"},
            {"code": "fr", "language": "French"}
          ]
        },
        "deviceName": {"name": "volumio"},
        "outputDevices": {
          "devices": [
            {"id": 1, "name": "Out 1"},
            {"id": 2, "name": "Out 2"}
          ],
          "i2s": [
            {"id": 1, "name": "Out i2s 1"},
            {"id": 2, "name": "Out i2s 2"}
          ]
        },
        "donation": {
          "donationAmount": 20,
          "customAmount": 150,
          "amounts": [
            10,
            20,
            50,
            100
          ]
        }
      },
      //networkSharesDiscovery
      networkSharesDiscovery: {
        'nas': [
          {
            'name': 'VOLUMIO',
            'shares': [
              {
                'sharename': 'IPC$',
                'path': 'VOLUMIO/IPC$'
              },
              {
                'sharename': 'NAS',
                'path': 'VOLUMIO/NAS'
              },
              {
                'sharename': 'USB',
                'path': 'VOLUMIO/USB'
              }
            ]
          },
          {
            'name': 'FRITZ-NAS',
            'shares': [
              {
                'sharename': 'IPC$',
                'path': 'FRITZ-NAS/IPC$'
              },
              {
                'sharename': 'FRITZ.NAS',
                'path': 'FRITZ-NAS/FRITZ.NAS'
              }
            ]
          },
          {
            'name': 'DISKSTATION',
            'shares': [
              {
                'sharename': 'IPC$',
                'path': 'DISKSTATION/IPC$'
              },
              {
                'sharename': 'video',
                'path': 'DISKSTATION/video'
              },
              {
                'sharename': 'Torrent',
                'path': 'DISKSTATION/Torrent'
              },
              {
                'sharename': 'Programmi',
                'path': 'DISKSTATION/Programmi'
              },
              {
                'sharename': 'photo',
                'path': 'DISKSTATION/photo'
              },
              {
                'sharename': 'NetBackup',
                'path': 'DISKSTATION/NetBackup'
              },
              {
                'sharename': 'music',
                'path': 'DISKSTATION/music'
              },
              {
                'sharename': 'Mi',
                'path': 'DISKSTATION/Mi'
              },
              {
                'sharename': 'IMGs',
                'path': 'DISKSTATION/IMGs'
              },
              {
                'sharename': 'homes',
                'path': 'DISKSTATION/homes'
              },
              {
                'sharename': 'FLAC',
                'path': 'DISKSTATION/FLAC'
              },
              {
                'sharename': 'Film',
                'path': 'DISKSTATION/Film'
              },
              {
                'sharename': 'Backup',
                'path': 'DISKSTATION/Backup'
              }
            ]
          }
        ]
      },
      //installedPlugins
      installedPlugins: [
        {
          prettyName: 'Nome Plugin 1',
          enabled: true,
          active: true,
          category: 'Category 1',
          name: 'name'
        },
        {
          prettyName: 'Nome Plugin 2',
          enabled: false,
          active: false,
          category: 'Category 2',
          name: 'name2'
        },
      ],
      //availablePlugins
      availablePlugins: {
        metaData: {
          repoUlr: 'fetching ulr',
          repoStatus: 'Up'
        },
        categories: [
          {
            name: 'Music Services ',
            id: 'cat1',
            description: 'Plugins for Adding Music Sources to Volumio',
            plugins: [
              {
                name: 'Spotify',
                version: '1.0',
                url: 'volumio.github.io/volumio-plugins/plugins/volumio/armhf/music_service/spotify/spotify.zip',
                license: 'Free for non commercial USE',
                description: 'plugin 1 desc',
                author: 'Volumio Team',
                updated: '23-04-2016'
              },
              {
                name: 'Another WebRadio Plugin',
                version: '1.0',
                url: 'volumio.github.io/volumio-plugins/plugins/volumio/armhf/music_service/spotify/spotify.zip',
                license: 'gpl-v3',
                description: 'Adding other WebRadios',
                author: 'Volumio Team',
                updated: '23-04-2016'
              }
            ]
          },
          {
            name: 'Miscelleanea',
            id: 'cat2',
            description: 'Things that cannot go in other categories',
            plugins: [
              {
                name: 'Random thing',
                version: '1.0',
                url: 'volumio.github.io/volumio-plugins/plugins/volumio/armhf/music_service/spotify/spotify.zip',
                license: 'gpl-v3',
                description: 'Something Random',
                author: 'Volumio Team',
                updated: '23-04-2016'
              }
            ]
          },
          {
            name: 'System Tools',
            id: 'cat3',
            description: 'Volumio System Tools',
            plugins: [
              {
                name: 'Touchscreen display',
                version: '1.0',
                url: 'volumio.github.io/volumio-plugins/plugins/volumio/armhf/music_service/spotify/spotify.zip',
                license: 'gpl-v3',
                description: 'Use the 7 inches pi display',
                author: 'Volumio Team',
                updated: '23-04-2016'
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
          name: 'SHARE',
          ip: '192.168.10.35',
          path: 'path',
          id: 'suasianure 2',
          mounted: 'true',
          size: '40 GB',
          fstype: 'cifs'
        },
        {
          name: 'SHARE',
          ip: '192.168.10.99',
          path: 'path',
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
        {
          albumart: '/albumart?sourceicon=music_service/mpd/favouritesicon.png',
          name: 'Favorites',
          uri: 'favourites',
          plugin_type: '',
          plugin_name: ''
        },
        {
          albumart: '/albumart?sourceicon=music_service/mpd/playlisticon.svg',
          name: 'Playlists',
          uri: 'playlists',
          plugin_type: 'music_service',
          plugin_name: 'mpd'
        },
        {
          albumart: '/albumart?sourceicon=music_service/mpd/musiclibraryicon.svg',
          name: 'Music Library',
          uri: 'music-library',
          plugin_type: 'music_service',
          plugin_name: 'mpd'
        },
        {
          albumart: '/albumart?sourceicon=music_service/mpd/artisticon.png',
          name: 'Artists',
          uri: 'artists://',
          plugin_type: 'music_service',
          plugin_name: 'mpd'
        },
        {
          albumart: '/albumart?sourceicon=music_service/mpd/albumicon.png',
          name: 'Albums',
          uri: 'albums://',
          plugin_type: 'music_service',
          plugin_name: 'mpd'
        },
        {
          albumart: '/albumart?sourceicon=music_service/mpd/genreicon.png',
          name: 'Genres',
          uri: 'genres://',
          plugin_type: 'music_service',
          plugin_name: 'mpd'
        },
        {
          albumart: '/albumart?sourceicon=music_service/last_100/icon.svg',
          name: 'last 100',
          uri: 'Last_100',
          plugin_type: 'music_service',
          plugin_name: 'last_100'
        },
        {
          albumart: '/albumart?sourceicon=music_service/webradio/icon.svg',
          icon: 'fa fa-microphone',
          name: 'Web Radio',
          uri: 'radio',
          plugin_type: 'music_service',
          plugin_name: 'webradio'
        },
        {
          name: 'Audio CD',
          uri: 'cd',
          info: 'CD ',
          plugin_type: 'music_service',
          plugin_name: 'cd_controller',
          menuItems: [
            {
              name: 'link1',
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
              name: 'link2',
              socketCall: {
                emit: 'callMethod',
                payload: {
                  endpoint: 'music_service/cd_controller',
                  method: 'getRipInfo',
                  data: ''
                }
              }
            },
            {
              name: 'link3',
              socketCall: {
                emit: 'callMethod',
                payload: {
                  endpoint: 'music_service/cd_controller',
                  method: 'eject',
                  data: ''
                }
              }
            }
          ]
        }
      ],
      getBrowseLibrary: {
        'navigation': {
          'lists': [
            {
              'title': 'Artists',
              'icon': 'fa fa-music',
              'availableListViews': [
                'grid', 'list'
              ],
              'items': [
                {
                  'service': 'mpd',
                  'type': 'song',
                  'title': 'Led Zeppelin',
                  'icon': 'fa fa-music',
                  'uri': 'search://artist/Led Zeppelin'
                }
              ]
            },
            {
              'title': 'Webradios',
              'icon': '',
              'availableListViews': [
                'list'
              ],
              'items': [
                {
                  'service': 'webradio',
                  'type': 'webradio',
                  'title': 'ledjam',
                  'artist': '',
                  'album': '',
                  'icon': 'fa fa-microphone',
                  'uri': 'http://yp.shoutcast.com/sbin/tunein-station.m3u?id=492072'
                },
                {
                  'service': 'webradio',
                  'type': 'webradio',
                  'title': 'NAXI 80-e RADIO (NAXI,Belgrade,Serbia, NAXI,Beograd,Srbija) - 128k',
                  'artist': '',
                  'album': '',
                  'icon': 'fa fa-microphone',
                  'uri': 'http://yp.shoutcast.com/sbin/tunein-station.m3u?id=68544'
                }
              ]
            }
          ],
          'prev': {
            'uri': '/'
          }
        }
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
          'description': 'If you mess up with this configuration, you can reset to default.',
          'passwordProtection': {'enabled': true, 'message': 'Insert password for'}
        },
        sections: [
          {
            'id': 'section_player_name',
            'hidden': false,
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
              ],
              'hidden': false
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
                'value': 'Volumio',
                'hidden': false,
                'description': 'This is a desc',
                'doc': 'This is a doc'
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
                'description': 'desc',
                'doc': 'Spot doc',
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
          },

          {
            'id': 'eq',
            'type': 'section',
            'label': 'Equalizer',
            'onSave': {
              'type': 'plugin',
              'endpoint': 'music_services/eq',
              'method': 'saveEqValues'
            },
            'saveButton': {
              'label': 'Save eq settings',
              'data': [
                'bandEqualizer', 'equalizerSelector'
              ]
            },
            'content': [
              {
                'id': 'eq_switch',
                'element': 'switch',
                'label': 'Test eq switch',
                'value': true
              },
              {
                'id': 'bandEqualizer',
                'element': 'equalizer',
                'label': 'Music EQ',
                'description': 'Desc',
                'visibleIf': {'field': 'eq_switch', 'value': true},
                'config': {
                  orientation: 'vertical',
                  bars: [
                    {
                      min: -100,
                      max: 100,
                      step: 20,
                      value: 20,
                      tooltip: 'always'
                    },
                    {
                      min: 0,
                      max: 50,
                      step: 20,
                      value: 25,
                      tooltip: 'hide'
                    },
                    {
                      min: 0,
                      max: 50,
                      step: 20,
                      value: 25,
                      tooltip: 'always'
                    }
                  ]
                }
              },

              {
                'id': 'equalizerSelector',
                'element': 'equalizer',
                'label': 'Slider selector',
                'description': 'Desc',
                'config': {
                  orientation: 'horizontal',
                  bars: [
                    {
                      min: 0,
                      max: 50,
                      step: 10,
                      value: [10, 20],
                      range: true,
                      tooltip: 'always'
                    },
                    {
                      ticks: [1, 2, 3],
                      ticksLabels: ['Min', 'Medium', 'Max'],
                      value: 2,
                      tooltip: 'show'
                    },
                    {
                      ticks: [1, 2, 3, 4, 5],
                      ticksPositions: [0, 20, 40, 80, 100],
                      ticksLabels: ['1', '2', '3', '4', '5'],
                      tickSnapBounds: 20,
                      value: 4,
                      tooltip: 'show'
                    }
                  ]
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
