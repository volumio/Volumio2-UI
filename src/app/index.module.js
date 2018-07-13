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
import UpdaterService from './services/updater.service';
import ModalService from './services/modal.service';
import ModalListenerService from './services/modal-listener.service';
import MatchmediaService from './services/matchmedia.service';
import LoggerService from './services/logger.service';
import MockService from './mock/mock.service';
import RipperService from './services/ripper.service';
import UiSettingsService from './services/ui-settings.service';

//Providers
import ThemeManagerProvider from './services/theme-manager.provider';

// Components
import PlayerButtonsDirective from './components/player-buttons/player-buttons.directive';
import VolumeManagerDirective from './components/volume-manager/volume-manager.directive';
import TrackManagerDirective from './components/track-manager/track-manager.directive';
import TrackInfoDirective from './components/track-info/track-info.directive';
import PlayerStatusDirective from './components/player-status/player-status.directive';
import SideMenuDirective from './components/side-menu/side-menu.directive';
import KnobDirective from './components/knob/knob.directive';
import MultiRoomDockDirective from './components/multi-room-dock/multi-room-dock.directive';
import AirplayScrimDirective from './components/airplay-scrim/airplay-scrim.directive';
import WaitBackendScrimDirective from './components/wait-backend-scrim/wait-backend-scrim.directive';
import PlayerLoggerDirective from './components/player-logger/player-logger.directive';
import PlaylistDirective from './components/playlist/playlist.directive';
import BrowseScrollManagerDirective from './browse/components/browse-scroll-manager.directive';
import BrowseHamburgerMenuDirective from './browse/components/browse-hamburger-menu.directive';
import TrackInfoBarDirective from './components/track-info-bar/track-info-bar.directive';
import TrackInfoBarButtonsDirective from './components/track-info-bar/track-info-bar-buttons.directive';
import EqualizerDirective from './components/equalizer/equalizer.directive';
import ModalController from './components/modals/modal.controller';
// Track buttons
import FavouriteTrackBtnDirective from './components/favourite-track-btn/favourite-track-btn.directive';
import AddTrackToPlaylistBtnDirective from './components/add-track-to-playlist-btn/add-track-to-playlist-btn.directive';
import TrackAciotnsBtnDirective from './components/track-actions-btn/track-actions-btn.directive';

// Light Switch
import LightSwitchBtnDirective from './components/light-switch-btn/light-switch-btn.directive';

//Directives
import PluginAttributesDirective from './plugin/components/plugin-attributes.directive';
import PluginVisibleDirective from './plugin/components/plugin-visible.directive';
import PluginComponent from './plugin/components/plugin.component';

// Controllers
import HeaderController from './header/header.controller';
import LayoutController from './layout/layout.controller';
import FooterController from './footer/footer.controller';

import DebugController from './debug/debug.controller';
import StaticPageController from './static-pages/static-page.controller';
import MultiRoomManagerController from './multi-room-manager/multi-room-manager.controller';

import BrowseController from './browse/browse.controller';
import PlaybackController from './playback/playback.controller';
import PlayQueueController from './play-queue/play-queue.controller';

import PluginController from './plugin/plugin.controller';
import PluginManagerController from './plugin-manager/plugin-manager.controller';

import WizardController from './wizard/wizard.controller';

//Modals
import ModalPlaylistController from './browse/components/modal/modal-playlist.controller';
import ModalWebRadioController from './browse/components/modal/modal-web-radio.controller';
import ModalPowerOffController from './components/side-menu/elements/modal-power-off.controller';
import ModalSleepController from './components/side-menu/elements/modal-sleep.controller';
import ModalAlarmClockController from './components/side-menu/elements/modal-alarm-clock.controller';
import ModalUpdaterController from './components/modals/modal-updater.controller';
import ModalProgressCustomController from './components/modals/modal-progress.controller';
import ModalGotitController from './components/modals/modal-gotit.controller';
import ModalConfirmController from './components/modals/modal-confirm.controller';
import ModalRipperController from './components/modals/modal-ripper.controller';
import ModalCustomController from './components/modals/modal-custom.controller';
import ModalPasswordController from './components/modals/modal-password.controller';
import ModalKaraokeController from './components/side-menu/elements/modal-karaoke.controller';
import ModalPluginInstallerController from './plugin-manager/components/modals/modal-plugin-installer.controller';
import ModalTrackManagerActionsController from
  './components/track-manager/components/modals/modal-track-manager-actions.controller';
import ModalNetwordDrivesPasswordController from './plugin/core-plugin/modals/modal-network-drive-password.controller';
import ModalCryptoController from './components/modals/modal-crypto.controller';


//Core plugin controller
import WifiPluginController from './plugin/core-plugin/wifi-plugin.controller';
import NetworkStatusPluginController from './plugin/core-plugin/network-status-plugin.controller';
import MyMusicPluginController from './plugin/core-plugin/my-music-plugin.controller';
import NetworkDrivesPluginController from './plugin/core-plugin/network-drives-plugin.controller';
import SystemVersionPluginController from './plugin/core-plugin/system-version-plugin.controller';
import FirmwareUploadPluginController from './plugin/core-plugin/firmware-upload-plugin.controller';
import UiSettingsPluginController from './plugin/core-plugin/ui-settings-plugin.controller';
import MyMusicPluginEnablerController from './plugin/core-plugin/my-music-plugin-enabler-plugin.controller';



angular.module('volumio', [
  //custom modules
  'volumio.constant',

  //Vendor modules
  'ui.bootstrap-slider',
  'ui.bootstrap',
  'toastr',
  'ngDraggable',
  'ui.select',
  'frapontillo.bootstrap-switch',
  'ui.bootstrap',
  'ui.router',
  'matchmedia-ng',
  'hmTouchEvents',
  'ngFileUpload',
  'pascalprecht.translate',
  'LocalStorageModule',
  'cg.mailchimp',
  'cfp.loadingBar',

  //Angular core modules
  // 'ngAnimate',
  // 'ngCookies',
  'ngTouch',
  'ngSanitize'
  ])

  //.constant('', toastr)
  //.constant('moment', moment)

  .config(config)
  .config(routerConfig)

  .run(runBlock)

  .service('socketService', SocketService)
  .service('playerService', PlayerService)
  .service('browseService', BrowseService)
  .service('playlistService', PlaylistService)
  .service('playQueueService', PlayQueueService)
  .service('multiRoomService', MultiRoomService)
  .service('toastMessageService', ToastMessageService)
  .service('updaterService', UpdaterService)
  .service('modalService', ModalService)
  .service('modalService', ModalService)
  .service('modalListenerService', ModalListenerService)
  .service('matchmediaService', MatchmediaService)
  .service('mockService', MockService)
  .service('ripperService', RipperService)
  .service('uiSettingsService', UiSettingsService)


  .provider('themeManager', ThemeManagerProvider)

  // Components
  .directive('playerButtons', (themeManager) => new PlayerButtonsDirective(themeManager))
  .directive('volumeManager', (themeManager) => new VolumeManagerDirective(themeManager))
  .directive('trackManager', (themeManager, $log) => new TrackManagerDirective(themeManager, $log))
  .directive('trackInfo', (themeManager) => new TrackInfoDirective(themeManager))
  .directive('playerStatus', () => new PlayerStatusDirective())
  .directive('sideMenu', () => new SideMenuDirective())
  .directive('knob', () => new KnobDirective())
  .directive('multiRoomDock', (themeManager) => new MultiRoomDockDirective(themeManager))
  .directive('airplayScrim', () => new AirplayScrimDirective())
  .directive('waitBackendScrim', () => new WaitBackendScrimDirective())
  .directive('playerLogger', () => new PlayerLoggerDirective())
  .directive('playlist', (themeManager) => new PlaylistDirective(themeManager))
  .directive('browseScrollManager',
      (browseService, matchmediaService) => new BrowseScrollManagerDirective(browseService, matchmediaService))
  .directive('browseHamburgerMenu', () => new BrowseHamburgerMenuDirective())
  .directive('trackInfoBar', () => new TrackInfoBarDirective())
  .directive('trackInfoBarButtons', () => new TrackInfoBarButtonsDirective())
  .directive('equalizer', () => new EqualizerDirective())

  .directive('pluginAttributes', () => new PluginAttributesDirective())
  .directive('pluginVisible', () => new PluginVisibleDirective())

  .directive('favouriteTrackBtn', (themeManager) => new FavouriteTrackBtnDirective(themeManager))
  .directive('addTrackToPlaylistBtn', (themeManager) => new AddTrackToPlaylistBtnDirective(themeManager))
  .directive('trackActionsBtn', (themeManager) => new TrackAciotnsBtnDirective(themeManager))
  .directive('lightSwitchBtn', (themeManager) => new LightSwitchBtnDirective(themeManager))

  .controller('HeaderController', HeaderController)
  .controller('LayoutController', LayoutController)
  .controller('FooterController', FooterController)

  .controller('DebugController', DebugController)
  .controller('StaticPageController', StaticPageController)
  .controller('MultiRoomManagerController', MultiRoomManagerController)

  .controller('PluginController', PluginController)
  .controller('PluginManagerController', PluginManagerController)
  .component('pluginComponent', new PluginComponent())

  .controller('BrowseController', BrowseController)
  .controller('PlaybackController', PlaybackController)
  .controller('PlayQueueController', PlayQueueController)

  .controller('WizardController', WizardController)

  .controller('ModalController', ModalController)
  .controller('ModalPlaylistController', ModalPlaylistController)
  .controller('ModalWebRadioController', ModalWebRadioController)
  .controller('ModalPowerOffController', ModalPowerOffController)
  .controller('ModalSleepController', ModalSleepController)
  .controller('ModalAlarmClockController', ModalAlarmClockController)
  .controller('ModalUpdaterController', ModalUpdaterController)
  .controller('ModalProgressCustomController', ModalProgressCustomController)
  .controller('ModalGotitController', ModalGotitController)
  .controller('ModalConfirmController', ModalConfirmController)
  .controller('ModalRipperController', ModalRipperController)
  .controller('ModalCustomController', ModalCustomController)
  .controller('ModalPasswordController', ModalPasswordController)
  .controller('ModalKaraokeController', ModalKaraokeController)
  .controller('ModalPluginInstallerController', ModalPluginInstallerController)
  .controller('ModalTrackManagerActionsController', ModalTrackManagerActionsController)
  .controller('ModalNetwordDrivesPasswordController', ModalNetwordDrivesPasswordController)
  .controller('ModalCryptoController', ModalCryptoController)


  .controller('WifiPluginController',  WifiPluginController)
  .controller('NetworkStatusPluginController', NetworkStatusPluginController)
  .controller('MyMusicPluginController', MyMusicPluginController)
  .controller('NetworkDrivesPluginController', NetworkDrivesPluginController)
  .controller('SystemVersionPluginController', SystemVersionPluginController)
  .controller('FirmwareUploadPluginController', FirmwareUploadPluginController)
  .controller('UiSettingsPluginController', UiSettingsPluginController)
  .controller('MyMusicPluginEnablerController', MyMusicPluginEnablerController)

  ;
