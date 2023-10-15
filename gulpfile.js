const { src, lastRun, dest, parallel, series, watch } = require("gulp");

const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

const pug = require("gulp-pug");

const declarationSorter = require("css-declaration-sorter");
const cssMqpacker = require("css-mqpacker");
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const flexBugsFixes = require("postcss-flexbugs-fixes");
const cssWring = require("csswring");
const dependents = require("gulp-dependents");

const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed");

const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

const rimraf = require("rimraf");
const browserSync = require("browser-sync").create();

const srcPath = {
  scss: "./src/scss/**/*.scss",
  pug: "./src/pug/",
  js: "./src/js/**/*.js",
  img: "./src/img/**/*",
  font: "./src/fonts/**/*",
};

const distPath = {
  html: "./dist/",
  assets: "./dist/assets/",
};

const pugOption = {
  pretty: true,
};

const autoprefixerOption = {};

const declarationSorterOption = {
  order: "smacss",
};

const postcssOption = [
  flexBugsFixes,
  autoprefixer(autoprefixerOption),
  declarationSorter(declarationSorterOption),
  cssMqpacker(),
  cssWring,
];

const imageminOption = [
  pngquant({ quality: [0.65, 0.8] }),
  mozjpeg({ quality: "80" }),
  imagemin.gifsicle(),
  imagemin.optipng(),
  imagemin.svgo(),
];

const browserSyncOption = {
  server: {
    baseDir: distPath.html,
  },
};

const html = () => {
  return src([srcPath.pug + "**/*.pug", "!" + srcPath.pug + "_inc/**/*.pug"])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(pug(pugOption))
    .pipe(dest(distPath.html))
    .pipe(browserSync.stream());
};

const css = () => {
  return src(srcPath.scss, {
    since: lastRun(css),
    sourcemaps: true,
  })
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(dependents())
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(postcss(postcssOption))
    .pipe(dest(distPath.assets + "css/", { sourcemaps: "." }))
    .pipe(browserSync.stream());
};

const js = () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(dest(distPath.assets))
    .pipe(browserSync.stream());
};

const image = () => {
  return src(srcPath.img)
    .pipe(changed(distPath.assets + "images"))
    .pipe(imagemin(imageminOption))
    .pipe(dest(distPath.assets + "images"))
    .pipe(browserSync.stream());
};

const font = () => {
  return src(srcPath.font)
    .pipe(dest(distPath.assets + "fonts"))
    .pipe(browserSync.stream());
};

const other = () => {
  return src([
    "./src/manifest.json",
    "./src/service-worker.js",
    "./src/icon-192x192.png",
    "./src/icon-512x512.png",
  ])
    .pipe(dest(distPath.html))
    .pipe(browserSync.stream());
};

const deleteDist = (done) => {
  rimraf(distPath.assets, done);
};

const server = () => {
  browserSync.init(browserSyncOption);
};

const watchFiles = () => {
  watch(srcPath.pug + "**/*.pug", (done) => {
    html();
    done();
  });

  watch(srcPath.scss, (done) => {
    css();
    done();
  });

  watch(srcPath.js, (done) => {
    webpackConfig.mode = "development";
    webpackConfig.devtool = "eval-source-map";
    webpackStream(webpackConfig, webpack)
      .pipe(dest(distPath.assets))
      .pipe(browserSync.stream());
    done();
  });

  watch(srcPath.img, (done) => {
    image();
    done();
  });

  watch(srcPath.font, (done) => {
    font();
    done();
  });
};

const build = series(deleteDist, parallel(html, css, js, image, font, other));

exports.build = build;
exports.server = server;
exports.default = series(build, parallel(server, watchFiles));
