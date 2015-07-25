class VolumioController {
  constructor (socketService) {
    'ngInject';
    this.socketService = socketService;
    console.log('im Volumio controller');
  }
}

export default VolumioController;
