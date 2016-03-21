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

  setScrollTop() {
    // console.log(this.browseService.scrollPositions);
    let currentFetchRequest = this.browseService.currentFetchRequest;
    if (currentFetchRequest && currentFetchRequest.uri &&
      this.browseService.scrollPositions.get(currentFetchRequest.uri)) {
      // console.log('Scroll to', currentFetchRequest.uri,
      //     this.browseService.scrollPositions.get(currentFetchRequest.uri));
      this.browseTablesWrapper.scrollTop = this.browseService.scrollPositions.get(currentFetchRequest.uri);
    } else {
      this.browseTablesWrapper.scrollTop = 0;
    }
  }

  linkFn(scope) {
    let contentWrapper, browseTablesWrapper, browsePanelHeading, footer;

    let browseService = this.browseService;
    function scrollHandler() {
      /*jshint validthis:true */
      // console.log(browseService.currentFetchRequest.uri, this.scrollTop);
      browseService.scrollPositions.set(browseService.currentFetchRequest.uri, this.scrollTop);
    }

    setTimeout(() => {
      this.contentWrapper = angular.element('#contentWrapper')[0];
      this.contentWrapper.style.overflowY = 'hidden';
      // console.log(contentWrapper);
      this.contentWrapper.scrollTop = 0;

      //Add listener to browseTablesWrapper on scroll
      this.browseTablesWrapper = angular.element('#browseTablesWrapper')[0];
      // this.browseTablesWrapper.scrollTop = 0;
      // console.log(this.browseTablesWrapper);
      this.browseTablesWrapper.addEventListener('scroll', scrollHandler);

      browsePanelHeading = angular.element('#browsePanelHeading')[0];
      footer = angular.element('#footer')[0];
      this.browseTablesWrapper.style.height =
          footer.getBoundingClientRect().bottom - footer.getBoundingClientRect().height -
          browsePanelHeading.getBoundingClientRect().bottom + 'px';
      this.setScrollTop();
    }, 100);

    scope.$on('browseController:listRendered', () => {
      this.browseTablesWrapper.removeEventListener('scroll', scrollHandler);
      setTimeout(() => {
        this.setScrollTop();
        this.browseTablesWrapper.addEventListener('scroll', scrollHandler);
      }, 100);
    });

    scope.$on('$destroy', () => {
      this.browseTablesWrapper.removeEventListener('scroll', scrollHandler);
      this.contentWrapper.style.overflowY = 'auto';
    });
  }
}


export default BrowseScrollManagerDirective;
