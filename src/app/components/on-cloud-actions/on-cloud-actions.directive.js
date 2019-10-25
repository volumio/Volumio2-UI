class OnCloudActionsDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('on-cloud-actions', 'components/on-cloud-actions'),
      scope: false,
      controller: OnCloudActionsController,
      controllerAs: 'OnCloudActions',
      bindToController: true
    };
    return directive;
  }
}

class OnCloudActionsController {
  constructor() {
    'ngInject';
    
    
  }
}

export default OnCloudActionsDirective;