class TrackManagerDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/track-manager/track-manager.html',
      scope: false,
      controller: TrackManagerController,
      controllerAs: 'trackManager',
      bindToController: true
    };

    return directive;
  }
}

class TrackManagerController {
  constructor (playerService) {
    'ngInject';
    this.playerService = playerService;

    this.seek = 30;
    this.knobOptions = {
      min:0,
      max:101,
      fgColor:'#FF0000',
      width: 120,
      height: 120,
      displayInput: false,
      step: 1,
      angleOffset: -125,
      angleArc: 250
    };
  }
}

export default TrackManagerDirective;
