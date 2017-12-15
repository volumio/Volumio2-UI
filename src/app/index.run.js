function runBlock(themeManager, $state, $rootScope, cloudService) {
  'ngInject';
  themeManager.setPageMetadata();
  $rootScope.state = $state;

  $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
    event.preventDefault();

    console.log("ROUTE ERROR");
    console.log(error);

    if (error === "AUTH_NOT_ENABLED") {
      $state.go("volumio.browse");
      return;
    }
    if (error === "AUTH_REQUIRED") {
      $state.go("myvolumio.login");
      return;
    }
    if (error === "NO_SOCKET_ENDPOINTS"  && cloudService.isOnCloud ) {
      console.log("CATCH NO SOK END");
      $state.go("myvolumio.login");
      return;
    }

    $state.go("volumio.browse");
  });

}

export default runBlock;
