class FooterController {
  constructor(matchmediaService, socketService) {
    'ngInject';
    this.matchmediaService = matchmediaService;
    this.isSocketReady = false;

    if(socketService.host) {
      this.isSocketReady = true;
    }
  }
}

export default FooterController;
