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
import AudioOutputsService from './services/audio-outputs.service';
import MatchmediaService from './services/matchmedia.service';
import LoggerService from './services/logger.service';
import MockService from './mock/mock.service';
import RipperService from './services/ripper.service';
import UiSettingsService from './services/ui-settings.service';
import DevService from './services/dev.service';
import DeviceEndpointsService from './services/device-endpoints.service';
import CloudService from './services/cloud.service';
//MyVolumio Services
import AngularFireService from './services/myvolumio/angularfire.service';
import AuthService from './services/myvolumio/auth.service';
import PaymentsService from './services/myvolumio/payments.service';
import StripeService from './services/myvolumio/stripe.service';
import PaddleService from './services/myvolumio/paddle.service';
import DatabaseService from './services/myvolumio/database.service';
import ProductsService from './services/myvolumio/products.service';
import RemoteStorageService from './services/myvolumio/remote-storage.service';
import MyVolumioDevicesService from './services/myvolumio/myvolumio-devices.service';
import FirebaseApiFunctionsService from './services/myvolumio/firebase-api-functions.service';

//Providers
import ThemeManagerProvider from './services/theme-manager.provider';

// Components
import PlayerButtonsDirective from './components/player-buttons/player-buttons.directive';
import VolumeManagerDirective from './components/volume-manager/volume-manager.directive';
import TrackManagerDirective from './components/track-manager/track-manager.directive';
import TrackInfoDirective from './components/track-info/track-info.directive';
import PlayerStatusDirective from './components/player-status/player-status.directive';
import SideMenuDirective from './components/side-menu/side-menu.directive';
import AudioOutputsDirective from './components/audio-outputs/audio-outputs.directive';
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
import ModalController  from './components/modals/modal.controller';
//Volumio 3 UI Directives
import MainMenuDirective from './components/main-menu/main-menu.directive';
import OnCloudActionsDirective from './components/on-cloud-actions/on-cloud-actions.directive';
import PlayerSeekbarDirective from './components/player-seekbar/player-seekbar.directive';
// Track buttons
import FavouriteTrackBtnDirective from './components/favourite-track-btn/favourite-track-btn.directive';
import AddTrackToPlaylistBtnDirective from './components/add-track-to-playlist-btn/add-track-to-playlist-btn.directive';
import TrackActionsBtnDirective from './components/track-actions-btn/track-actions-btn.directive';

// Light Switch
import LightSwitchBtnDirective from './components/light-switch-btn/light-switch-btn.directive';

//Directives
import PluginAttributesDirective from './plugin/components/plugin-attributes.directive';
import PluginVisibleDirective from './plugin/components/plugin-visible.directive';
import PluginComponent from './plugin/components/plugin.component';

//MyVolumio Directives
import StripePayButtonDirective from './components/myvolumio/components/stripe-pay-button/stripe-pay-button.directive';
import PaddlePayButtonDirective from './components/myvolumio/components/paddle-pay-button/paddle-pay-button.directive';
import MyVolumioCardDirective from './components/myvolumio/components/card/myvolumio-card.directive';
import MyVolumioBackButtonDirective from './components/myvolumio/components/shareds/back-button/myvolumio-back-button.directive';
import MyVolumioAlreadyLoggedDirective from './components/myvolumio/components/shareds/already-logged/myvolumio-already-logged.directive';
import MyVolumioCurrentPlanCardDirective from './components/myvolumio/components/shareds/current-plan-card/myvolumio-current-plan-card.directive';
import MyVolumioFileOnChangeDirective from './components/myvolumio/components/shareds/file-on-change/myvolumio-file-on-change.directive';
import MyVolumioAvatarImageDirective from './components/myvolumio/components/shareds/avatar-image/myvolumio-avatar-image.directive';
import MyVolumioPlanCardDirective from './components/myvolumio/components/shareds/plan-card/myvolumio-plan-card.directive';
import MyVolumioVerificationCardDirective from './components/myvolumio/components/shareds/verification-card/myvolumio-verification-card.directive';
import MyVolumioDeviceSelectorDirective from './components/myvolumio/components/device-selector/device-selector.directive';

// Controllers
import HeaderController from './header/header.controller';
import LayoutController from './layout/layout.controller';
import FooterController from './footer/footer.controller';

import DebugController from './debug/debug.controller';
import StaticPageController from './static-pages/static-page.controller';
import MultiRoomManagerController from './multi-room-manager/multi-room-manager.controller';

import BrowseController from './browse/browse.controller';
import BrowseMusicController from './browse-music/browse-music.controller';
import PlaybackController from './playback/playback.controller';
import PlayQueueController from './play-queue/play-queue.controller';

import PluginController from './plugin/plugin.controller';
import PluginManagerController from './plugin-manager/plugin-manager.controller';

import WizardController from './wizard/wizard.controller';

// Volumio 3 UI Controllers
import HomeController from './home/home.controller';
import SettingsController from './settings/settings.controller';

//Modals
import ModalPlaylistController from './browse/components/modal/modal-playlist.controller';
import ModalArtistDetailsController from './browse-music/components/modal/modal-artist-details.controller';
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
import MyVolumioTermsModalController from './components/myvolumio/modals/myvolumio-terms-modal/myvolumio-terms-modal.controller';
import MyVolumioPayingModalController from './components/myvolumio/modals/myvolumio-paying-modal/myvolumio-paying-modal.controller';


//Core plugin controller
import WifiPluginController from './plugin/core-plugin/wifi-plugin.controller';
import NetworkStatusPluginController from './plugin/core-plugin/network-status-plugin.controller';
import MyMusicPluginController from './plugin/core-plugin/my-music-plugin.controller';
import NetworkDrivesPluginController from './plugin/core-plugin/network-drives-plugin.controller';
import SystemVersionPluginController from './plugin/core-plugin/system-version-plugin.controller';
import FirmwareUploadPluginController from './plugin/core-plugin/firmware-upload-plugin.controller';
import UiSettingsPluginController from './plugin/core-plugin/ui-settings-plugin.controller';
import MyMusicPluginEnablerController from './plugin/core-plugin/my-music-plugin-enabler-plugin.controller';

//Core plugin: MyVolumio
import MyVolumioLoginController from './components/myvolumio/login/myvolumio-login.controller';
import MyVolumioSignupController from './components/myvolumio/signup/myvolumio-signup.controller';
import MyVolumioSignupNewController from './components/myvolumio/signup-new/myvolumio-signup-new.controller';
import MyVolumioPremiumStreamingController from './components/myvolumio/premium-streaming/myvolumio-premium-streaming.controller';
import MyVolumioProfileController from './components/myvolumio/profile/myvolumio-profile.controller';
import MyVolumioPlansController from './components/myvolumio/plans/myvolumio-plans.controller';
import MyVolumioSubscribeController from './components/myvolumio/subscribe/myvolumio-subscribe.controller';
import MyVolumioPaymentSuccessController from './components/myvolumio/payment-success/myvolumio-payment-success.controller';
import MyVolumioPaymentFailController from './components/myvolumio/payment-fail/myvolumio-payment-fail.controller';
import MyVolumioRecoverPasswordController from './components/myvolumio/recover-password/myvolumio-recover-password.controller';
import MyVolumioEditProfileController from './components/myvolumio/edit-profile/myvolumio-edit-profile.controller';
import MyVolumioVerifyUserController from './components/myvolumio/verify-user/myvolumio-verify-user.controller';
import MyVolumioCancelSubscriptionController from './components/myvolumio/cancel-subscription/myvolumio-cancel-subscription.controller';
import MyVolumioChangeSubscriptionController from './components/myvolumio/change-subscription/myvolumio-change-subscription.controller';
import MyVolumioCloudSelectDeviceController from './components/myvolumio/select-device/myvolumio-cloud-select-device.controller';
import MyVolumioAccessController from './components/myvolumio/access/myvolumio-access.controller';


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
  'ngSanitize',
  'ngLetterAvatar',
  'angular-country-select',
  '720kb.datepicker',
  'firebase',
  'stripe.checkout'
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
  .service('audioOutputsService', AudioOutputsService)
  .service('matchmediaService', MatchmediaService)
  .service('mockService', MockService)
  .service('ripperService', RipperService)
  .service('uiSettingsService', UiSettingsService)
  .service('devService', DevService)
  .service('deviceEndpointsService', DeviceEndpointsService)
  .service('cloudService', CloudService)
  //MyVolumio Services
  .service('angularFireService', AngularFireService)
  .service('authService', AuthService)
  .service('paymentsService', PaymentsService)
  .service('stripeService', StripeService)
  .service('paddleService', PaddleService)
  .service('databaseService', DatabaseService)
  .service('productsService', ProductsService)
  .service('remoteStorageService', RemoteStorageService)
  .service('myVolumioDevicesService', MyVolumioDevicesService)
  .service('firebaseApiFunctionsService',FirebaseApiFunctionsService)


.provider('themeManager', ThemeManagerProvider)


  .provider('themeManager', ThemeManagerProvider)

  // Components
  .directive('playerButtons', (themeManager) => new PlayerButtonsDirective(themeManager))
  .directive('volumeManager', (themeManager) => new VolumeManagerDirective(themeManager))
  .directive('trackManager', (themeManager, $log) => new TrackManagerDirective(themeManager, $log))
  .directive('trackInfo', (themeManager) => new TrackInfoDirective(themeManager))
  .directive('playerStatus', () => new PlayerStatusDirective())
  .directive('sideMenu', () => new SideMenuDirective())
  .directive('audioOutputs', () => new AudioOutputsDirective())
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
  .directive('trackActionsBtn', (themeManager) => new TrackActionsBtnDirective(themeManager))
  .directive('lightSwitchBtn', (themeManager) => new LightSwitchBtnDirective(themeManager))

  // Volumio 3 UI Directives
  .directive('mainMenu', (themeManager) => new MainMenuDirective(themeManager))
  .directive('onCloudActions', (themeManager) => new OnCloudActionsDirective(themeManager))
  .directive('playerSeekbar', (themeManager) => new PlayerSeekbarDirective(themeManager))

  //MyVolumio Directives
  .directive('stripePayButton', () => new StripePayButtonDirective())
  .directive('paddlePayButton', () => new PaddlePayButtonDirective())
  .directive('myVolumioUserCard', () => new MyVolumioCardDirective())
  .directive('myVolumioBackButton', () => new MyVolumioBackButtonDirective())
  .directive('myVolumioAlreadyLogged', () => new MyVolumioAlreadyLoggedDirective())
  .directive('myVolumioCurrentPlanCard', () => new MyVolumioCurrentPlanCardDirective())
  .directive('myVolumioFileOnChange', () => new MyVolumioFileOnChangeDirective())
  .directive('myVolumioAvatarImage', () => new MyVolumioAvatarImageDirective())
  .directive('myVolumioPlanCard', () => new MyVolumioPlanCardDirective())
  .directive('myVolumioVerificationCard', () => new MyVolumioVerificationCardDirective())
  .directive('myVolumioDeviceSelector', () => new MyVolumioDeviceSelectorDirective())

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
  .controller('BrowseMusicController', BrowseMusicController)
  .controller('PlaybackController', PlaybackController)
  .controller('PlayQueueController', PlayQueueController)

  .controller('WizardController', WizardController)

  .controller('ModalController', ModalController)
  .controller('ModalPlaylistController', ModalPlaylistController)
  .controller('ModalArtistDetailsController', ModalArtistDetailsController)
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
  .controller('MyVolumioTermsModalController', MyVolumioTermsModalController)
  .controller('MyVolumioPayingModalController', MyVolumioPayingModalController)
  .controller('WifiPluginController',  WifiPluginController)
  .controller('NetworkStatusPluginController', NetworkStatusPluginController)
  .controller('MyMusicPluginController', MyMusicPluginController)
  .controller('NetworkDrivesPluginController', NetworkDrivesPluginController)
  .controller('SystemVersionPluginController', SystemVersionPluginController)
  .controller('FirmwareUploadPluginController', FirmwareUploadPluginController)
  .controller('UiSettingsPluginController', UiSettingsPluginController)
  .controller('MyMusicPluginEnablerController', MyMusicPluginEnablerController)

  //Volumio 3 UI

  .controller('HomeController', HomeController)
  .controller('SettingsController', SettingsController)


  //MyVolumio
  .controller('MyVolumioLoginController', MyVolumioLoginController)
  .controller('MyVolumioSignupController', MyVolumioSignupController)
  .controller('MyVolumioSignupNewController', MyVolumioSignupNewController)
  .controller('MyVolumioPremiumStreamingController', MyVolumioPremiumStreamingController)
  .controller('MyVolumioProfileController', MyVolumioProfileController)
  .controller('MyVolumioPlansController', MyVolumioPlansController)
  .controller('MyVolumioSubscribeController', MyVolumioSubscribeController)
  .controller('MyVolumioPaymentSuccessController', MyVolumioPaymentSuccessController)
  .controller('MyVolumioPaymentFailController', MyVolumioPaymentFailController)
  .controller('MyVolumioRecoverPasswordController', MyVolumioRecoverPasswordController)
  .controller('MyVolumioEditProfileController', MyVolumioEditProfileController)
  .controller('MyVolumioVerifyUserController', MyVolumioVerifyUserController)
  .controller('MyVolumioCancelSubscriptionController', MyVolumioCancelSubscriptionController)
  .controller('MyVolumioChangeSubscriptionController', MyVolumioChangeSubscriptionController)
  .controller('MyVolumioCloudSelectDeviceController', MyVolumioCloudSelectDeviceController)
  .controller('MyVolumioAccessController', MyVolumioAccessController);
