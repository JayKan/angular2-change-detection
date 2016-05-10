import * as slash from 'slash';
import * as fse from 'fs-extra';

const CWD                     = slash(process.cwd());
const environment             = process.env.NODE_ENV || 'production';

export const IS_PROD          = environment === 'production'; 
export const PORT             = 9000;
export const LIVE_RELOAD_PORT = 2004;
export const APP_ROOT         = '/';

const TMP           = 'tmp';
const CLIENT_SRC    = 'client';
const CLIENT_DEST   = 'dist/client';
const NODE_MODULES  = 'node_modules';
const INDEX_HTML    = `${CLIENT_SRC}/index.html`;
const TS_LIB_DEF    = [
  'typings/main/ambient/es6-shim/*.d.ts',
  'tools/manual_typings/module.d.ts'
];

export const PATHS = {
  cwd: CWD,
  src: {
    vendor: {
      js: [
        `${NODE_MODULES}/systemjs/dist/system-polyfills.src.js`,
        `${NODE_MODULES}/systemjs/dist/system.src.js`,
        `${NODE_MODULES}/reflect-metadata/Reflect.js`,
        `${NODE_MODULES}/es6-shim/es6-shim.js`,
        `${NODE_MODULES}/rxjs/bundles/Rx.js`,
        `${NODE_MODULES}/zone.js/dist/zone.js`,
      ],
      copyOnly: [
        `${NODE_MODULES}/bootstrap/dist/css/bootstrap.css.map`
      ],
      font: [
        `${NODE_MODULES}/bootstrap/dist/fonts/*`
      ],
      css: [
        `${NODE_MODULES}/bootstrap/dist/css/bootstrap.css`
      ]
    },
    custom: {
      index: INDEX_HTML,
      tpl: [
        `${CLIENT_SRC}/**/*.html`,
        `!${INDEX_HTML}`
      ],
      config: `${CLIENT_SRC}/system.config.js`,
      css: `${CLIENT_SRC}/**/*.css`,
      tsApp: TS_LIB_DEF.concat([
        `${CLIENT_SRC}/**/*.ts`,
        `!${CLIENT_SRC}/**/spec.ts`
      ]),
      test: TS_LIB_DEF.concat([
        'typings/main/ambient/jasmine/*.d.ts',
        `${CLIENT_SRC}/**/spec.ts`
      ])
    }
  },
  dest: {
    tmp: TMP,
    test: `${TMP}/test`,
    coverage: `${TMP}/coverage`,
    dist: {
      base: CLIENT_DEST,
      appBundle: `${CLIENT_DEST}/app.bundle.js`,
      lib: `${CLIENT_DEST}/lib`,
      font: `${CLIENT_DEST}/fonts`
    }
  }
};

const TSC_OPTIONS = fse.readJsonSync(`${CWD}/tsconfig.json`).compilerOptions;
TSC_OPTIONS.forceConsistentCasingInFileNames = true;
TSC_OPTIONS.pretty = true;
TSC_OPTIONS.module = 'system';

export const TSC_APP_OPTS = Object.assign({}, TSC_OPTIONS, {
  outFile: PATHS.dest.dist.appBundle
});

export const TSC_TEST_OPTS = Object.assign({}, TSC_OPTIONS, {
  outDir: PATHS.dest.test
});




