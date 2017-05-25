const gulp = require('gulp');
const es6Pipeline = require('gulp-webpack-es6-pipeline');
 
es6Pipeline.registerBuildGulpTasks(
  gulp,
  {
    entryPoints: {
      'BUNDLE_NAME': 'PATH_TO_ENTRY_POINT'
    },
    outputDir: 'PATH_TO_BUNDLE_OUTPUT_DIRECTORY'
  }
);