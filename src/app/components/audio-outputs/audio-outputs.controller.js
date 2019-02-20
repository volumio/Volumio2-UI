class AudioOutputsController {
  constructor($log, audioOutputsService) {
    "ngInject";
    this.audioOutputsService = audioOutputsService;
    this.$log = $log;

    this.menuVisible = false;
    this.outputs = [];
  }

  /* Manage the UI state here */
  itemClick(item) {
    // this.$log.debug('Clicked on', item);
    // Implement method here
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
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
}

export default AudioOutputsController;
