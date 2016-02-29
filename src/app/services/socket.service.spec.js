describe('socketService', function() {
  var socketService, mockWindow, mockRootScope;

  mockWindow = {
    socket: {
      on: function(eventName, cb) {
        cb('payload ON');
      },
      emit: function(eventName, cb) {
        cb('payload EMIT');
      },
      disconnect: angular.noop,
      removeAllListeners: angular.noop
    }
  };

  beforeEach(angular.mock.module('volumio'));

  beforeEach(
    function() {
      module(function($provide) {
        $provide.value('$window', mockWindow);
      });
      inject(function(_$rootScope_) {
        var $rootScope = _$rootScope_;
        $rootScope.$apply = function(fn) {
          fn();
        };
      });
    }
  );

  beforeEach(inject(function(_socketService_) {
    socketService = _socketService_;
    socketService.changeHost = angular.noop;
  }));

  it('Should exist', function() {
    expect(socketService).toEqual(jasmine.anything());
  });

  it('Should change host', function() {
    expect(socketService.host).toEqual(null);
    var newHost = 'http:192.168.0.1';
    socketService.host = newHost;
    expect(socketService.host).toEqual(newHost);
  });

  it('Should trigger callback on socket -on-', function() {
    var cb = {
      fn: function(data) {
        console.log('socket on, payload ->', data);
      }
    };
    spyOn(cb, 'fn').and.callThrough();
    socketService.on('handlerEvent', cb.fn);
    expect(cb.fn).toHaveBeenCalledWith('payload ON');
  });

  it('Should emit a socket event', function() {
    var cb = {
      fn: function(data) {
        console.log('socket emit, payload ->', data);
      }
    };
    spyOn(cb, 'fn').and.callThrough();
    socketService.emit('event', cb.fn);
    expect(cb.fn).toHaveBeenCalledWith('payload EMIT');
  });
});
