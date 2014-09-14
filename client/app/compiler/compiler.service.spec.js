'use strict';

describe('Service: compiler', function () {

  // load the service's module
  beforeEach(module('projectsApp'));

  // instantiate service
  var compiler;
  beforeEach(inject(function (_compiler_) {
    compiler = _compiler_;
  }));

  it('should do something', function () {
    expect(!!compiler).toBe(true);
  });

});
