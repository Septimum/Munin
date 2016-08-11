var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var pug = require('gulp-pug');
var spritesmith = require('gulp.spritesmith');
var wiredep = require('wiredep').stream;
var server = require('gulp-server-livereload');
var merge = require('merge-stream');
var imagemin = require('gulp-imagemin');

gulp.task('sass', function()
{
    return sass('src/sass/*.sass')
                .on('error', sass.logError)
                .pipe(gulp.dest('dist/css/main.css'));
});

gulp.task('pug', function()
{
    return gulp.src('src/pug/*.pug')
                .pipe(pug({pretty:true}))
                .pipe(gulp.dest('dist/'));
});

gulp.task('sprites', function()
{
    var spriteData = gulp.src('src/images/icons/*.png')
                        .pipe(spritesmith(
                        {
                            imgName: 'sprites.png',
                            cssName: 'sprites.css'                            
                        }));

    var imgStream = spriteData.img
                        .pipe(gulp.dest('dist/images/'));

    var cssStream = spriteData.css
                        .pipe(gulp.dest('dist/css/'));

    return merge(imgStream, cssStream);
});

gulp.task('wiredep', ['pug'], function()
{
    gulp.src('dist/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function()
{
    gulp.src('src/images/*')
            .pipe(imagemin({verbose: true}))
            .pipe(gulp.dest('dist/images'));
});

gulp.task('webserver', function()
{
    gulp.src('dist/')
        .pipe(server(
        {
            livereload:
            {
                enable: true,
                filter: function(filePath, cb)
                {
                    cb(!(/node_modules/.test(filePath)));
                }
            }
        }));
});

gulp.task('default', ['sass', 'sprites', 'pug'/*, 'wiredep'*/]);
