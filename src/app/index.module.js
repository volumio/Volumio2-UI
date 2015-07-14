// global malarkey:false, toastr:false, moment:false */
import config from './index.config';


import routerConfig from './index.route';
import runBlock from './index.run';


// Services
import PlayerService from './services/player.service';
import PlayQueue from './services/play.queue.service';
//import PlaylistService from './services/playlist.service';
import SocketService from './services/socket.service';

// Components
import PlayerButtonsDirective from './components/player-buttons/player-buttons.directive';
import VolumeManagerDirective from './components/volume-manager/volume-manager.directive';
import TrackManagerDirective from './components/track-manager/track-manager.directive';
import PlayerStatusDirective from './components/player-status/player-status.directive';
import PlayerLoggerDirective from './components/player-logger/player-logger.directive';

// Controllers
import VolumioController from './volumio/volumio.controller';

import HeaderController from './header/header.controller';
import FooterController from './footer/footer.controller';


import BrowseController from './browse/browse.controller';
import PlaybackController from './playback/playback.controller';
import PlaylistController from './playlist/playlist.controller';

// import MainController from './main/main.controller';
// import GithubContributorService from '../app/components/githubContributor/githubContributor.service';
// import WebDevTecService from '../app/components/webDevTec/webDevTec.service';
// import NavbarDirective from '../app/components/navbar/navbar.directive';
// import MalarkeyDirective from '../app/components/malarkey/malarkey.directive';

angular.module('volumio', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap'])
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
  .service('player', PlayerService)
  //.service('playlist', PlaylistService)
  .service('playQueue', PlayQueue)

  .directive('playerButtons', () => new PlayerButtonsDirective())
  .directive('volumeManager', () => new VolumeManagerDirective())
  .directive('trackManager', () => new TrackManagerDirective())
  .directive('playerStatus', () => new PlayerStatusDirective())
  .directive('playerLogger', () => new PlayerLoggerDirective())

  .controller('HeaderController', HeaderController)
  .controller('VolumioController', VolumioController)
  .controller('FooterController', FooterController)

  .controller('BrowseController', BrowseController)
  .controller('PlaybackController', PlaybackController)
  .controller('PlaylistController', PlaylistController)

  ;
