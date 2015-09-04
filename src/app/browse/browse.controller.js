class BrowseController {
  constructor (browseService, playQueueService) {
    'ngInject';
    this.browseService = browseService;
    this.playQueueService = playQueueService;
  }

  fetchLibrary(item) {
    this.browseService.fetchLibrary(item);
  }

  addToQueue(item) {
    this.playQueueService.add(item);
  }
}

export default BrowseController;
