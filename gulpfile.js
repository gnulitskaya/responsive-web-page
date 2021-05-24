const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const autoprefixer  = require('gulp-autoprefixer');
const imagemin  = require('gulp-imagemin');
const del  = require('del');

function images() {
    return src('app/images/**/*')
        .pipe(imagemin(
        [
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
        ]
            })
        ]
        ))
        .pipe(dest('dist/images'))
}

function cleanDist() {
    return del('dist')
}

//обновление 
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap-select/dist/js/bootstrap-select.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        'app/js/main.js',
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write("."))
        .pipe(dest('app/js/'))
}


//конвертирует стили из scss в css
function styles() {
    //находим файл
     return src([
        'app/css/normalize.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap-select/dist/css/bootstrap-select.min.css',
        'app/scss/style.scss',
    ])
    //конвертируем и сжимаем
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        //выкидываем
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/scripts.js',
        'app/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

//отслеживает изменения
function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/main.js', '!app/js/scripts.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanDist = cleanDist;

//по порядку удалить 
exports.build = series(cleanDist, images, build);
exports.images = images;

//запускать всё паралельно
exports.default = parallel(styles, scripts, browsersync, watching);