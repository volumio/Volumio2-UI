(function() {
  'use strict';

  describe('controllers', function(){

    beforeEach(module('volumio'));

    it('fake test', inject(function($controller) {
      expect(true).toBeTruthy();
    }));
  });
})();
