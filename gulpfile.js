const fs = require("fs");
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const ejs = require("gulp-ejs");
const uglify = require("gulp-uglify");
const npmDist = require("gulp-npm-dist");
const postcss = require("gulp-postcss");
const { copyLibs } = require("gulp-copy-libs");
const YAML = require("yaml");
const prettier = require("gulp-prettier");

// Compile src sass
gulp.task("compile:sass", function () {
  return gulp
    .src("src/scss/*.scss")
    .pipe(postcss([require("tailwindcss"), require("autoprefixer")]))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(gulp.dest("./dist/css"))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

// Compile src js
gulp.task("compile:js", function () {
  return gulp
    .src("src/js/**/*.js")
    .pipe(gulp.dest("dist/js/"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.stream());
});

// Copy libs from node modules
gulp.task("copy:libs", function () {
  const libsConfig = [
    {
      outputDirectory: "dist/libs/boxicons/css",
      inputFiles: "node_modules/boxicons/css/*.css",
    },
    {
      outputDirectory: "dist/libs/boxicons/fonts",
      inputFiles: "node_modules/boxicons/fonts/*.{eot,svg,ttf,woff,woff2}",
    },
  ];

  return (
    gulp
      .src(npmDist(), { base: "./node_modules" })
      .pipe(
        rename(function (path) {
          // Remove dist dir
          path.dirname = path.dirname
            .replace(/\/dist/, "")
            .replace(/\\dist/, "");
        })
      )
      .pipe(gulp.dest("./dist/libs"))

      // Copy custom libs
      .pipe(copyLibs(libsConfig))
  );
});

// build html
gulp.task("ejs_compile:html", function () {
  const file = fs.readFileSync("./config-template.yml", "utf8");
  const data_content = YAML.parse(file);

  function menu_builder(x) {
    return x;
  }

  let func_helper = {
    menu_builder,
  };

  return gulp
    .src("./src/templates/*.ejs")
    .pipe(ejs({ ...data_content, ...func_helper }))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("./pages"));
});

// Beauty html
gulp.task("prettier:html", function () {
  return gulp
    .src("./pages/**/*.html")
    .pipe(prettier({}))
    .pipe(gulp.dest("./pages"));
});

// task build
gulp.task(
  "build",
  gulp.series(
    "copy:libs",
    "compile:sass",
    "compile:js",
    "ejs_compile:html",
    "prettier:html"
  )
);

// task serve browser sync
gulp.task(
  "serve",
  gulp.series("build", function () {
    browserSync.init({ server: "." });
    gulp.watch("./src/js/**/*.js", gulp.series("compile:js"));
    gulp.watch("./src/scss/**/*.scss", gulp.series("compile:sass"));
    gulp
      .watch(
        ["./src/templates/**/*.ejs"],
        gulp.series(["ejs_compile:html", "prettier:html"])
      )
      .on("change", browserSync.reload);
  })
);

// default gulp command
gulp.task("default", gulp.series("serve"));
