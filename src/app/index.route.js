function routerConfig(
  $stateProvider,
  $urlRouterProvider,
  $locationProvider,
  themeManagerProvider
) {
  'ngInject';
  console.info(
    '[TEME]: ' + themeManagerProvider.theme,
    '[VARIANT]: ' + themeManagerProvider.variant
  );

  $locationProvider.html5Mode(true);
  $stateProvider
    .state('volumio', {
      url: '/',
      abstract: true,
      views: {
        layout: {
          templateUrl: themeManagerProvider.getHtmlPath('layout'),
          controller: 'LayoutController',
          controllerAs: 'layout'
        },
        'header@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('header'),
          controller: 'HeaderController',
          controllerAs: 'header'
        },
        'footer@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('footer'),
          controller: 'FooterController',
          controllerAs: 'footer'
        }
      },
      resolve: {
        dependenciesResolver: (
          $rootScope,
          ripperService,
          modalListenerService,
          toastMessageService,
          uiSettingsService,
          updaterService
        ) => {
          //NOTE this resolver init global services like toast
          console.log('ROUTE VOLUMIO');
        },
        socketResolver: function($rootScope, deviceEndpointsService, $q, $document) {
          var checking = $q.defer();
          deviceEndpointsService.initSocket().then(isAvalaible => {
            console.log('SOK RES');
            console.log(isAvalaible);
            if (isAvalaible === false) {
              checking.reject('NO_SOCKET_ENDPOINTS'); //this is catched by index.run.js
              return;
            }
            $document[0].body.classList.remove('myVolumioBkg');
            checking.resolve(isAvalaible);
          });
          return checking.promise;
        }
      }
    })

  .state('volumio.browse', {
    url: 'browse',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('browse'),
        controller: 'BrowseController',
        controllerAs: 'browse'
      }
    }
  })

  .state('volumio.play-queue', {
    url: 'queue',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('play-queue'),
        controller: 'PlayQueueController',
        controllerAs: 'playQueue'
      }
    }
  })

  .state('volumio.playback', {
    url: 'playback',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('playback'),
        controller: 'PlaybackController',
        controllerAs: 'playback'
      }
    }
  })

  .state('volumio.debug', {
    url: 'debug',
    views: {
      'content@volumio': {
        templateUrl: 'app/components/debug/volumio-debug.html',
        controller: 'DebugController',
        controllerAs: 'debug'
      }
    }
  })

  .state('volumio.multi-room', {
    url: 'multi-room',
    views: {
      'content@volumio': {
        templateUrl: 'app/themes/axiom/multi-room-manager/axiom-multi-room-manager.html',
        controller: 'MultiRoomManagerController',
        controllerAs: 'multiRoomManager'
      }
    }
  })

  .state('volumio.plugin', {
    url: 'plugin/:pluginName',
    params: { isPluginSettings: null },
    views: {
      'content@volumio': {
        templateUrl: 'app/plugin/plugin.html',
        controller: 'PluginController',
        controllerAs: 'plugin'
      }
    }
  })

  .state('volumio.plugin-manager', {
    url: 'plugin-manager',
    views: {
      'content@volumio': {
        templateUrl: 'app/plugin-manager/plugin-manager.html',
        controller: 'PluginManagerController',
        controllerAs: 'pluginManager'
      }
    }
  })

  /* --------- AUTH ----------- */

  .state('myvolumio', {
    url: '/myvolumio',
    abstract: true,
    views: {
      layout: {
        templateUrl: themeManagerProvider.getHtmlPath('layout'),
        controller: 'LayoutController',
        controllerAs: 'layout'
      },
      'header@myvolumio': {
        templateUrl: themeManagerProvider.getHtmlPath('header'),
        controller: 'HeaderController',
        controllerAs: 'header'
      },
      'footer@myvolumio': {
        templateUrl: themeManagerProvider.getHtmlPath('footer'),
        controller: 'FooterController',
        controllerAs: 'footer'
      }
    },
    resolve: {
      dependenciesResolver: (
        $rootScope,
        modalListenerService,
        toastMessageService,
        uiSettingsService
      ) => {
        //NOTE this resolver init global services like toast
        return true;
      },
      socketResolver: function(
        $rootScope,
        deviceEndpointsService,
        $q,
        uiSettingsService,
        $document
      ) {
        console.log('SOK RES MY');
        var initing = $q.defer();
        $document[0].body.classList.add('myVolumioBkg');
        deviceEndpointsService
          .initSocket()
          .then(isAvalaible => {
            console.log('CALLBACK');
            console.log(isAvalaible);
            if (!isAvalaible) {
              uiSettingsService.setLanguage();
            }
            initing.resolve(true);
          })
          .catch(error => {
            console.log('SOK ERROR');
            console.log(error);
            uiSettingsService.setLanguage();
            initing.resolve(true);
          });
        return initing.promise;
      },
      authEnabled: function(authService, $q) {
        let enabling = $q.defer();
        authService.isAuthEnabled().then(enabled => {
          console.log('AUTH ENABLED');
          console.log(enabled);
          if (!enabled) {
            enabling.reject('AUTH_NOT_ENABLED');
          }
          enabling.resolve(true);
        });
        return enabling.promise;
      }
    }
  })

  .state('myvolumio.login', {
    url: '/login',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/login/auth-login.html',
        controller: 'AuthLoginController',
        controllerAs: 'authLoginController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireNullUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.signup', {
    url: '/signup',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/signup/auth-signup.html',
        controller: 'AuthSignupController',
        controllerAs: 'authSignupController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireNullUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.profile', {
    url: '/profile',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/profile/auth-profile.html',
        controller: 'AuthProfileController',
        controllerAs: 'authProfileController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.edit-profile', {
    url: 'profile/edit',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/edit-profile/auth-edit-profile.html',
        controller: 'AuthEditProfileController',
        controllerAs: 'authEditProfileController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireUser();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.plans', {
    url: '/plans',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/plans/auth-plans.html',
        controller: 'AuthPlansController',
        controllerAs: 'authPlansController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.subscribe', {
    url: '/subscribe/:plan',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/subscribe/auth-subscribe.html',
        controller: 'AuthSubscribeController',
        controllerAs: 'authSubscribeController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.payment-success', {
    url: '/payment/success',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/payment-success/auth-payment-success.html',
        controller: 'AuthPaymentSuccessController',
        controllerAs: 'authPaymentSuccessController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.payment-fail', {
    url: '/payment/fail',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/payment-fail/auth-payment-fail.html',
        controller: 'AuthPaymentFailController',
        controllerAs: 'authPaymentFailController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.recover-password', {
    url: '/recover-password',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/recover-password/auth-recover-password.html',
        controller: 'AuthRecoverPasswordController',
        controllerAs: 'authRecoverPasswordController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.waitForUser();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.verify-user', {
    url: '/profile/verify',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/verify-user/auth-verify-user.html',
        controller: 'AuthVerifyUserController',
        controllerAs: 'authVerifyUserController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireUser();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.cancel-subscription', {
    url: '/subscribe/cancel',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/cancel-subscription/auth-cancel-subscription.html',
        controller: 'AuthCancelSubscriptionController',
        controllerAs: 'authCancelSubscriptionController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.change-subscription', {
    url: '/subscribe/change/:plan',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/plugin/core-plugin/auth/change-subscription/auth-change-subscription.html',
        controller: 'AuthChangeSubscriptionController',
        controllerAs: 'authChangeSubscriptionController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  /* --------- END AUTH ----------- */

  .state('volumio.static-page', {
    url: 'static-page/:pageName',
    views: {
      'content@volumio': {
        templateUrl: 'app/static-pages/static-page.html',
        controller: 'StaticPageController',
        controllerAs: 'staticPage'
      }
    }
  })

  .state('redirect', {
    url: '/redirect',
    views: {
      layout: {
        template: '',
        controller: function($state, uiSettingsService, cloudService) {
          if (cloudService.isOnCloud === true) {
            $state.go('myvolumio.login');
            return;
          }
          uiSettingsService.initService().then(data => {
            if (data && data.indexState) {
              $state.go(`volumio.${data.indexState}`);
            } else {
              $state.go('volumio.playback');
            }
          });
        }
      }
    }
  })

  .state('volumio.wizard', {
    url: 'wizard',
    views: {
      'content@volumio': {
        templateUrl: 'app/wizard/wizard.html',
        controller: 'WizardController',
        controllerAs: 'wizard'
      }
    }
  });

  $urlRouterProvider.otherwise('/redirect');
}

export default routerConfig;