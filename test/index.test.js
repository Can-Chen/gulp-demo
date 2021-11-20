const testPages = require('..')

// TODO: Implement module test
test('test-pages', () => {
  expect(testPages('w')).toBe('w@zce.me')
  expect(testPages('w', { host: 'wedn.net' })).toBe('w@wedn.net')
  expect(() => testPages(100)).toThrow('Expected a string, got number')
})
