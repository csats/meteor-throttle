'use strict';

var apiThrottle = new Throttle({
  operation: 'api query',
  max: 2,
  period: moment.duration(1, 'hour')
});

Tinytest.add('can parse period', function (test) {
  var referenceDate = moment('2015-06-19 14:28:00').toDate();
  var expected = moment('2015-06-18 14:28:00').toDate();
  var actual = Throttle._parsePeriod(moment.duration(1, 'd'), referenceDate);
  test.equal(actual, expected);
});

Tinytest.add('can rate limit', function (test) {
  test.isTrue(apiThrottle.isBelow(), 'bad start state');
  apiThrottle.up();
  apiThrottle.up();
  var isBelow = apiThrottle.up();
  test.isFalse(isBelow, 'bad end state');
});

Tinytest.add('can reset rate limiter', function (test) {
  apiThrottle.up();
  apiThrottle.up();
  apiThrottle.up();
  apiThrottle.reset();
  test.isTrue(apiThrottle.isBelow(), 'reset failed');
});
