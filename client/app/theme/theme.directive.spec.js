'use strict';

describe('Directive: theme', function () {

  // load the directive's module
  beforeEach(module('projectsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<theme></theme>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the theme directive');
  }));
});