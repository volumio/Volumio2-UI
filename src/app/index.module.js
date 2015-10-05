// global malarkey:false, toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';
import runBlock from './index.run';

// Services
import SocketService from './services/socket.service';
import PlayerService from './services/player.service';
import BrowseService from './services/browse.service';
import PlayQueueService from './services/play-queue.service';
import PlaylistService from './services/playlist.service';
import MultiRoomService from './services/multi-room.service';
import ToastMessageService from './services/toast-message.service';
import LoggerService from './services/logger.service';
import MockService from './mock/mock.service';

//Providers
import ThemeManagerProvider from './services/theme-manager.provider';

// Components
import PlayerButtonsDirective from './components/player-buttons/player-buttons.directive';
import VolumeManagerDirective from './components/volume-manager/volume-manager.directive';
import TrackManagerDirective from './components/track-manager/track-manager.directive';
import TrackInfoDirective from './components/track-info/track-info.directive';
import PlayerStatusDirective from './components/player-status/player-status.directive';
import PlayerLoggerDirective from './components/player-logger/player-logger.directive';
import SideMenuDirective from './components/side-menu/side-menu.directive';
import KnobDirective from './components/knob/knob.directive';
import MultiRoomDockDirective from './components/multi-room-dock/multi-room-dock.directive';

import ModalController from './components/modal/modal.controller';
import ModalService from './components/modal/modal.service';

//Directives
import PluginAttributesDirective from './plugin/elements/plugin-attributes.directive';
import PluginVisibleDirective from './plugin/elements/plugin-visible.directive';


// Controllers
import HeaderController from './header/header.controller';
import FooterController from './footer/footer.controller';

import SettingsController from './settings/settings.controller';
import PluginController from './plugin/plugin.controller';
import MultiRoomManagerController from './multi-room-manager/multi-room-manager.controller';

import BrowseController from './browse/browse.controller';
import PlaybackController from './playback/playback.controller';
import PlayQueueController from './play-queue/play-queue.controller';

//Modals
import ModalPlaylistController from './browse/components/modal/modal-playlist.controller';
import ModalPowerOffController from './components/side-menu/elements/modal-power-off.controller';
import ModalSleepController from './components/side-menu/elements/modal-sleep.controller';
import ModalAlarmClockController from './components/side-menu/elements/modal-alarm-clock.controller';



angular.module('volumio', [
  //Vendor module
  'ui.bootstrap-slider',
  'ui.bootstrap',
  'toastr',
  'ngDraggable',
  'ui.select',
  'frapontillo.bootstrap-switch',
  'ui.bootstrap',
  'ui.router',

  //Angular core modules
  'ngAnimate',
  'ngCookies',
  //'ngTouch',
  'ngSanitize'
  ])

  //.constant('', toastr)
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
  .service('playlistService', PlaylistService)
  .service('playQueueService', PlayQueueService)
  .service('multiRoomService', MultiRoomService)
  .service('toastMessageService', ToastMessageService)
  .service('loggerService', LoggerService)
  .service('mockService', MockService)

  .service('modalService', ModalService)

  .provider('themeManager', ThemeManagerProvider)

  .directive('playerButtons', () => new PlayerButtonsDirective())
  .directive('volumeManager', () => new VolumeManagerDirective())
  .directive('trackManager', () => new TrackManagerDirective())
  .directive('trackInfo', () => new TrackInfoDirective())
  .directive('playerStatus', () => new PlayerStatusDirective())
  .directive('playerLogger', () => new PlayerLoggerDirective())
  .directive('sideMenu', () => new SideMenuDirective())
  .directive('knob', () => new KnobDirective())
  .directive('multiRoomDock', () => new MultiRoomDockDirective())

  .directive('pluginAttributes', () => new PluginAttributesDirective())
  .directive('pluginVisible', () => new PluginVisibleDirective())

  .controller('HeaderController', HeaderController)
  .controller('FooterController', FooterController)

  .controller('SettingsController', SettingsController)
  .controller('PluginController', PluginController)
  .controller('MultiRoomManagerController', MultiRoomManagerController)

  .controller('BrowseController', BrowseController)

  .controller('PlaybackController', PlaybackController)
  .controller('PlayQueueController', PlayQueueController)

  .controller('ModalController', ModalController)
  .controller('ModalPlaylistController', ModalPlaylistController)
  .controller('ModalPowerOffController', ModalPowerOffController)
  .controller('ModalSleepController', ModalSleepController)
  .controller('ModalAlarmClockController', ModalAlarmClockController)
  ;
