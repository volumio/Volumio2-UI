class AudioOutputsController {
  constructor($log, audioOutputsService, socketService) {
    "ngInject";
    this.audioOutputsService = audioOutputsService;
    this.socketService = socketService;
    this.$log = $log;

    this.menuVisible = false;
    this.outputs = [];
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  isMultiOutputsAvailable() {
    if (this.audioOutputsService.outputs && this.audioOutputsService.outputs.length > 1) {
      return true;
    } else {
      return false;
    }
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
    this.socketService.host = device.host;
  }
}

export default AudioOutputsController;
