// global malarkey:false, toastr:false, moment:false */
import config from './index.config';


import routerConfig from './index.route';
import runBlock from './index.run';


// Services
import PlayerService from './services/player.service';
import PlayQueueService from './services/play-queue.service';
import BrowseService from './services/browse.service';
//import PlaylistService from './services/playlist.service';
import SocketService from './services/socket.service';
import LoggerService from './services/logger.service';
import MockService from './mock/mock.service';

// Components
import PlayerButtonsDirective from './components/player-buttons/player-buttons.directive';
import VolumeManagerDirective from './components/volume-manager/volume-manager.directive';
import TrackManagerDirective from './components/track-manager/track-manager.directive';
import TrackInfoDirective from './components/track-info/track-info.directive';
import PlayerStatusDirective from './components/player-status/player-status.directive';
import PlayerLoggerDirective from './components/player-logger/player-logger.directive';
import SideMenuDirective from './components/side-menu/side-menu.directive';
import KnobDirective from './components/knob/knob.directive';
import MultiRoomDirective from './components/multi-room/multi-room.directive';

//Directives
import PluginAttributesDirective from './plugin/elements/plugin-attributes.directive';
import PluginVisibleDirective from './plugin/elements/plugin-visible.directive';


// Controllers
import VolumioController from './volumio/volumio.controller';

import HeaderController from './header/header.controller';
import FooterController from './footer/footer.controller';
import SettingsController from './settings/settings.controller';
import PluginController from './plugin/plugin.controller';


import BrowseController from './browse/browse.controller';
import PlaybackController from './playback/playback.controller';
import PlaylistController from './playlist/playlist.controller';

// import MainController from './main/main.controller';
// import GithubContributorService from '../app/components/githubContributor/githubContributor.service';
// import WebDevTecService from '../app/components/webDevTec/webDevTec.service';
// import NavbarDirective from '../app/components/navbar/navbar.directive';
// import MalarkeyDirective from '../app/components/malarkey/malarkey.directive';

angular.module('volumio', ['ui.select','frapontillo.bootstrap-switch','ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap'])
  // .constant('malarkey', malarkey)
  // .constant('toastr', toastr)
  //.constant('moment', moment)
  .config(config)
  .config(routerConfig)

  .run(runBlock)
  // .service('githubContributor', GithubContributorService)
  // .service('webDevTec', WebDevTecService)
  // .controller('MainController', MainController)
  // .directive('acmeNavbar', () => new NavbarDirective())
  // .directive('acmeMalarkey', () => new MalarkeyDirective(malarkey))

  .service('socketService', SocketService)
  .service('playerService', PlayerService)
  .service('browseService', BrowseService)
  //.service('playlistService', PlaylistService)
  .service('playQueueService', PlayQueueService)
  .service('loggerService', LoggerService)
  .service('mockService', MockService)


  .directive('playerButtons', () => new PlayerButtonsDirective())
  .directive('volumeManager', () => new VolumeManagerDirective())
  .directive('trackManager', () => new TrackManagerDirective())
  .directive('trackInfo', () => new TrackInfoDirective())
  .directive('playerStatus', () => new PlayerStatusDirective())
  .directive('playerLogger', () => new PlayerLoggerDirective())
  .directive('sideMenu', () => new SideMenuDirective())
  .directive('knob', () => new KnobDirective())
  .directive('multiRoom', () => new MultiRoomDirective())

  .directive('pluginAttributes', () => new PluginAttributesDirective())
  .directive('pluginVisible', () => new PluginVisibleDirective())

  .controller('VolumioController', VolumioController)
  .controller('HeaderController', HeaderController)
  .controller('FooterController', FooterController)
  .controller('SettingsController', SettingsController)
  .controller('PluginController', PluginController)

  .controller('BrowseController', BrowseController)
  .controller('PlaybackController', PlaybackController)
  .controller('PlaylistController', PlaylistController)

  ;
