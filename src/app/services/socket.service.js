class SocketService {
  constructor($rootScope, $http, $window, $log, cfpLoadingBar) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$window = $window;
    this.$log = $log;
    this.loadingBar = cfpLoadingBar;
    this.loadingBarEnabled = true;

    this._host = null;
    this.hosts = {};

    // List of events to trigger the loading bar.
    // Each request event should have at least 1 response event
    this.loadingBarRequestEvents = [
      'browseLibrary',
      'search',
      'goTo',
      'GetTrackInfo',
      'createPlaylist',
      'listPlaylist',
      'addToPlaylist',
      'playPlaylist',
      'enqueue',
      'addToFavourites',
      'playFavourites',
      'addToRadioFavourites',
      'removeFromRadioFavourites',
      'playRadioFavourites',
      'getSleep',
      'getAlarms',
      'saveAlarm',
      'setMultiroom',
      'getWirelessNetworks',
      'getInfoNetwork'
    ];

    this.loadingBarResponseEvents = [
      'pushBrowseLibrary',
      'pushGetTrackInfo',
      'pushCreatePlaylist',
      'pushListPlaylist',
      'pushAddToPlaylist',
      'pushPlayPlaylist',
      'pushEnqueue',
      'urifavourites',
      'pushPlayFavourites',
      'pushAddToRadioFavourites',
      'pushRemoveFromRadioFavourites',
      'pushPlayRadioFavourites',
      'pushSleep',
      'pushAlarm',
      'pushSleep',
      'pushMultiroom',
      'pushWirelessNetworks',
      'pushInfoNetwork',
      'pushToastMessage'
    ];
  }

  isSocketAvalaible() {
    return this._host !== null;
  }

  changeHost(host) {
    if (this.$window.socket) {
      this.$window.socket.disconnect();
      this.$window.socket.removeAllListeners();
    }
    this.$window.socket = io(this.host, {timeout: 500});
    this.$window.socket.connect();
    this.$window.socket.on('connect_error', () => {
      this.$log.debug(`Socket connect_error for host ${this.host}`);
      this._connectToNextHost();
    });
    this.$window.socket.on('connect_timeout', () => {
      this.$log.debug(`Socket connect_timeout for host ${this.host}`);
      this._connectToNextHost();
    });
    this.$rootScope.$emit('socket:init');
  }

  _connectToNextHost() {
    const hostKeys = Object.keys(this.hosts);
    if (hostKeys.length > 1) {
      let currentHostIndex = hostKeys.findIndex(host => {
        return this.hosts[host] === this.host;
      });
      if (++currentHostIndex >= hostKeys.length) {
        currentHostIndex = 0;
      }
      const newHost = this.hosts[hostKeys[currentHostIndex]];
      this.$log.info(`Try to connect to host: ${hostKeys[currentHostIndex]}: ${newHost}`);
      this.host = newHost;
    }
  }

  get isConnected() {
    return this.$window.socket.connected;
  }

  on(eventName, callback) {
    // this.$log.debug('on', eventName);
    return this.$window.socket.on(eventName, (data) => {
      //this.$log.debug(arguments);
      //this.$log.debug(data);
      this.stopLoadingBar(eventName);
      this.$rootScope.$apply(function() {
        if (callback) {
          //this.$log.debug(data);
          //callback.apply(socket, data);
          callback(data);
        }
      });
    });
  }

  off(eventName, fn) {
    // this.$log.debug('off', eventName);
    this.$window.socket.off(eventName, fn);
  }

  emit(eventName, data, callback) {
    //this.$log.debug('emit', eventName);
    this.startLoadingBar(eventName);
    this.$window.socket.emit(eventName, data, (data) => {
      //let arg = arguments;
      this.$rootScope.$apply(function() {
        if (callback) {
          //callback.apply(socket, arg);
          callback(data);
        }
      });
    });
  }

  connect(callback) {
    this.$window.socket.on('connect', () => {
      this.$log.debug(`Socket connected to ${this.host}`);
      callback();
    });
  }

  reconnect(callback) {
    this.$window.socket.on('reconnect', () => {
      this.$log.debug('Socket reconnect');
      this.$rootScope.$emit('socket:reconnect');
      callback();
    });
  }

  disconnect(callback) {
    this.$window.socket.on('disconnect', (socket) => {
      this.$log.debug('Socket disconnect');
      callback(socket);
    });
  }

  startLoadingBar(eventName) {
    if (this.loadingBarEnabled && this.loadingBarRequestEvents.includes(eventName)) {
      this.loadingBar.start();
    }
  }

  stopLoadingBar(eventName) {
    if (this.loadingBarResponseEvents.includes(eventName)) {
      this.loadingBar.complete();
    }
  }

  set host(host) {
    this._host = host;
    this.changeHost(host);
    this.$log.debug(`New host: ${this._host}`);
  }

  get host() {
    return this._host;
  }
}

export default SocketService;
