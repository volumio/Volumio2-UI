class ModalCreditsDetailsController {
    constructor($uibModalInstance, dataObj, socketService, $http, modalService, $state) {
      'ngInject';
      this.$uibModalInstance = $uibModalInstance;
      this.dataObj = dataObj;
      this.socketService = socketService;
      this.$http = $http;
      this.modalService = modalService;
      this.$state = $state;
      this.loadingCredit = {};
      this.unavailableCredits = {};
      this.creditRequestOptions = {"timeout":7000};
    }

    cancel() {
      this.$uibModalInstance.dismiss('cancel');
    }

    goToUpgrade() {
      this.$uibModalInstance.dismiss('cancel');
      this.modalService.closeAllModals();
      this.$state.go('myvolumio.plans');
    }

    /* showCreditLink(uri, title) {
      angular.element('#browse-page').scope().browse.showCreditLink(uri, title);
    } */

    showCreditLink(uri, title, $index) {
      let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
      let metaObject = {
        'endpoint': 'metavolumio',
        'data': {}
      };
      if (uri.indexOf('mbid:/artist/') > -1) {
        metaObject.data.mbid = uri.replace('mbid:/artist/', '');
        metaObject.data.mode = 'storyArtist';
        this.loadingCredit[uri + $index] = true;
      } else if (uri.indexOf('mbid:/place/') > -1) {
        metaObject.data.mbid = uri.replace('mbid:/place/', '');
        metaObject.data.mode = 'storyPlace';
        this.loadingCredit[uri + $index] = true;
      } else if (uri.indexOf('mbid:/label/') > -1) {
        metaObject.data.mbid = uri.replace('mbid:/label/', '');
        metaObject.data.mode = 'storyLabel';
        this.loadingCredit[uri + $index] = true;
      } else {
        return;
      }

      return this.$http.post(mataVolumioUrl, metaObject, this.creditRequestOptions).then((response) => {
        if (response.data && response.data.success && response.data.data && response.data.data.value) {
          this.loadingCredit[uri + $index] = false;
          return this.showCreditsDetails({'title': title, 'story': response.data.data.value});
        } else {
          this.unavailableCredits[uri + $index] = true;
        }
        this.loadingCredit[uri + $index] = false;
      });
    }

    showCreditsDetails(details) {
      const templateUrl = 'app/browse-music/components/modal/modal-credits-details.html';
      const controller = 'ModalCreditsDetailsController';
      const params = {
        title: details.title,
        story: details.story,
        credits: details.credits
      };
      this.modalService.openModal(
        controller,
        templateUrl,
        params,
        'md'
      );
    }

    hasCreditLink(uri) {
        if ((uri.indexOf('mbid:/artist/') > -1) ||
           (uri.indexOf('mbid:/label/') > -1) ||
           (uri.indexOf('mbid:/place/') > -1))
        {
          return true;
        } else {
          return false;
        }
    }
  }

  export default ModalCreditsDetailsController;
