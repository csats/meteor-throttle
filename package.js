'use strict';

Package.describe({
  name: 'csats:throttle',
  version: '0.0.1',
  summary: 'Simple rate-limiter for Meteor applications.',
  git: 'https://github.com/csats/meteor-throttle',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('check');
  api.use('mongo');
  api.use('grigio:babel@0.1.2');
  api.use('momentjs:moment@2.9.0');
  api.addFiles('throttle.es6.js', 'server');
  api.export('Throttle');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mongo');
  api.use('csats:throttle');
  api.use('grigio:babel@0.1.2');
  api.use('momentjs:moment@2.9.0');
  api.addFiles('throttle-tests.js', 'server');
});
