// Load Gulp
var gulp         = require( 'gulp' );

// CSS related plugins
var sass         = require( 'gulp-sass' );
var autoprefixer = require( 'gulp-autoprefixer' );
var minifycss    = require( 'gulp-uglifycss' );

// JS related plugins
var concat       = require( 'gulp-concat' );
var uglify       = require( 'gulp-uglify' );
var babelify     = require( 'babelify' );
var browserify   = require( 'browserify' );
var source       = require( 'vinyl-source-stream' );
var buffer       = require( 'vinyl-buffer' );
var stripDebug   = require( 'gulp-strip-debug' );

// Utility plugins
var rename       = require( 'gulp-rename' );
var sourcemaps   = require( 'gulp-sourcemaps' );
var notify       = require( 'gulp-notify' );
var plumber      = require( 'gulp-plumber' );
var options      = require( 'gulp-options' );
var gulpif       = require( 'gulp-if' );

// Browers related plugins
var browserSync  = require( 'browser-sync' ).create();
var reload       = browserSync.reload;

// Project related variables
var projectURL   = 'http://localhost/starter';

var styleSRC     = './src/scss/style.scss';
// var styleAdminSRC = './src/scss/admin.scss';
var styleURL     = './assets/css/';
var mapURL       = './';

var jsSRC        = './src/scripts/';
var jsFront      = 'main.js';
// var jsAdmin      = 'admin.js';
var jsFiles      = [ jsFront ];
var jsURL        = './assets/js/';

var imgSRC       = './src/images/**/*';
var imgURL       = './assets/images/';

var fontsSRC     = './src/fonts/**/*';
var fontsURL     = './assets/fonts/';

var styleWatch   = './src/scss/**/*.scss';
var jsWatch      = './src/scripts/**/*.js';
var imgWatch     = './src/images/**/*.*';
var fontsWatch   = './src/fonts/**/*.*';
var phpWatch     = './**/*.php';

// Tasks

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {
	// Bootstrap
	  gulp.src([
		'./node_modules/bootstrap/dist/js/*'
		])
		.pipe(gulp.dest('./assets/vendor/bootstrap'))
  
	// jQuery
	gulp.src([
		'./node_modules/jquery/dist/*',
		'!./node_modules/jquery/dist/core.js'
	  ])
	  .pipe(gulp.dest('./assets/vendor/jquery'))
  
	// jQuery Easing
	gulp.src([
		'./node_modules/jquery.easing/*.js'
	  ])
	  .pipe(gulp.dest('./assets/vendor/jquery-easing'))
  
  });

gulp.task( 'browser-sync', function() {
	browserSync.init({
		proxy: projectURL,
		/*https: {
			key: '/Users/your-user-name/path/to/your/key/test.dev.key',
			cert: '/Users/your-user-name/path/to/your/cert/test.dev.crt'
		},*/
		injectChanges: true,
		open: false
	});
});

gulp.task( 'css', function() {
	gulp.src( [ styleSRC ] )
		.pipe( sourcemaps.init() )
		.pipe( sass({
			errLogToConsole: true
		}) )
		.on( 'error', console.error.bind( console ) )
		.pipe( autoprefixer({ browsers: [ 'last 2 versions', '> 5%', 'Firefox ESR' ] }) )
		.pipe( gulp.dest( styleURL ) )
		.pipe( sass({
			outputStyle: 'compressed'
		}) )		
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( sourcemaps.write( mapURL ) )
		.pipe( gulp.dest( styleURL ) )
		.pipe( browserSync.stream() );
});

gulp.task( 'js', function() {
	jsFiles.map( function( entry ) {
		return browserify({
			entries: [jsSRC + entry]
		})
		.transform( babelify, { presets: [ 'env' ] } )
		.bundle()
		.pipe( source( entry ) )
		.pipe( rename( {
			extname: '.min.js'
        } ) )
		.pipe( buffer() )
		.pipe( gulpif( options.has( 'production' ), stripDebug() ) )
		.pipe( sourcemaps.init({ loadMaps: true }) )
		.pipe( uglify() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( gulp.dest( jsURL ) )
		.pipe( browserSync.stream() );
	});
 });

gulp.task( 'images', function() {
	triggerPlumber( imgSRC, imgURL );
});

gulp.task( 'fonts', function() {
	triggerPlumber( fontsSRC, fontsURL );
});

function triggerPlumber( src, url ) {
	return gulp.src( src )
	.pipe( plumber() )
	.pipe( gulp.dest( url ) );
}

 gulp.task( 'default', ['vendor', 'css', 'js', 'images', 'fonts'], function() {
	gulp.src( jsURL )
		.pipe( notify({ message: 'Assets Compiled!' }) );
 });

 gulp.task( 'watch', ['default', 'browser-sync'], function() {
	// gulp.watch( phpWatch, reload );
	gulp.watch( styleWatch, [ 'css', reload ] );
	gulp.watch( jsWatch, [ 'js', reload ] );
	gulp.watch('./*.html', browserSync.reload);
 });
