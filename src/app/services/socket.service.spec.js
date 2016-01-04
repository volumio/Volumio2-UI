describe('socketService', function() {
  var socketService, mockWindow;

  mockWindow = {
    socket: {
      on: function(eventName, cb) {
        console.log('QUESTO E MOCK', eventName);
        // if (cb) {
        //   cb('payload');
        // }
      }
    }
  };

  beforeEach(angular.mock.module('volumio'));

  beforeEach(module(function($provide) {
    $provide.value('$window', mockWindow);
  }));

  beforeEach(inject(function(_socketService_) {
    // spyOn(webDevTec, 'getTec').and.returnValue([{}, {}, {}, {}, {}]);
    // spyOn(toastr, 'info').and.callThrough();
    socketService = _socketService_;
  }));

  it('Should exist', function() {
    expect(socketService).toEqual(jasmine.anything());
  });

  it('Should trigger callback on socket -on-', function() {
    var cb = {
      fn: function(data) {
        console.log(data, 'KKK');
      }
    };
    spyOn(cb, 'fn').and.callThrough();
    //cb.fn('x');
    // console.log(cb.fn());
    socketService.on('test on message', cb.fn);
    // console.log(socket);
    expect(cb.fn).toHaveBeenCalled();
  });
});
