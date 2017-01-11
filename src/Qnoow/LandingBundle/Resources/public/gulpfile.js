var gulp = require('gulp');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');

// Convert scss to css
gulp.task('sass', function() {
    var paths = [
        'node_modules/section-scroll/section-scroll.css',
        'src/scss/main.scss'
    ];
    return gulp.src(paths)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./www/css/'))
        .pipe(connect.reload());
});

// Copy files
gulp.task('files', function() {
    return gulp.src('src/*')
        .pipe(gulp.dest('www/'));
});
// Copy fonts
gulp.task('fonts', function() {
    return gulp.src('src/scss/fonts/*')
        .pipe(gulp.dest('www/css/fonts/'));
});
// Copy images
gulp.task('images', function() {
    return gulp.src(['src/img/*', 'src/img/**/*'])
        .pipe(gulp.dest('www/img/'));
});
gulp.task('css-images', function() {
    return gulp.src(['src/scss/img/*', 'src/scss/img/**/*'])
        .pipe(gulp.dest('www/css/img/'));
});

// Copy and minimize normalize.css
gulp.task('minify-normalize', function() {
    return gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(minifyCss())
        .pipe(concat('normalize.min.css'))
        .pipe(gulp.dest('www/css/'));
});
// Copy vendor files used directly
gulp.task('copy-html5shiv', function() {
    return gulp.src('node_modules/html5shiv/dist/html5shiv.min.js')
        .pipe(gulp.dest('www/js/vendor/'));
});
gulp.task('copy-jquery', function() {
    var paths = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery.easing/jquery.easing.min.js'
    ];
    return gulp.src(paths)
        .pipe(gulp.dest('www/js/vendor/'));
});

// Build vendor files used together
gulp.task('build-vendor-js', function() {
    var paths = [
        'src/js/plugins.js',
        'node_modules/sliiide/sliiide.min.js',
        'node_modules/Swipe/swipe.js',
        'node_modules/section-scroll/jquery.section-scroll.js'
    ];
    return gulp.src(paths)
        .pipe(concat('plugins.js'))
        .pipe(uglify())
        .pipe(gulp.dest('www/js/'))
        .pipe(connect.reload());
});

// Copy main.js
gulp.task('build-js', function() {
    return gulp.src('src/js/main.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('www/js/'))
        .pipe(connect.reload());
});


// Rerun tasks whenever a file changes.
gulp.task('watch', ['build'], function() {
    gulp.watch('./src/scss/**/*', ['sass']);
    gulp.watch('./src/js/**/*', ['build-js']);
});

// Development
gulp.task('serve', function() {
    connect.server({
        root      : 'www',
        host      : '*',
        port      : 8000,
        livereload: true
    });
});

gulp.task('build', ['sass', 'files', 'fonts', 'images', 'css-images', 'minify-normalize', 'copy-html5shiv', 'copy-jquery', 'build-vendor-js', 'build-js']);
gulp.task('dev', ['build', 'serve', 'watch']);
