function runBlock (themeManager, $state, $rootScope, cloudService) {
  'ngInject';
  themeManager.setPageMetadata();
  $rootScope.state = $state;

  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    event.preventDefault();

    if (error === "MYVOLUMIO_NOT_ENABLED") {
      $state.go("volumio.browse");
      return;
    } else if (error === "MYVOLUMIO_REQUIRED") {
      $state.go("myvolumio.access");
      return;
    } else if (error === "AUTH_REQUIRED") {
      $state.go("myvolumio.access");
      return;
    } else if (error === "NO_SOCKET_ENDPOINTS" && cloudService.isOnCloud) {
      $state.go("myvolumio.access");
      return;
    } else if (error === "MYVOLUMIO_USER_ALREADY_LOGGED") {
      $state.go('myvolumio.profile');
      return;
    }

  });

}

export default runBlock;
