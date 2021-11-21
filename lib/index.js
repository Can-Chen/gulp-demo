const del = require('del')

const {
  src,
  dest,
  series,
  parallel,
  watch
} = require('gulp')

// 自动加载插件
const loadPlugins = require('gulp-load-plugins')

// 并不属于gulp插件 只是使用gulp管理
const browserSync = require('browser-sync')

const plugins = loadPlugins()

const bs = browserSync.create()

// 命名方式
// gulp-<项目名> -- > 项目名
// gulp-aa-cc --> aaCc

const sass = require('gulp-sass')(require('sass'))
// const babel = require('gulp-babel');
// const swig = require('gulp-swig');
// const imagemin = require('gulp-imagemin') // 降版本 8.x无法使用

// -------------------------------------------------

// 模板引擎数据
// 返回当前命令行所在的公共任务
const cwd = process.cwd()

let config = {
  // default config
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      style: 'assets/styles/*.scss',
      script: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  }
}

try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig)
} catch (error) {};
// -------------------------------------------------

// 返回一个promise
const clean = () => {
  return del([config.build.dist, config.build.temp])
}

// sass __下划线开头的文件不会转换过去

const style = () => {
  return src(config.build.paths.style, {
    base: config.build.src, // 保留src后面的路径
    // 运行命令从哪个目录开始找，默认是根目录
    cwd: config.build.src
  })
    .pipe(sass({
      // 完全展开格式
      outputStyle: 'expanded'
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true
    }))
}

const script = () => {
  return src(config.build.paths.script, {
    base: config.build.src, // 保留src后面的路径
    // 运行命令从哪个目录开始找，默认是根目录
    cwd: config.build.src
  })
    .pipe(plugins.babel({
      // 没配置 文件可能就是复制了一下
      // 这些插件就是你babel这个平台需要做什么工作
      // presets: ['@babel/preset-env']
      // 使用相对的找，先找根目录再找自己内部目录
      presets: [require('@babel/preset-env')]
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true
    }))
}

const page = () => {
  // 如果找其他的 可以直接 /**/*.html
  return src(config.build.paths.pages, {
    base: config.build.src, // 保留src后面的路径
    // 运行命令从哪个目录开始找，默认是根目录
    cwd: config.build.src
  })
    .pipe(plugins.swig({
      data: config.data,
      // 防止模板缓存导致页面不能及时更新
      defaults: {
        cache: false
      }
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({
      stream: true
    }))
}

// 下面两个任务开发阶段不影响开发
// 不存放临时目录
const image = () => {
  return src(config.build.paths.images, {
    base: config.build.src, // 保留src后面的路径
    // 运行命令从哪个目录开始找，默认是根目录
    cwd: config.build.src
  })
    .pipe(plugins.imagemin()) // 图片无损压缩 svg格式化了
    .pipe(dest(config.build.dist))
}

const font = () => {
  return src(config.build.paths.fonts, {
    base: config.build.src, // 保留src后面的路径
    // 运行命令从哪个目录开始找，默认是根目录
    cwd: config.build.src
  })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const extra = () => {
  return src('**', {
    base: config.build.public, // 保留src后面的路径
    // 运行命令从哪个目录开始找，默认是根目录
    cwd: config.build.public
  })
    .pipe(dest(config.build.dist))
}

// 最后执行的任务
// useref才是最终的产物
const useref = () => {
  // 注意：构建注释存在，该插件才会生效，构建过一次构建注释都会被删掉，重新删除打包生成构建注释

  // 依靠这样的构建注释完成转换
  //  <!-- build:css assets/styles/vendor.css -->
  //  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
  //  <!-- endbuild -->

  // 还会合并打包后内部文件

  // 增加临时文件
  // 最终打包文件还是放在dist目录
  return src(config.build.paths.pages, {
    base: config.build.temp,
    cwd: config.build.temp
  })
    .pipe(plugins.useref({
      searchPath: [config.build.temp, '.']
    }))
    // html js css进行压缩
    // 因为构建完之后 才会走这个插件 所有在这里压缩
    // 还需要判断是什么读取流执行对应的压缩
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    // 不指定这个参数 不会压缩那些换行符等等等   压缩行内样式和js   还可以指定删除空属性 注释等等
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    // 避免一边写一边读 冲突 换一个目录
    // .pipe(dest('dist'))
    .pipe(dest(config.build.dist))
}

// 直接处理没有样式的原因，没有拷贝node_modules目录下的依赖文件，只对自己写的代码进行了拷贝
// 1. 加一个单独的路由`routes: '/node_modules' : 'node_modules'` 样式中对bootstrap的请求就会映射到/node_modules中
// 2. 只保证开发环境没有问，如果执行打包命令是没有把这些文件打到build目录下，这样去使用是有问题的
const serve = () => {
  // 这里就是启动serve任务后，
  // 监听这几个目录下文件的变化
  // 变化后再执行对应的构建任务，dist目录就会更新
  // serve又监听了dist的更新
  // 所以此时更新了网页上的数据

  // 有意义的编译
  watch(config.build.paths.style, {
    cwd: config.build.src
  }, style)
  watch(config.build.paths.script, {
    cwd: config.build.src
  }, script)
  watch(config.build.paths.pages, {
    cwd: config.build.src
  }, page)

  // 无损的压缩 开发阶段无意义的编译
  // 多余的监听
  // 上线之前可以打包
  // watch('src/assets/images/**', image) // 无损压缩 不影响展示效果
  // watch('src/assets/fonts/**', font)
  // watch('public/*', extra)

  // 虽然没有编译 但是更新也需要重新展示到浏览器 使用一个监听任务即可
  watch([config.build.paths.images, config.build.paths.fonts], {
    cwd: config.build.src
  }, bs.reload)
  watch('**', {
    cwd: config.build.public
  }, bs.reload)

  bs.init({
    notify: false, // 提示是否连接上 启动时右上角的小提示
    port: 8888, // 默认3000
    open: true, // 是否启动时自动打开浏览器
    // 监听路径的通配符 监听什么文件就指定什么 这里是监听转换后的代码修改
    // 有些写法 不实用files 而是使用reload
    /**
     const style = () => {
      return src('src/assets/styles/*.scss', {
          base: 'src' // 保留src后面的路径
        })
        .pipe(sass({
          // 完全展开格式
          outputStyle: 'expanded'
        }))
        .pipe(dest('dist'))
        .pipe(bs.reload({ stream: true }))
    };
     */
    // files: 'dist/**',
    server: {
      // 加载目录
      // serve任务前 先进行打包 不然dist目录不存在就报错了
      // 开发任务走临时目录
      baseDir: [config.build.temp, config.build.src, config.build.public], // 先从第一个目录找 找不到就找第二个目录
      routes: {
        // 先走routes下的配置 没有再走baseDir目录下的
        '/node_modules': 'node_modules'
      }
    }
  })
}

// 互不干扰 并行任务
// 主要处理scr下目录
const compile = parallel(style, script, page)

// 先clean 再build
// 上线之前的任务
const build = series(clean, parallel(series(compile, useref), extra, image, font))

// 开发的目录
// 先编译 再启动 串行操作
const develop = series(compile, serve)

module.exports = {
  clean,
  build,
  develop
}

// 开发服务器 browser-sync
