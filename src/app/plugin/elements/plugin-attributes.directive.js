class PluginAttributesDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'A',
      scope: {
        attributes: '='
      },
      controller: PluginAttributesController,
      controllerAs: 'attributes',
      bindToController: true
    };

    return directive;
  }
}

class PluginAttributesController {
  constructor ($element) {
    'ngInject';
    if (this.attributes) {
      this.attributes.forEach((attribute) => {
        let key = Object.keys(attribute)[0];
        $element.attr(key, attribute[key]);
      });
    }
  }
}

export default PluginAttributesDirective;
