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
  constructor(playerService, $timeout) {
    'ngInject';
    this.playerService = playerService;
    this.$timeout = $timeout;

    this.timeoutHandler = null;

    this.seekPercent = this.playerService.seekPercent;
    this.init();
  }

  init(){
    
  }

  set seekPercent(val){
    this.playerService.seekPercent = val;
    this.setSeek(this.playerService.seekPercent);
  }

  get seekPercent(){
    return this.playerService.seekPercent;
  }

  getTooltipValue(data) {
    //let duration = this.playerService.state.duration;
    let elapsedTime = this.playerService.elapsedTime;
    let momentDuration = moment.duration(elapsedTime),
      hours = momentDuration.hours(),
      minutes = momentDuration.minutes(),
      seconds = momentDuration.seconds();
    minutes += hours*60;
    let momentString = minutes + ':' +
                             ((seconds < 10) ? ('0' + seconds) : seconds);
    return momentString;
  }

  setSeek(progress){
    this.$timeout.cancel(this.timeoutHandler);
    this.timeoutHandler = this.$timeout(() => {
      if (!this.playerService.state.disableUi) {
        this.playerService.stopSeek();
        this.playerService.seek = progress;
      }
    }, 200, false);
  }

  log(ut){
    console.log('log',ut);
  }

}
