export default class PlayerSeekbarDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('player-seekbar', 'components/player-seekbar'),
      scope: {},
      controller: playerSeekBarController,
      controllerAs: 'playerSeekBar',
      bindToController: true
    };
    return directive;
  }
}

class playerSeekBarController {
  constructor(playerService, $timeout, matchmediaService) {
    'ngInject';
    this.playerService = playerService;
    this.$timeout = $timeout;
    this.matchmedia = matchmediaService;

    this.timeoutHandler = null;

    this.inited = false;

    this.seekPercent = this.playerService.seekPercent;
    this.init();
  }

  init(){
    this.inited = true;
  }

  set seekPercent(val){
    if(!this.inited){
      //avoid setting seek value from view model before init complete
      return;
    }
    this.playerService.seekPercent = val;
    this.setSeek(this.playerService.seekPercent);
  }

  get seekPercent(){
    return this.playerService.seekPercent;
  }

  setSeek(progress){
    this.$timeout.cancel(this.timeoutHandler);
    this.timeoutHandler = this.$timeout(() => {
      if ( this.playerService.state !== undefined && this.playerService.state !== null && !this.playerService.state.disableUi ) {
        this.playerService.stopSeek();
        this.playerService.seek = progress;
      }
    }, 200, false);
  }

  getElapsed() {
    let elapsedTime = this.playerService.elapsedTime;
    return this.momentToString(elapsedTime);
  }

  getDuration(){
    if(!this.playerService.state || !this.playerService.state.duration){
      return null;
    }
    return this.momentToString(this.playerService.state.duration * 1000);
  }

  momentToString(time){
    let momentDuration = moment.duration(time),
      hours = momentDuration.hours(),
      minutes = momentDuration.minutes(),
      seconds = momentDuration.seconds();
    minutes += hours*60;
    let momentString = minutes + ':' +
                            ((seconds < 10) ? ('0' + seconds) : seconds);
    return momentString;
  }

}
