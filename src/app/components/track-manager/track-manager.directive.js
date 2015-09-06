class TrackManagerDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/track-manager/slider-track-manager.html',
      scope: false,
      link: linkFunc,
      controller: TrackManagerController,
      controllerAs: 'trackManager',
      bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, vm) {
      setTimeout(() => {
        let test = el.find('.slider-handle');
        test[0].addEventListener('mousedown', () => {
              console.log('down');
              vm.playerService.stopSeek();
            }, true);
        test[0].addEventListener('mouseup', () => {
              console.log('up', vm.playerService.seekPercent);
              vm.playerService.seek = vm.playerService.seekPercent;
            }, true);
      });
    }
  }
}

class TrackManagerController {
  constructor ($element, playerService, $window) {
    'ngInject';
    this.playerService = playerService;

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
