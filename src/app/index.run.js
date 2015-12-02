function runBlock (themeManager, $state, $rootScope) {
  'ngInject';
  themeManager.setPageMetadata();
  $rootScope.state = $state;
}

export default runBlock;
