class CustomTranslationController{
  constructor($scope, $rootScope, socketService, mockService, $log, $translate) {
    'ngInject';
    this.socketService = socketService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    this.allLanguages;
    this.init();
    this.value = {
        value: "it",
        label: "italiano"
    };
    this.translationLanguage = '';
  }

  init(){
    this.showPlugin = false;
    this.registerListner();
    this.initService();
  }

  registerListner(){
    let self = this;
    self.socketService.on('pushAllLanguages', function (data)
    {
      self.allLanguages = data.languages;
      self.showPlugin = true;
    });

    self.socketService.on('pushPercentage', function (data)
    {
      self.percentageTranslated = data;
      console.log("Percentuale tradotta =", self.percentageTranslated);
    });
  }

  initService() {
    this.socketService.emit('getAllLanguages');
  }

  test(){
    let self = this;

    console.log("funzione test è stata lanciata");

  }

  onChange(language){
    let self = this;
    self.translationLanguage = language.code;
    console.log("language changed in :", language.nativeName);
    console.log("language code :", self.translationLanguage);
  }

  showTranslation(){
    let self = this;
    if(self.translationLanguage !== '' && self.translationLanguage !== undefined){
      var data = {
        translation_language : {
          value : self.translationLanguage
        }
      };
      self.socketService.emit('showTranslations', data);
    } else {
      console.log("Error: Language not selected");
    }
  }
}

export default CustomTranslationController;
