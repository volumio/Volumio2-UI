/* eslint-disable */
window.TestElement = function(name) {
  var _this = this;
  inject(function($rootScope, $compile, $timeout) {
    _this._$scope = $rootScope.$new();
    _this.$originalScope = $rootScope.$new();
    _this.$compile = $compile;
    _this.$timeout = $timeout;
  });
  _this.name = name;
  _this.data = [];
};
window.TestElement.prototype = {
  addData: function(data) {
    this.data.push(data);
  },
  create: function(html, scope) {
    var elem = angular.element(html);
    if (this.data.length > 0) {
      this.data.forEach(function(data) {
        elem.data(data.key, data.value);
      });
    }
    this._$scope = angular.extend(this.$originalScope, scope);
    this.el = this.$compile(elem)(this._$scope);
    this._$scope.$digest();
    this.el = angular.element(
        this.el.find(this._dasherize(this.name))[0] ||
        this.el.find('[' + this._dasherize(this.name) + ']')[0] ||
        this.el);
    try {
      this.$timeout.verifyNoPendingTasks();
    } catch (e) {
      this.$timeout.flush();
    }
    return this.el;
  },
  destroy: function() {
    this._$scope.$destroy();
    this.el = null;
  },
  get dom() {
    return angular.element(this.el);
  },
  get scope() {
    var _el = angular.element(this.el);
    return _el.isolateScope() || _el.scope();
  },
  get ctrl() {
    return angular.element(this.el).controller(this.name);
  },
  get $parent() {
    return this._$scope;
  },
  childScope: function(directiveSelector) {
    return angular.element(this.dom.find(directiveSelector)).children().scope();
  },
  clickOn: function(selector) {
    if (this.dom.find(selector)[0]) {
      this.dom.find(selector).click();
    } else {
      $(selector).click();
    }
    this._$scope.$digest();
    return this._getFlushedThenable();
  },
  inputOn: function(selector, value) {
    if (this.dom.find(selector)[0]) {
      this.dom.find(selector).val(value || '').trigger('input').trigger('keydown');
    } else {
      $(selector).val(value || '').trigger('input').trigger('keydown');
    }
    this._$scope.$digest();
    return this._getFlushedThenable();
  },
  keydownOn: function(selector, value, clearInputBeforeType, triggerBlur) {
    var keydown = $.Event('keydown'),
      keyup = $.Event('keyup'),
      blur = $.Event('blur'),
      valueSplit = (value + '').split(''),
      el;

    if (this.dom.find(selector)[0]) {
      el = this.dom.find(selector);
    } else {
      el = $(selector);
    }

    if (clearInputBeforeType) {
      el.val('');
    }

    valueSplit.forEach(function(item) {
      var charCode = item.charCodeAt(0);
      keydown.which = charCode;
      keyup.which = charCode;
      selector.val(el.val() + item || '').trigger(keydown).trigger(keyup);
    }.bind(this));

    if (triggerBlur) {
      el.trigger(blur);
    }

    this._$scope.$digest();
    return this._getFlushedThenable();
  },
  keyCodeDownOn: function(selector, keyCode, clearInputBeforeType) {
    var keydown = $.Event('keydown'),
      keyup = $.Event('keyup'),
      el;

    keydown.which = keyCode;
    keyup.which = keyCode;

    if (this.dom.find(selector)[0]) {
      el = this.dom.find(selector);
    } else {
      el = $(selector);
    }

    if (clearInputBeforeType) {
      el.val('');
    }

    el.trigger(keydown).trigger(keyup);

    this._$scope.$digest();
    return this._getFlushedThenable();
  },
  inputEnterOn: function(selector) {
    var e = $.Event('keypress');
    e.which = 13;
    if (this.dom.find(selector)[0]) {
      this.dom.find(selector).trigger(e);
    } else {
      $(selector).trigger(e);
    }
    return this._getFlushedThenable();
  },
  changeProps: function(props) {
    Object.keys(props).forEach(function(k) {
      this._$scope[k] = props[k];
    }.bind(this));
    this._$scope.$digest();
    return this._getFlushedThenable();
  },
  _getFlushedThenable: function() {
    try {
      this.$timeout.verifyNoPendingTasks();
    } catch (e) {
      this.$timeout.flush();
    }
    return {
      then: function(fn) {
        fn();
      }
    };
  },
  _dasherize: function(str) {
    return (str || '').split(/([A-Z])/).reduce(function(cur, next) {
      return cur + (next.match(/[A-Z]/) ? ('-' + next.toLowerCase()) : next);
    });
  }
};
