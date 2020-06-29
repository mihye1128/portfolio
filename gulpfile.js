// -----------------------------------------------------
// パッケージの読み込み
// -----------------------------------------------------

// Gulp
const gulp = require('gulp')

// エラー時の通知設定
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

// Sass・PostCSSに関するパッケージ・プラグイン
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const flexBugsFixes = require('postcss-flexbugs-fixes')
const declarationSorter = require('css-declaration-sorter')
const cssMqpacker = require('css-mqpacker')
const cssWring = require('csswring')

// Pug
const pug = require('gulp-pug')

// 画像ファイル圧縮に関するパッケージ・プラグイン
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg = require('imagemin-mozjpeg')

// webpack
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

// ローカルサーバーの立ち上げ
const browserSync = require('browser-sync')

// FTPアップロードに関するパッケージ
const ftp = require('vinyl-ftp')
const fancyLog = require('fancy-log')


// -----------------------------------------------------
// 各種定数の設定
// -----------------------------------------------------

const paths = {
  scss: './src/scss/',
  pug: './src/pug/',
  css: './dist/assets/css/',
  html: './dist/',
  assets: './dist/assets/',
}
const autoprefixerOption = {
  grid: true // gridプロパティの設定をONに切替
}
const declarationSorterOption = {
  order: 'smacss' // CSSプロパティの並替順を指定
}
const postcssOption = [
  flexBugsFixes, // flexプロパティのIEで起きるバグの回避
  autoprefixer(autoprefixerOption), // ベンダープレフィックスを自動追加
  declarationSorter(declarationSorterOption), // CSSプロパティの並替
  cssMqpacker(), //メディアクエリを一箇所にまとめてコンパイル
  cssWring // CSSファイルの圧縮
]
const pugOption = {
  pretty: true // みやすいコードでの出力
}
const imageminOption = [
  imageminPngquant({ quality: [ 0.65, 0.8 ] }),
  imageminMozjpeg({ quality: '80' }),
  imagemin.gifsicle(),
  imagemin.optipng(),
  imagemin.svgo()
]
const browserSyncOption = {
  server: {
    baseDir: paths.html
  }
}


// -----------------------------------------------------
// タスクの登録
// -----------------------------------------------------

// gulp.taskメソッド 「名前」「処理」を渡して登録する
// 自動で渡される関数を呼び出して、完了を通知する（gulpは非同期処理のため）

gulp.task('sass', (done) => {
  //style.scssファイルを取得
  gulp.src(paths.scss + '**/*.scss', { sourcemaps: true })
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    // Sassのコンパイルを実行
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    // PostCSSの実行
    // プラグインの実行に必要なサポートブラウザの指定は、package.jsonの"browserslist"にて行う。
    .pipe(postcss(postcssOption))
    // 下記のディレクトリにファイルをに出力
    .pipe(gulp.dest(paths.css, { sourcemaps: '.' }))
  done()
})

gulp.task('pug', (done) => {
  gulp.src([paths.pug + '**/*.pug', '!' + paths.pug + '_inc/**/*.pug'])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug(pugOption))
    .pipe(gulp.dest(paths.html))
  done()
})

gulp.task('fonts', (done) => {
  gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest(paths.assets + 'fonts'))
  done()
})

gulp.task('copy', (done) => {
  gulp.src(['./src/manifest.json', './src/service-worker.js', './src/icon-192x192.png', './src/icon-512x512.png'])
    .pipe(gulp.dest(paths.html))
  done()
})

gulp.task('imagemin', (done) => {
  gulp.src('./src/img/**/*')
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest(paths.assets + 'img'))
  done()
})

gulp.task('webpack', () => {
  return webpackStream(webpackConfig, webpack)
  .pipe(gulp.dest('./dist/'))
})

gulp.task('server', (done) => {
  browserSync.init(browserSyncOption)
  done()
})

gulp.task('reload', (done) => {
  browserSync.reload()
  done()
})

gulp.task('watch', () => {
  gulp.watch(paths.scss + '**/*.scss', gulp.series('sass', 'reload'))
  gulp.watch(paths.pug + '**/*.pug', gulp.series('pug', 'reload'))
  gulp.watch('./src/font/**/*', gulp.series('fonts', 'reload'))
  gulp.watch('./src/img/**/*', gulp.series('imagemin', 'reload'))
  gulp.watch('./src/js/**/*.js', gulp.series('webpack', 'reload'))
})

gulp.task('default', gulp.series('sass', 'pug', 'fonts', 'copy', 'imagemin', 'webpack', 'server', 'watch'))

gulp.task('ftp', () => {
  const ftpConfig = {
    host: '', //FTPSサーヴァーの入力
    user: '', // FTP・WebDAVアカウントを入力
    password: '', // FTP・WebDAVパスワードを入力
    log: fancyLog
  }
  const connect = ftp.create(ftpConfig)
  const ftpUploadFiles = './dist/**/*'
  const ftpUploadConfig = {
    buffer: false
  }
  const remoteDistDir = '' // アップロードしたいディレクトリを入力 例) public_html

  return gulp.src(ftpUploadFiles, ftpUploadConfig)
    .pipe(connect.newer(remoteDistDir))
    .pipe(connect.dest(remoteDistDir))
})
