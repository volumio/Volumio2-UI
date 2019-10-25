import AudioOutputsController from "./audio-outputs.controller";


class AudioOutputsDirective {
    constructor() {
        'ngInject';
        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/audio-outputs/audio-outputs.html',
            scope: false,
            controller: AudioOutputsController,
            controllerAs: 'audioOutputs',
            bindToController: true
        };
        return directive;
    }
}

export default AudioOutputsDirective;
