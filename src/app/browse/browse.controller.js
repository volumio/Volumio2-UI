class BrowseController {
  constructor (browseService) {
    'ngInject';
    this.browseService = browseService;
  }

  fetchLibrary(item) {
    this.browseService.fetchLibrary(item);
  }
}

export default BrowseController;
