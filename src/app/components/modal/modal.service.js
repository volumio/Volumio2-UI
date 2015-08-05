class ModalService {
  constructor ($modal) {
    'ngInject';
    this.$modal = $modal;
  }

  openModal(type, dataObj) {
    let templateUrl;
    switch (type) {
      case 'default':
        templateUrl = 'app/components/modal/default-modal.html';
        break;
    }
    let modalInstance = this.$modal.open({
      animation: true,
      templateUrl: templateUrl,
      controller: 'ModalController',
      controllerAs: 'modal',
      size: 'sm',
      resolve: {
        dataObj: () => dataObj
      }
    });

    modalInstance.result.then(function () {
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }


}

export default ModalService;
