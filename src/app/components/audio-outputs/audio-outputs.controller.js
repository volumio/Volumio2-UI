class AudioOutputsController {
  constructor($log, audioOutputsService, socketService, playerService) {
    "ngInject";
    this.audioOutputsService = audioOutputsService;
    this.socketService = socketService;
    this.playerService = playerService;
    this.$log = $log;

    this.menuVisible = false;
    this.outputs = [];

    this.defaultView = true;
    this.groupView = false;
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  isMultiOutputsAvailable() {
    // TODO - MULTIROOM FIX AFTER DONE
    // console.log(this.audioOutputsService.outputs);
    // console.log(this.audioOutputsService.multiRoomDevices);

    return true;
    /* if (this.audioOutputsService.outputs && this.audioOutputsService.outputs.length > 1) {
      return true;
    } else {
      return false;
    } */
  }

  toggleAudioOutput(id, enabled) {
    if (enabled === true) {
      this.audioOutputsService.disableAudioOutput(id);
    } else {
      this.audioOutputsService.enableAudioOutput(id);
    }
  }

  showArtistAndTitle(artist, title, type) {
    var text = "";
    if (artist && title) {
      text = artist + " - " + title;
      return text;
    } else {
      if (title) {
        return title;
      } else {
        return type;
      }
    }
  }

  onDeviceVolumeChange(id, level) {
    const volume = parseInt(level);
    this.audioOutputsService.onDeviceVolumeChange(id, volume);
  }

  onDeviceClick(device) {
    if (device.host) {
      this.socketService.host = device.host;
    }
  }

  toggleView() {
    this.defaultView = !this.defaultView;
    this.groupView = !this.groupView;
  }
}

export default AudioOutputsController;
