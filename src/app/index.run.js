function runBlock (themeManager, $state, $rootScope) {
  'ngInject';
  themeManager.setPageMetadata();
  $rootScope.state = $state;
  console.log($state);
}

export default runBlock;
