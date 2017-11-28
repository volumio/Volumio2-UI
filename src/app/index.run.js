function runBlock(themeManager, $state, $rootScope) {
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
      $state.go("volumio.auth.login");
      return;
    }
    if (error === "NO_SOCKET_ENDPOINTS") {
      //$state.go("volumio.login");
      alert('yahhh');
      return;
    }
    $state.go("volumio.browse");
  });
}

export default runBlock;
