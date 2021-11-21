#!/usr/bin/env node
'use strict'

process.argv.push('--cwd')
process.argv.push(process.cwd())
process.argv.push('--gulpfile') // 自动去找package.json路径

process.argv.push(require.resolve('..'))

require('gulp/bin/gulp')
