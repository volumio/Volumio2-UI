class HeaderController {
  constructor(matchmediaService, socketService, uiSettingsService, $scope, themeManager, $state, authService) {
    'ngInject';
    this.matchmediaService = matchmediaService;
    this.themeManager = themeManager;
    this.uiSettingsService = uiSettingsService;
    this.isSocketReady = false;
    this.authService = authService;
    this.$state = $state;
    this.language = {};
    this.languages = [{
      "value": "ca",
      "label": "Català"
    },
    {
      "value": "cs",
      "label": "Česky"
    },
    {
      "value": "da",
      "label": "Dansk"
    },
    {
      "value": "de",
      "label": "Deutsch"
    },
    {
      "value": "en",
      "label": "English"
    },
    {
      "value": "es",
      "label": "Español"
    },
    {
      "value": "fr",
      "label": "Français"
    },
    {
      "value": "gr",
      "label": "ελληνικά"
    },
    {
      "value": "hr",
      "label": "Croatian"
    },
    {
      "value": "it",
      "label": "Italiano"
    },
    {
      "value": "ja",
      "label": "日本語"
    },
    {
      "value": "ko",
      "label": "한국어"
    },
    {
      "value": "hu",
      "label": "Magyar"
    },
    {
      "value": "nl",
      "label": "Nederlands"
    },
    {
      "value": "no",
      "label": "Norsk"
    },
    {
      "value": "pl",
      "label": "Polski"
    },
    {
      "value": "pt",
      "label": "Português"
    },
    {
      "value": "ru",
      "label": "Русский"
    },
    {
      "value": "sk",
      "label": "Slovensky"
    },
    {
      "value": "fi",
      "label": "Suomi"
    },
    {
      "value": "sv",
      "label": "Svenska"
    },
    {
      "value": "tr",
      "label": "Türkçe"
    },
    {
      "value": "ua",
      "label": "Українська"
    },
    {
      "value": "vi",
      "label": "Tiếng Việt"
    },
    {
      "value": "zh",
      "label": "简体中文"
    },
    {
      "value": "zh_TW",
      "label": "繁體中文"
    }
  ];
    if (!socketService.host) {
      this.setDefaultLanguage();
    }
    $scope.$watch(() => socketService.host, () => {
      if (socketService.host) {
        this.isSocketReady = true;
      } else {
        this.isSocketReady = false;
      }
    });
  }

  setDefaultLanguage() {
    const browserDefaultLanguage = this.uiSettingsService.getBrowserDefaultLanguage();
    const defaultLanguageModel = this.languages.find(item => item.value === browserDefaultLanguage);
    if (defaultLanguageModel) {
      this.language = defaultLanguageModel;
    }
  }

  changeLanguage() {
    this.uiSettingsService.setLanguage(this.language.value);
  }

  logout() {
    this.$state.go("myvolumio.logout");
  }
}

export default HeaderController;
