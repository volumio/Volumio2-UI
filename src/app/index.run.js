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
    if (error === "MYVOLUMIO_NO_ALIVE_DEVICES") {
      //$state.go("myvolumio.login");
      alert("YAA");
      return;
    }
    $state.go("volumio.browse");
  });
}

export default runBlock;
