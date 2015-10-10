class ModalService {
  constructor ($modal) {
    'ngInject';
    this.$modal = $modal;
  }
  openModal(
      controller = 'ModalController',
      templateUrl = 'app/components/modal/default-modal.html',
      dataObj = null,
      size = 'sm') {
    let modalInstance = this.$modal.open({
      animation: true,
      templateUrl: templateUrl,
      controller: controller,
      controllerAs: 'modal',
      size: size,
      resolve: {
        dataObj: () => dataObj
      }
    });

    modalInstance.result.then(function() {
    }, function() {
      //console.info('Modal dismissed at: ' + new Date());
    });
  }


}

export default ModalService;
