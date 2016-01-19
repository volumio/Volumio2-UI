class BrowseScrollManagerDirective {
  constructor(browseService) {
    'ngInject';
    this.browseService = browseService;

    let directive = {
      restrict: 'A',
      scope: false,
      link: (this.linkFn).bind(this)
    };

    return directive;
  }

  linkFn(scope) {
    let contentWrapper, browseTablesWrapper, browsePanelHeading, footer;
    setTimeout(() => {
      contentWrapper = angular.element('#contentWrapper')[0];
      contentWrapper.style.overflowY = 'hidden';
      // console.log(contentWrapper);
      contentWrapper.scrollTop = 0;
      browseTablesWrapper = angular.element('#browseTablesWrapper')[0];
      browsePanelHeading = angular.element('#browsePanelHeading')[0];
      footer = angular.element('#footer')[0];
      browseTablesWrapper.style.height =
          footer.getBoundingClientRect().bottom - footer.getBoundingClientRect().height -
          browsePanelHeading.getBoundingClientRect().bottom + 'px';
      if (this.browseService.scrollTop) {
        console.log(this.browseService.scrollTop);
        browseTablesWrapper.scrollTop = this.browseService.scrollTop;
      }
    }, 120);

    scope.$on('$destroy', () => {
      this.browseService.scrollTop = browseTablesWrapper.scrollTop;
      contentWrapper.style.overflowY = 'auto';
    });
  }
}


export default BrowseScrollManagerDirective;
