class BrowseScrollManagerDirective {
  constructor(browseService, matchmediaService) {
    'ngInject';
    this.browseService = browseService;
    this.matchmediaService = matchmediaService;

    let directive = {
      restrict: 'A',
      scope: false,
      link: (this.linkFn).bind(this)
    };

    return directive;
  }

  setScrollTop() {
    // $log.debug(this.browseService.scrollPositions);
    let currentFetchRequest = this.browseService.currentFetchRequest;
    if (currentFetchRequest && currentFetchRequest.uri &&
      this.browseService.scrollPositions.get(currentFetchRequest.uri)) {
      // $log.debug('Scroll to', currentFetchRequest.uri,
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
      // $log.debug(browseService.currentFetchRequest.uri, this.scrollTop);
      if (browseService.currentFetchRequest && browseService.currentFetchRequest.uri) {
        browseService.scrollPositions.set(browseService.currentFetchRequest.uri, this.scrollTop);
      } else {
        browseService.scrollPositions.set({}, this.scrollTop);
      }
    }

    setTimeout(() => {
      this.contentWrapper = angular.element('#contentWrapper')[0];
      this.contentWrapper.style.overflowY = 'hidden';
      // $log.debug(contentWrapper);
      this.contentWrapper.scrollTop = 0;

      //Add listener to browseTablesWrapper on scroll
      this.browseTablesWrapper = angular.element('#browseTablesWrapper')[0];
      // this.browseTablesWrapper.scrollTop = 0;
      // $log.debug(this.browseTablesWrapper);
      this.browseTablesWrapper.addEventListener('scroll', scrollHandler);
      setbrowseTablesWrapperHeight();
      this.setScrollTop();
    }, 100);

    let setbrowseTablesWrapperHeight = () => {
      browsePanelHeading = angular.element('#browsePanelHeading')[0];
      footer = angular.element('#footer')[0];
      if (this.browseTablesWrapper && footer && browsePanelHeading) {
        this.browseTablesWrapper.style.height =
            footer.getBoundingClientRect().top -
            browsePanelHeading.getBoundingClientRect().bottom + 'px';
      }
    };

    scope.$on('browseController:listRendered', () => {
      if (this.browseTablesWrapper) {
        this.browseTablesWrapper.removeEventListener('scroll', scrollHandler);
        setTimeout(() => {
          this.setScrollTop();
          this.browseTablesWrapper.addEventListener('scroll', scrollHandler);
        }, 100);
      }
    });

    scope.$on('$destroy', () => {
      this.browseTablesWrapper.removeEventListener('scroll', scrollHandler);
      this.contentWrapper.style.overflowY = 'auto';
    });

    this.matchmediaService.onPortrait((data) => {
      setTimeout(function () {
        setbrowseTablesWrapperHeight();
      }, 50);
    });
  }
}


export default BrowseScrollManagerDirective;
