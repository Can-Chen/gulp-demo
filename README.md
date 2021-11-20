# test-pages

[![Build Status][actions-img]][actions-url]
[![Coverage Status][codecov-img]][codecov-url]
[![License][license-img]][license-url]
[![NPM Downloads][downloads-img]][downloads-url]
[![NPM Version][version-img]][version-url]
[![Dependency Status][dependency-img]][dependency-url]
[![devDependency Status][devdependency-img]][devdependency-url]
[![Code Style][style-img]][style-url]

> Awesome node modules.

## Installation

```shell
$ npm install test-pages

# or yarn
$ yarn add test-pages
```

## Usage

<!-- TODO: Introduction of Usage -->

```javascript
const testPages = require('test-pages')
const result = testPages('w')
// result => 'w@zce.me'
```

## API

<!-- TODO: Introduction of API -->

### testPages(input, options?)

#### input

- Type: `string`
- Details: name string

#### options

##### host

- Type: `string`
- Details: host string
- Default: `'zce.me'`

## Related

- [zce/caz](https://github.com/zce/caz) - A simple yet powerful template-based Scaffolding tools.

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; [can.chen](https://github.com/Can-Chen/gulp-demo.git)



[actions-img]: https://img.shields.io/github/workflow/status/zce/test-pages/CI
[actions-url]: https://github.com/zce/test-pages/actions
[codecov-img]: https://img.shields.io/codecov/c/github/zce/test-pages
[codecov-url]: https://codecov.io/gh/zce/test-pages
[license-img]: https://img.shields.io/github/license/zce/test-pages
[license-url]: https://github.com/zce/test-pages/blob/master/LICENSE
[downloads-img]: https://img.shields.io/npm/dm/test-pages
[downloads-url]: https://npm.im/test-pages
[version-img]: https://img.shields.io/npm/v/test-pages
[version-url]: https://npm.im/test-pages
[dependency-img]: https://img.shields.io/david/zce/test-pages
[dependency-url]: https://david-dm.org/zce/test-pages
[devdependency-img]: https://img.shields.io/david/dev/zce/test-pages
[devdependency-url]: https://david-dm.org/zce/test-pages?type=dev
[style-img]: https://img.shields.io/badge/code_style-standard-brightgreen
[style-url]: https://standardjs.com
