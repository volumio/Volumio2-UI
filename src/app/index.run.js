function runBlock (themeManager, $state, $rootScope) {
  'ngInject';
  themeManager.setPageMetadata();
  $rootScope.state = $state;
  
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    console.log("ROUTE ERROR");
    console.log(error);
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("volumio.auth.login");
    }
  });
}

export default runBlock;
