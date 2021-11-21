"use strict";

var testPages = require('..'); // TODO: Implement module test


testPages('test-pages', function () {
  expect(testPages('w')).toBe('w@zce.me');
  expect(testPages('w', {
    host: 'wedn.net'
  })).toBe('w@wedn.net');
  expect(function () {
    return testPages(100);
  }).toThrow('Expected a string, got number');
});