class VolumeManagerDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/volume-manager/volume-manager.html',
      scope: false,
      controller: VolumeManagerController,
      controllerAs: 'volumeManager',
      bindToController: true
    };

    return directive;
  }
}

class VolumeManagerController {
  constructor (playerService) {
    'ngInject';
    this.playerService = playerService;
    this.knobData = 45;
    this.knobOptions = {
    };
  }
}

export default VolumeManagerDirective;
