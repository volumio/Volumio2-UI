class BrowseController {
  constructor (browseService, playQueueService, $window) {
    'ngInject';
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.lastItemMenuOpened = null;
    // $window.document.find('.toggleItemMenu').addEventListener('cklick', () => {
    //   console.log('asd');
    // })
  }

  fetchLibrary(item) {
    this.browseService.fetchLibrary(item);
  }

  addToQueue(item) {
    this.playQueueService.add(item);
  }

  dblClickListItem(item, event) {
    if (event.target.tagName === 'TD') {
      if (item.type === 'song') {
        this.addToQueue(item);
      } else {
        this.fetchLibrary(item);
      }
    }
  }

  preventDoubleClick(event) {
    // console.log(event);
    // event.preventDefault();
    // event.stopPropagation();
  }

  toggleItemMenu(item, event) {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    if (this.lastItemMenuOpened && this.lastItemMenuOpened.uri !== item.uri) {
      this.lastItemMenuOpened.itemMenuVisible = false;
    }
    item.itemMenuVisible = !!!item.itemMenuVisible;
    this.lastItemMenuOpened = item;
  }
}

export default BrowseController;
