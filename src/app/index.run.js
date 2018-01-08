function runBlock(themeManager, $state, $rootScope, cloudService) {
  'ngInject';
  themeManager.setPageMetadata();
  $rootScope.state = $state;

  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    event.preventDefault();

    console.log("OnRouteCanLoad ERROR");
    console.log(error);

    if (error === "MYVOLUMIO_NOT_ENABLED") {
      $state.go("volumio.browse");
      return;
    }
    if (error === "MYVOLUMIO_REQUIRED") {
      $state.go("myvolumio.login");
      return;
    }
    if (error === "AUTH_REQUIRED") {
      $state.go("myvolumio.login");
      return;
    }
    if (error === "NO_SOCKET_ENDPOINTS" && cloudService.isOnCloud) {
      $state.go("myvolumio.login");
      return;
    }

  });

}

export default runBlock;