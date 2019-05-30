const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const preCSS = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const path = {
	src: {
		html: './src/',
		css: './src/css/',
		js: './src/js/'
	},
	dev: {
		html: './public',
		css: './public/css',
		js: './public/js'
	}
};

const htmlFiles = [
	path.src.html + 'index.html'
];

const cssFiles = [
	// './src/css/fonts.css',
	// path.src.css + 'reset.less',
	path.src.css + 'style.less'
	// path.src.css + 'media.less'
];

const jsFiles = [
	'./src/js/lib.js',
	'./src/js/message.js',
	path.src.js + 'main.js'
];

function pages() {
	return gulp.src(htmlFiles)
			.pipe(concat('index.html'))
			.pipe(htmlmin({
				collapseWhitespace: true,
				removeComments: true
			}))
			.pipe(gulp.dest(path.dev.html));
}

function styles() {
	return gulp.src(cssFiles)
			.pipe(sourcemaps.init())
			.pipe(preCSS())
			.pipe(concat('style.min.css'))
			.pipe(gcmq())
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
			.pipe(cleanCSS({
				level: 2
			}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(path.dev.css))
			.pipe(browserSync.stream());
}

function scripts() {
	return gulp.src(jsFiles)
			.pipe(sourcemaps.init())
			.pipe(concat('script.min.js'))
			.pipe(babel({
				presets: [['@babel/env']]
			}))
			.pipe(uglify({
				toplevel: true
			}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(path.dev.js))
			.pipe(browserSync.stream());
}

function clean() {
	return del([
		path.dev.html + '/*.html',
		path.dev.css + '/*',
		path.dev.js + '/*'
	]);
}

function watch() {
	browserSync.init({
        server: {
			baseDir: "public",
        	index: "/index.html"
		  },
		  port: 8080,
		  open: true,
		  notify: false
	});
	gulp.watch(path.src.css + '**/*.less', styles);
	gulp.watch(path.src.js + '**/*.js', scripts);
	gulp.watch(path.src.html + '*.html', pages);
	gulp.watch(path.dev.html + "/index.html").on('change', browserSync.reload);
}


// gulp.task('pages', pages);
// gulp.task('styles', styles);
// gulp.task('scripts', scripts);
// gulp.task('del', clean);


gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(pages, styles, scripts)));

gulp.task('dev', gulp.series('build', 'watch'));

