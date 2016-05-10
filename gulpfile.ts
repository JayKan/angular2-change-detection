import * as gulp from 'gulp';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as seq from 'gulp-sequence';
import * as template from 'gulp-template';
import * as nodemon from 'gulp-nodemon';
import * as sourceMaps from 'gulp-sourcemaps';
import * as inject from 'gulp-inject';
import * as slash from 'slash';
import * as tinylr from 'tiny-lr';
import * as openResource from 'open';
import * as uglify from 'gulp-uglify';
import * as cssnano from 'gulp-cssnano';
import * as gulpIf from 'gulp-if';
import * as childProcess from 'child_process';
import * as through2 from 'through2';
import * as del from 'del';

import {
  PORT,
  PATHS,
  APP_ROOT,
  IS_PROD,
  TSC_APP_OPTS,
  LIVE_RELOAD_PORT
} from './tools/config';

const spawn = childProcess.spawn;
const FIRST_PATH_SEGMENT = /^\/?[^\/]*/;

function notifyLiveReload(modifiedFile:string): void {
  tinylr.changed(modifiedFile);
}

function mapTsFiles(src:string | string[], cb:Function) {
  const lines = [];
  return gulp.src(src, {read: false})
    .pipe(through2.obj(function (chunk, enc, callback) {
      this.push(slash(path.relative(__dirname, chunk.path)));
      callback();
    }))
    .on('data', (data) => lines.push(data))
    .on('end', () => cb(lines));
}

function mapTscArgs(tscOpts: Object) {
  const response = [];
  for (let prop in tscOpts) {
    if (tscOpts[prop] === undefined || tscOpts[prop] === false) {
      continue;
    }
    response.push(`--${prop}`);
    if (tscOpts[prop] !== true) {
      response.push(tscOpts[prop]);
    }
  }
  return response;
}

function compileTs(src:string | string[], tscOpts: Object, cb?: Function): void {
  const _meta = compileTs['_meta'];
  mapTsFiles(src, (files) => {
    const tscArgs = mapTscArgs(tscOpts);
    const procKey = `${src}`;
    if (_meta[procKey]) {
      _meta[procKey].kill();
    }
    _meta[procKey] = spawn(`node`, [`node_modules/typescript/lib/tsc.js`, ...tscArgs, ...files]);
    _meta[procKey].stdout.on('data', (data) => console.log(data.toString()));
    _meta[procKey].stderr.on('data', (data) => console.error(data.toString()));
    _meta[procKey].on('exit', (code) => {
      let error;
      if (code) {
        error = new Error(`Error #${code} while compiling ts files.`);
      }
      if (cb) {
        cb(error);
      }
    });
  });
  
}
compileTs['_meta'] = {};

function compileTsWatch(src: string | string[], tscOpts: Object, cb?: Function): void {
  const params = Object.assign({}, tscOpts, { watch: true });
  compileTs(src, params, cb);
  gulp.watch(src, (event: any) => {
    if (event.type !== 'changed') {
      console.log(`File ${event.path} ${event.type}. Full Compilation.....`);
      compileTs(src, params);
    }
  });
}

function mapDestPathForLib(filePath: string) {
  const relativePath = path.dirname(path.relative(__dirname, filePath));
  return slash(relativePath).replace(FIRST_PATH_SEGMENT, PATHS.dest.dist.lib);
}

// ----------------
// Clean dist
gulp.task('clean.dist', (done) => del(['dist'], done));
// ----------------
// Clean test
gulp.task('clean.test', (done) => fse.remove(PATHS.dest.test, done));
// ----------------
// Clean coverage
gulp.task('clean.coverage', (done) => fse.remove(PATHS.dest.coverage, done));
// ----------------
// Clean everything
gulp.task('clean', seq('clean.dist', 'clean.test', 'clean.coverage'));

// ---------------
// Copy vendor etc
gulp.task('copyOnlyLib', () => gulp.src(PATHS.src.vendor.copyOnly)
  .pipe(gulp.dest((file: any) => mapDestPathForLib(file.path)))
);

// --------------
// Copy config 
gulp.task('copyOnlyConfig', () => gulp.src(PATHS.src.custom.config)
  .pipe(gulp.dest('dist/client'))
);

// ---------------
// Copy vendor css
gulp.task('cssLib', () => gulp.src(PATHS.src.vendor.css)
  .pipe(gulpIf(IS_PROD, sourceMaps.init()))
  .pipe(gulpIf(IS_PROD, cssnano()))
  .pipe(gulpIf(IS_PROD, sourceMaps.write()))
  .pipe(gulp.dest((file: any) => mapDestPathForLib(file.path)))
);

// ----------------
// Copy vendor font
gulp.task('font', () => gulp.src(PATHS.src.vendor.font)
  .pipe(gulp.dest((file: any) => mapDestPathForLib(file.path)))
);

// --------------
// Copy vendor js
gulp.task('jsLib', () => gulp.src(PATHS.src.vendor.js)
  .pipe(gulpIf(IS_PROD, sourceMaps.init()))
  .pipe(gulpIf(IS_PROD, uglify({ mangle: false })))
  .pipe(gulpIf(IS_PROD, sourceMaps.write()))
  .pipe(gulp.dest((file: any) => mapDestPathForLib(file.path)))
);

// ------------------
// Copy css and watch
gulp.task('css', () => gulp.src(PATHS.src.custom.css)
  .pipe(gulpIf(IS_PROD, sourceMaps.init()))
  .pipe(gulpIf(IS_PROD, cssnano()))
  .pipe(gulpIf(IS_PROD, sourceMaps.write()))
  .pipe(gulp.dest(PATHS.dest.dist.base))
);
gulp.task('css.w', ['css'], () => gulp.watch(PATHS.src.custom.css, ['css']));

// ----------------------
// Copy template && watch
gulp.task('tpl', () => gulp.src(PATHS.src.custom.tpl).pipe(gulp.dest(PATHS.dest.dist.base)));
gulp.task('tpl.w', ['tpl'], () => gulp.watch(PATHS.src.custom.tpl, ['tpl']));


// -------------------
// TypeScript && watch
gulp.task('ts', ['clean.dist'], (cb) => compileTs(PATHS.src.custom.tsApp, TSC_APP_OPTS, cb));
gulp.task('ts.w', ['clean.dist'], () => compileTsWatch(PATHS.src.custom.tsApp, TSC_APP_OPTS));

// --------------------
// Build index && watch 
gulp.task('index', () => {
  const libs: string[] = PATHS.src.vendor.css.concat(PATHS.src.vendor.js);
  const libStream = gulp.src(libs, { read: false });
  return gulp.src(PATHS.src.custom.index)
    .pipe(template({ APP_ROOT, IS_PROD }))
    .pipe(inject(libStream, {
      name: 'lib',
      transform: function(filePath) {
        arguments[0] = filePath.replace(FIRST_PATH_SEGMENT, '/lib');
        return inject.transform.apply(inject.transform, arguments);
      }
    }))
    .pipe(gulp.dest(PATHS.dest.dist.base));
});
gulp.task('index.w', ['index'], () => gulp.watch(PATHS.src.custom.index, ['index']));

// ---------------
// Reload && watch
gulp.task('reload.w', () => gulp.watch(`${PATHS.dest.dist.base}/**/*`, (evt: any) => notifyLiveReload(evt.path)));

// ------------------
// Build and watch
gulp.task('build', ['clean.dist'], seq(
  ['copyOnlyLib', 'copyOnlyConfig', 'cssLib', 'font', 'jsLib', 'css', 'tpl', 'ts', 'index'])
);
gulp.task('build.w', ['clean.dist'], seq(
  ['copyOnlyLib', 'copyOnlyConfig', 'cssLib', 'font', 'jsLib', 'css.w', 'tpl.w', 'ts.w', 'index.w'], 'reload.w')
);

// ------------------
// Start local server
gulp.task('server.start', (done) => {
  nodemon({
    script: 'server/index.js',
    watch: ['server'],
    ignore: ['node_modules/**'],
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
  .on('start', () => {
    console.log('Server started');
  })
  .once('start', () => {
    const tinylrObj = tinylr();
    tinylrObj.listen(LIVE_RELOAD_PORT);
    const intervalId = setInterval(() => {
      const existsDist = fse.existsSync(PATHS.dest.dist.appBundle);
      if (existsDist) {
        clearInterval(intervalId);
        setTimeout(() => {
          openResource(`http://localhost:${PORT}`);
          done();
        }, 1000);
      }
    }, 500);
  })
});
gulp.task('serve', seq('build.w', 'server.start'));

gulp.task('server-copy-dist', () => gulp.src(['server/**/*.{js,json}', '!server/**/*.spec.*'])
  .pipe(gulp.dest('dist/server'))
);
gulp.task('general-copy-dist', () => gulp.src(['package.json'])
  .pipe(gulp.dest('dist'))
);
gulp.task('publish', seq('server-copy-dist', 'general-copy-dist'));
