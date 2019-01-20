import ZoneMenuController from "./zone-menu.controller";


class ZoneMenuDirective {
    constructor() {
        'ngInject';
        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/zone-menu/zone-menu.html',
            scope: false,
            controller: ZoneMenuController,
            controllerAs: 'zoneMenu',
            bindToController: true
        };
        return directive;
    }
}

export default ZoneMenuDirective;
